import { useCallback, useContext, useEffect, useState } from 'react'
import { axios } from '../services/api'
import { CredentialResponseType, GoogleButtonType } from '../types/GoogleType'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import * as originalAxios from 'axios'
import { useIsScriptAlreadyAdded } from './useIsScriptAlreadyAddes'

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<{title: string, text: string, isError: boolean} | null>>
    oAuthButtonsRef: React.MutableRefObject<{ google: HTMLDivElement | null; apple: HTMLDivElement | null; }>
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
    config: GoogleButtonType
}
 
export const useGoogleOAuth = ({ config, oAuthButtonsRef, setMessage, setIsLoading }: Props) => {
    const navigate = useNavigate()
    const { storeToken, setTokens } = useContext(AuthContext)

    const googleOAuthClientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

    const { isScriptAlreadyAdded } = useIsScriptAlreadyAdded()

    const scriptSrc = `https://accounts.google.com/gsi/client`

    const handleGoogleAuthentication = useCallback(async (googleResponse: CredentialResponseType) => {
        setIsLoading && setIsLoading(true)
        try {
            const response = await axios.post('/accounts/sign-in/google/token/', {
                token: googleResponse.credential
            })
            if(response.status === 200){
                setMessage(null)
                setTokens(response.data)
                storeToken(response.data.refresh)
                navigate('/')
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 1){
                    setMessage({
                        title: 'Autenticação Inválida',
                        text: 'Esse método de autenticação não está disponível para sua conta.',
                        isError: true
                    })
                }else if(error.response?.data.cod === 2){
                    setMessage({
                        title: 'Token Inválido',
                        text: 'Token do google oauth inválido',
                        isError: true
                    })
                }else if(error.response?.data.cod === 3){
                    setMessage({
                        title: 'Ocorreu um erro',
                        text: 'Não foi possível validar o Google Oauth Token',
                        isError: true
                    })
                }
            }
        }
        setIsLoading && setIsLoading(false)
    }, [navigate, setTokens, storeToken, setMessage, setIsLoading])

    const initializeSettings = useCallback(() => {
        window.google?.accounts?.id.initialize({
            client_id: googleOAuthClientId,
            callback: handleGoogleAuthentication,
            login_uri: 'http://localhost:3000/'
        })

        if(oAuthButtonsRef.current.google){
            window.google?.accounts?.id.renderButton(
                oAuthButtonsRef.current.google, {
                    type: config.type,
                    theme: config.theme,
                    size: config.size,
                    text: config.text,
                    shape: config.shape,
                    logo_alignment: config.logo_alignment,
                    width: config.width,
                    locale: config.locale,
                    click_listener: config.click_listener
                }
            )
        }
    }, [
        googleOAuthClientId, handleGoogleAuthentication, oAuthButtonsRef,
        config.type, config.theme, config.size, config.text, config.shape,
        config.logo_alignment, config.width, config.locale, config.click_listener
    ])

    const initializeGoogleAccounts = useCallback(async () => {
        if(!isScriptAlreadyAdded(scriptSrc)){
            const script = document.createElement('script')
            script.src = scriptSrc
            script.async = true
            document.head.appendChild(script)
    
            script.onload = () => setScriptLoaded(true)
        }else{
            setScriptLoaded(true)
        }
    }, [scriptSrc, isScriptAlreadyAdded])

    useEffect(() => {
        if(scriptLoaded){
            initializeSettings()
        }
    }, [scriptLoaded, initializeSettings])

    return { initializeGoogleAccounts }
}