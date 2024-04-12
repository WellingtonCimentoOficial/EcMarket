import { createContext, useEffect, useState, useCallback } from "react";
import { axios } from "../services/api";
import * as OriginalAxios from 'axios'
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';

type Props = {
    children: React.ReactNode
}

type TokensType = {
    access: string | null,
    refresh: string | null
}

type AuthContextType = {
    tokens: TokensType,
    setTokens: React.Dispatch<React.SetStateAction<TokensType>>
    getClientToken: () => string | null
    storeToken: (token: string) => void
    logout: () => void
    refreshTokens: (refreshToken: string) => Promise<any> | null
}

const initialValue: AuthContextType = {
    tokens: {
        access: null, 
        refresh: null
    },
    setTokens: () => {},
    getClientToken: () => null,
    storeToken: () => {},
    logout: () => {},
    refreshTokens: async () => {
        return null
    },
}

type LogoutPropsType = {
    redirect?: boolean
    href?: string
}

export const AuthContext = createContext<AuthContextType>(initialValue)

export const AuthContextProvider = ({children}: Props) => {
    const [tokens, setTokens] = useState<TokensType>(initialValue.tokens)

    const navigate = useNavigate()

    const encryptionKey: string = process.env.REACT_APP_TOKEN_ENCRYPTION_KEY ?? ''
    
    const encryptToken = useCallback((token: string) => {
        try {
            return CryptoJS.AES.encrypt(token, encryptionKey).toString()
        } catch (error) {
            return token    
        }
    }, [encryptionKey])
    
    const decryptToken = useCallback((encryptedToken: string) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, encryptionKey)
            return bytes.toString(CryptoJS.enc.Utf8)
        } catch (error) {
            return encryptedToken
        }
    }, [encryptionKey])

    const getClientToken = useCallback(() => {
        try {
            const tokenEncrypted = Cookies.get('token')
            const tokenDecrypted = tokenEncrypted ? decryptToken(tokenEncrypted) : null
            return tokenDecrypted
        } catch (error) {
            return null
        }
    }, [decryptToken])

    const storeToken = useCallback((token: string) => {
        try{
            const tokenEncrypted = encryptToken(token)
            Cookies.set('token', tokenEncrypted, { expires: 60 })
        }catch (error){

        }
    }, [encryptToken])

    const logout = useCallback(({ redirect=true, href='/account/sign-in' } : LogoutPropsType={}) => {
        try {
            setTokens(prev => {
                return {...prev, access: null, refresh: null}
            })
            Cookies.remove('token')
            redirect && navigate(href)
        } catch (error) {
            
        }
    }, [navigate])

    const refreshTokens = useCallback(async (refreshToken: string) => {
        try {
            const response = await axios.post('/accounts/sign-in/token/refresh/', {
                'refresh': refreshToken
            })
            if(response.status === 200){
                setTokens(prev => {
                    return {...prev, access: response.data.access, refresh: response.data.refresh}
                })
                storeToken(response.data.refresh)
                return response.data
            }
        } catch (error) {
            if(OriginalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 35 || error.response?.status === 401){
                    logout()
                }
                return Promise.resolve()
            }
        }
    }, [logout, storeToken])


    useEffect(() => {
        try {
            const refreshToken = getClientToken()
            if(refreshToken){
                refreshTokens(refreshToken)
            }
        } catch (error) {
            
        }
    }, [getClientToken, refreshTokens, setTokens])


    return (
        <AuthContext.Provider value={{tokens, setTokens, refreshTokens, getClientToken, storeToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}