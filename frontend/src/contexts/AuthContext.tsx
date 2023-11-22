import { createContext, useEffect, useState, useCallback } from "react";
import { axios } from "../services/api";

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

export const AuthContext = createContext<AuthContextType>(initialValue)

export const AuthContextProvider = ({children}: Props) => {
    const [tokens, setTokens] = useState<TokensType>(initialValue.tokens)

    const logout = useCallback(() => {
        setTokens(prev => {
            return {...prev, access: null, refresh: null}
        })
        localStorage.removeItem('token')
    }, [])

    const refreshTokens = useCallback(async (refreshToken: string) => {
        try {
            const response = await axios.post('/accounts/sign-in/token/refresh/', {
                'refresh': refreshToken
            }, {
                validateStatus: function(status) {
                    return status === 200 || status === 401
                }
            })
            if(response.status === 200){
                setTokens(prev => {
                    return {...prev, refresh: response.data.refresh}
                })
                storeToken(response.data.refresh)
                return response.data
            }else if(response.status === 401){
                logout()
                return null
            }
        } catch (error) {
            return null
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
        // (async () => {
        //     console.log('aquii no useefecct')
        //     const refreshToken = getClientToken()
        //     refreshToken && await refreshTokens(refreshToken)
        // })()
        const refreshToken = getClientToken()
        setTokens(prev => {
            return {...prev, refresh: refreshToken}
        })
    }, [getClientToken, refreshTokens])

    return (
        <AuthContext.Provider value={{tokens, setTokens, refreshTokens, getClientToken, storeToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}