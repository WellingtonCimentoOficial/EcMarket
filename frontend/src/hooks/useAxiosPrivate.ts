import { useContext, useEffect, useState } from "react"
import { axiosAuth } from "../services/api"
import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios"
import { AuthContext } from "../contexts/AuthContext"

export const useAxiosPrivate = () => {
   const { tokens, setTokens, refreshTokens, getClientToken } = useContext(AuthContext)
    
    useEffect(() => {
        console.log("dentro do useAxiosPrivate")
        const requestIntercept = axiosAuth.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    console.log('access token do requestintercept', tokens.access)
                    config.headers.Authorization = `Bearer ${tokens.access}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        )
        
        const responseIntercept = axiosAuth.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const prevRequest = error.config as AxiosRequestConfig & { sent?: boolean };
                console.log('dentro do responseIntercept')
                if (error.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const refreshToken = getClientToken()
                        if(refreshToken){
                            console.log('aquiiiaaaaa')
                            const newTokens = await refreshTokens(refreshToken)
                            console.log('token no intercept', newTokens.access)
                            axiosAuth.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.access;
                            prevRequest.headers = prevRequest.headers || {}
                            prevRequest.headers['Authorization'] = 'Bearer ' + newTokens.access;
                            return axiosAuth(prevRequest);
                        }
                    } catch (error) {
                        console.log('erro ao atualizar o token')
                    }

                }
                return Promise.reject(error);
            }
        )
          
        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept)
            axiosAuth.interceptors.request.eject(responseIntercept)
        }
    }, [tokens, refreshTokens, setTokens])

    return axiosAuth
}