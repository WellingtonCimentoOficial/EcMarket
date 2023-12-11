import { useCallback, useContext } from 'react'
import { useAxiosPrivate } from './useAxiosPrivate'
import { LoadingContext } from '../contexts/LoadingContext'

type Props = {
    productId: number
    callback: ({ productId } : { productId?: number }) => void
    callbackArgs?: {
        productId: number
    }
}

export const useFavoritesRequest = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const addToFavorites = useCallback(async ({ productId, callback, callbackArgs } : Props) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.post(`/favorites/create/${productId}`)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
            }
        } catch (error) {
        }   
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading])
    
    const removeFromFavorites = useCallback(async ({ productId, callback, callbackArgs } : Props) => {
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
