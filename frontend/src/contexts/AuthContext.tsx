import { createContext, useEffect, useState, useCallback } from "react";
import { axios } from "../services/api";
import * as OriginalAxios from 'axios'
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';
import { SIGN_IN_PATH } from "../routes";

type Props = {
    children: React.ReactNode
}

type TokensType = {
    access: string | null,
    refresh: string | null
}

type AuthContextType = {
    tokens: TokensType,
    isAuthenticated: boolean,
    areTokensUpdated: boolean,
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
    isAuthenticated: false,
    areTokensUpdated: false,
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialValue.isAuthenticated)
    const [areTokensUpdated, setAreTokensUpdated] = useState<boolean>(initialValue.areTokensUpdated)

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

    const logout = useCallback(({ redirect=true, href=SIGN_IN_PATH } : LogoutPropsType={}) => {
        try {
            setTokens(prev => {
                return {...prev, access: null, refresh: null}
            })
            setIsAuthenticated(false)
            setAreTokensUpdated(false)
            Cookies.remove('token')
            redirect && navigate(href)
        } catch (error) {
            
        }
    }, [navigate])

    const refreshTokens = useCallback(async (refreshToken: string) => {
        try {
            setAreTokensUpdated(false)
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
        } finally {
            setAreTokensUpdated(true)
        }
    }, [logout, storeToken])

    useEffect(() => setIsAuthenticated(!!tokens.refresh), [tokens])

    useEffect(() => {
        (async() => {
            const refreshToken = getClientToken()
    
            if(refreshToken){
                await refreshTokens(refreshToken)
            }else{
                setAreTokensUpdated(true)
            }
        })()
    }, [refreshTokens, getClientToken])


    useEffect(() => {
        const intervaloTokens = setInterval(async() => {
            if(tokens.refresh){
                await refreshTokens(tokens.refresh)
            }
        }, 15 * 60 * 1000)

        return () => {
            clearInterval(intervaloTokens)
        }
        
    }, [tokens.refresh, refreshTokens])


    return (
        <AuthContext.Provider value={{tokens, isAuthenticated, areTokensUpdated, setTokens, refreshTokens, getClientToken, storeToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}