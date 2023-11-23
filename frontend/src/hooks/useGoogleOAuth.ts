import { useCallback, useContext, useEffect, useState } from 'react'
import { axios } from '../services/api'
import { CredentialResponseType } from '../types/GoogleType'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import * as originalAxios from 'axios'

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<{title: string, text: string, isError: boolean} | null>>
    oAuthButtonsRef: React.MutableRefObject<{ google: HTMLDivElement | null; apple: HTMLDivElement | null; }>
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}
 
export const useGoogleOAuth = ({ oAuthButtonsRef, setMessage, setIsLoading }: Props) => {
    const navigate = useNavigate()
    const { storeToken, setTokens } = useContext(AuthContext)

    const googleOAuthClientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

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
                    type: 'standard',
                    size: 'large',
                    logo_alignment: 'center',
                    width: '400'
                }
            )
        }
    }, [googleOAuthClientId, handleGoogleAuthentication, oAuthButtonsRef])

    const initializeGoogleAccounts = useCallback(async () => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        document.head.appendChild(script)

        script.onload = () => setScriptLoaded(true)
    }, [])

    useEffect(() => {
        if(scriptLoaded){
            initializeSettings()
        }
    }, [scriptLoaded, initializeSettings])

    return { initializeGoogleAccounts }
}