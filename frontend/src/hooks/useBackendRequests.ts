import { useCallback, useContext } from 'react'
import { useAxiosPrivate } from './useAxiosPrivate'
import { LoadingContext } from '../contexts/LoadingContext'
import { axios } from '../services/api';
import { Children } from '../types/ProductType';
import { UserContext } from '../contexts/UserContext';
import { CartType } from '../types/CartType';

type FavoritesProps = {
    productId: number
    childId?: number | null
    callback: ({ productId } : { productId?: number }) => void
    callbackArgs?: {
        productId: number
    }
}

type AccountProps = {
    callback: ({ sent } : { sent: boolean }) => void
}

type CartProps = {
    callback: (data: CartType) => void
}

export const useCartRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const getCart = useCallback(async({ callback } : CartProps) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/cart/')
            if(response.status === 200){
                const data: CartType = response.data
                callback(data)
            }
        } catch (error) {

        }
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return {getCart}
}

export const useFavoritesRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)
    const { setUser } = useContext(UserContext)

    const addToFavorites = useCallback(async ({ productId, callback, callbackArgs } : FavoritesProps) => {
        setIsLoading(true)
        try {
            const URL = `/favorites/create/${productId}`
            const response = await axiosPrivate.post(URL)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
                setUser(oldValue => {
                    return {...oldValue, wishlist_quantity: oldValue.wishlist_quantity + 1}
                })
            }
        } catch (error) {

        }   
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])
    
    const removeFromFavorites = useCallback(async ({ productId, callback, callbackArgs } : FavoritesProps) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.delete(`/favorites/delete/${productId}`)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
                setUser(oldValue => {
                    return {...oldValue, wishlist_quantity: oldValue.wishlist_quantity - 1}
                })
            }
        } catch (error) {

        } 
        setIsLoading(false)  
    }, [axiosPrivate, setIsLoading, setUser])

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
            // if(originalAxios.isAxiosError(error)){
            //     console.log(error)
            // }
        }
        setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return { sendAccountVerificationCode }
}

type GetProductChildrenArgs = { 
    productId: number, 
    callback: (data: Children[] | null) => void | React.Dispatch<React.SetStateAction<Children[] | null>> 
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

export const useProductRequests = () => {

    const getProductChildren = useCallback(async ({ productId, callback, setIsLoading }: GetProductChildrenArgs) => {
        setIsLoading && setIsLoading(true)
        try {
            const response = await axios.get(`/products/${productId}/children`)
            if(response.status === 200){
                const data: Children[] = response.data
                callback(data)
            }
        } catch (error) {
            callback(null)
        }
        setIsLoading && setIsLoading(false)
    }, [])

    return { getProductChildren }
}