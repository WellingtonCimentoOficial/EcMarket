import { createContext, useEffect, useState, useCallback } from "react";
import { axios } from "../services/api";
import * as OriginalAxios from 'axios'
import { useNavigate } from "react-router-dom";

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

    const logout = useCallback(({ redirect=true, href='/account/sign-in' } : LogoutPropsType={}) => {
        setTokens(prev => {
            return {...prev, access: null, refresh: null}
        })
        localStorage.removeItem('token')
        redirect && navigate(href)
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
                if(error.response?.data.cod === 35 || error.response?.status === 401 || error.code === 'ERR_NETWORK'){
                    logout()
                }
                return Promise.resolve()
            }
        }
    }, [logout])

    const getClientToken = useCallback(() => {
        const token = localStorage.getItem('token')
        return token
    }, [])

    const storeToken = (token: string) => {
        localStorage.setItem('token', token)
    }


    useEffect(() => {
        (async () => {
            try {
                const refreshToken = getClientToken()
                if(refreshToken){
                    const newTokens = await refreshTokens(refreshToken)
                    setTokens(prev => {
                        return {...prev, access: newTokens?.access, refresh: newTokens?.refresh}
                    })
                }
            } catch (error) {
                
            }
        })()
    }, [getClientToken, refreshTokens, setTokens])


    return (
        <AuthContext.Provider value={{tokens, setTokens, refreshTokens, getClientToken, storeToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}