import { useCallback, useContext } from 'react'
import { useAxiosPrivate } from './useAxiosPrivate'
import { LoadingContext } from '../contexts/LoadingContext'
import * as originalAxios from 'axios';
import { useNavigate } from 'react-router-dom';

type FavoritesProps = {
    productId: number
    callback: ({ productId } : { productId?: number }) => void
    callbackArgs?: {
        productId: number
    }
}

type AccountProps = {
    callback: ({ sent } : { sent: boolean }) => void
}

export const useFavoritesRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const navigate = useNavigate()

    const addToFavorites = useCallback(async ({ productId, callback, callbackArgs } : FavoritesProps) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.post(`/favorites/create/${productId}`)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.status === 401){
                    navigate('/account/sign-in')
                }
            }
        }   
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading])
    
    const removeFromFavorites = useCallback(async ({ productId, callback, callbackArgs } : FavoritesProps) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.delete(`/favorites/delete/${productId}`)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
            }
        } catch (error) {
        } 
        setIsLoading(false)  
    }, [axiosPrivate, setIsLoading])

    return { addToFavorites, removeFromFavorites }
}

export const useAccountRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const sendAccountVerificationCode = useCallback(async ({ callback } : AccountProps) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/accounts/verify/code')
            if(response.status === 200){
                callback({ sent: true })
            }
        } catch (error) {
            callback({ sent: false })
            if(originalAxios.isAxiosError(error)){
                console.log(error)
            }
        }
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return { sendAccountVerificationCode }
}