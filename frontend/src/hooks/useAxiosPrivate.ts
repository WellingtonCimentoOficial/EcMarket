import { useContext, useEffect } from "react"
import { axiosAuth } from "../services/api"
// import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios"
import { AuthContext } from "../contexts/AuthContext"

export const useAxiosPrivate = () => {
    const { tokens } = useContext(AuthContext)

    // useEffect(() => {
    //     const requestIntercept = axiosAuth.interceptors.request.use(
    //         async (config) => {
    //             if (!config.headers['Authorization']) {
    //                 config.headers.Authorization = `Bearer ${tokens.access}`
    //             }
    //             return config
    //         },
    //         (error) => Promise.reject(error)
    //     )
        
    //     const responseIntercept = axiosAuth.interceptors.response.use(
    //         (response: AxiosResponse) => response,
    //         async (error: AxiosError) => {
    //             const prevRequest = error.config as AxiosRequestConfig & { sent?: boolean }
    //             if (error.response?.status === 401 && !prevRequest?.sent && !isRefreshing) {
    //                 prevRequest.sent = true
                    
    //                 try {
    //                     const refreshToken = getClientToken()
    //                     if (refreshToken) {
    //                         const newTokens = await refreshTokens(refreshToken)
    //                         console.log("aaaa", newTokens)
    //                         axiosAuth.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.access
    //                         prevRequest.headers = prevRequest.headers || {}
    //                         prevRequest.headers['Authorization'] = 'Bearer ' + newTokens.access
    //                         return axiosAuth(prevRequest)
    //                     }
    //                 } catch (error) {
    //                     // Tratar erros de atualização de tokens
    //                 }
    //             }
    //             return Promise.reject(error)
    //         }
    //     )
          
    //     return () => {
    //         axiosAuth.interceptors.request.eject(requestIntercept)
    //         axiosAuth.interceptors.request.eject(responseIntercept)
    //     }
    // }, [tokens, refreshTokens, setTokens, getClientToken, isRefreshing])

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization'] && tokens.access) {
                    config.headers.Authorization = `Bearer ${tokens.access}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )
          
        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept)
        }

    }, [tokens.access])

    return axiosAuth
}