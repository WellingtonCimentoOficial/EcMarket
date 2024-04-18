import { useCallback, useContext } from 'react'
import { useAxiosPrivate } from './useAxiosPrivate'
import { LoadingContext } from '../contexts/LoadingContext'
import { axios } from '../services/api';
import { Children, Product } from '../types/ProductType';
import { UserContext } from '../contexts/UserContext';
import { CartDetailsType, CartType } from '../types/CartType';
import { FavoriteType } from '../types/FavoritesType';
import { Category } from '../types/CategoryType';

type LoadingHandlerType = {
    setIsLoadingHandler?: React.Dispatch<React.SetStateAction<boolean>>
}

type FavoritesProps = LoadingHandlerType & {
    productId: number
    childId?: number | null
    callback: ({ productId, childId } : { productId?: number, childId?: number }) => void
    callbackArgs?: {
        productId: number
        childId?: number
    }
}

type GetFavoritesProps = LoadingHandlerType & {
    callback: (data: FavoriteType) => void
}

type AccountProps = LoadingHandlerType & {
    callback: ({ sent } : { sent: boolean }) => void
}

type CartProps = LoadingHandlerType & {
    callback: (data: CartType[]) => void
}

type AddToCartProps = CartProps & {
    productId: number
    childId?: number
    quantity: number
}

type UpdateCartProps = LoadingHandlerType & {
    cartId: number
    quantity: number
    callback: (data: CartType) => void
    errorCallback?: () => void
}

type DeleteCartProps = LoadingHandlerType & {
    cartId: number
    callback: () => void
    errorCallback?: () => void
}

type getCartDetailsProps = LoadingHandlerType & {
    callback: (data: CartDetailsType) => void
}

type DefaultProductRequestsArgs = LoadingHandlerType & {
    productId: number
    isAuthenticated?: boolean
}

type GetProductChildrenArgs = DefaultProductRequestsArgs & { 
    callback: (data: Children[] | null) => void | React.Dispatch<React.SetStateAction<Children[] | null>> 
}

type GetProductArgs = DefaultProductRequestsArgs & {
    callback: (data: Product) => void
}

type GetCategoriesProps = LoadingHandlerType  & {
    callback: (data: Category[]) => void
    limit?: number
    minProductCount?: number
    maxProductCount?: number
    random?: boolean
}
export const useCartRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)
    const { setUser } = useContext(UserContext)

    const getCart = useCallback(async({ callback, setIsLoadingHandler } : CartProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/cart/')
            if(response.status === 200){
                const data: CartType[] = response.data
                callback(data)
            }
        } catch (error) {

        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    const getCartDetails = useCallback(async({ callback, setIsLoadingHandler } : getCartDetailsProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/cart/details')
            if(response.status === 200){
                const data: CartDetailsType = response.data
                callback(data)
                setUser(oldValue => {
                    return {...oldValue, cart_quantity: data.products_quantity}
                })
            }
        } catch (error) {

        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])

    const addToCart = useCallback(async({ productId, childId, quantity, callback, setIsLoadingHandler} : AddToCartProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.post(`/cart/create/${productId}`, {childId, quantity})
            if(response.status === 200 || response.status === 201){
                const data: CartType[] = response.data
                callback(data)
                setUser(oldValue => {
                    return {...oldValue, cart_quantity: oldValue.cart_quantity + quantity}
                })
            }
        } catch (error) {
            
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])

    const updateCart = useCallback(async({ cartId, quantity, setIsLoadingHandler, callback, errorCallback } : UpdateCartProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.put(`/cart/update/${cartId}`, {quantity})
            if(response.status === 200){
                const data: CartType = response.data
                callback(data)
                setUser(oldValue => {
                    return {...oldValue, cart_quantity: oldValue.cart_quantity + quantity}
                })
            }
        } catch (error) {
            errorCallback && errorCallback()
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])

    const deleteCart = useCallback(async({ cartId, setIsLoadingHandler, callback, errorCallback } : DeleteCartProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.delete(`/cart/delete/${cartId}`)
            if(response.status === 200 || response.status === 204){
                callback()
            }
        } catch (error) {
            errorCallback && errorCallback()
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return {getCart, getCartDetails, addToCart, updateCart, deleteCart}
}

export const useFavoritesRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)
    const { setUser } = useContext(UserContext)

    const getFavorites = useCallback(async ({ callback, setIsLoadingHandler } : GetFavoritesProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/favorites/')
            if(response.status === 200){
                const data: FavoriteType = response.data
                callback(data)
            }
        } catch (error) {
            
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    const addToFavorites = useCallback(async ({ productId, childId, callback, callbackArgs, setIsLoadingHandler } : FavoritesProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const URL = `/favorites/create/${productId}`
            const response = await axiosPrivate.post(URL, {childId})
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId })
                setUser(oldValue => {
                    return {...oldValue, wishlist_quantity: oldValue.wishlist_quantity + 1}
                })
            }
        } catch (error) {

        }   
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])
    
    const removeFromFavorites = useCallback(async ({ productId, childId, callback, callbackArgs, setIsLoadingHandler } : FavoritesProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const URL = childId ? `/favorites/delete/${productId}?child=${childId}` : `/favorites/delete/${productId}`
            const response = await axiosPrivate.delete(URL)
            if(response.status === 200){
                callback({ productId: callbackArgs?.productId, childId: callbackArgs?.childId })
                setUser(oldValue => {
                    return {...oldValue, wishlist_quantity: oldValue.wishlist_quantity - 1}
                })
            }
        } catch (error) {

        } 
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading, setUser])

    return { getFavorites, addToFavorites, removeFromFavorites }
}

export const useAccountRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const sendAccountVerificationCode = useCallback(async ({ callback, setIsLoadingHandler } : AccountProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
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
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return { sendAccountVerificationCode }
}


export const useProductRequests = () => {
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)

    const getProduct = useCallback(async ({ productId, isAuthenticated, setIsLoadingHandler, callback }: GetProductArgs) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const path = `/products/${productId}`
            const response = isAuthenticated ? await axiosPrivate.get(path) : await axios.get(path)
            if(response.status === 200){
                const data: Product = await response.data
                callback(data)
            }
        } catch (error) {
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    const getProductChildren = useCallback(async ({ productId, isAuthenticated, callback, setIsLoadingHandler }: GetProductChildrenArgs) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const path = `/products/${productId}/children`
            const response = isAuthenticated ? await axiosPrivate.get(path) : await axios.get(path)
            if(response.status === 200){
                const data: Children[] = response.data
                callback(data)
            }
        } catch (error) {
            callback(null)
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [axiosPrivate, setIsLoading])

    return { getProduct, getProductChildren }
}

export const useCategoriesRequests = () => {
    const { setIsLoading } = useContext(LoadingContext)

    const getCategories = useCallback(async({ limit=1, maxProductCount=20, minProductCount=10, random=true, callback, setIsLoadingHandler } : GetCategoriesProps) => {
        setIsLoadingHandler ? setIsLoadingHandler(true) : setIsLoading(true)
        try {
            const URL = `/categories/?limit=${limit}&min_product_count=${minProductCount}&max_product_count=${maxProductCount}&random=${random}`
            const response = await axios.get(URL)
            if(response.status === 200){
                const data: Category[] = response.data.results
                callback(data)
            }
        } catch (error) {
        }
        setIsLoadingHandler ? setIsLoadingHandler(false) : setIsLoading(false)
    }, [setIsLoading])

    return {getCategories}
}