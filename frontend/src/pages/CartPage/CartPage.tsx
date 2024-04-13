import React, { useCallback, useContext, useEffect, useState } from 'react'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import { Children, Product } from '../../types/ProductType'
import { useCartRequests, useProductRequests } from '../../hooks/useBackendRequests'
import { CartType } from '../../types/CartType'
import { AuthContext } from '../../contexts/AuthContext'
import { LoadingContext } from '../../contexts/LoadingContext'
import styles from "./CartPage.module.css"

type Props = {}

type ProductPersonalized = Product & {
    child: Children | null
}

const CartPage = (props: Props) => {
    const [cart, setCart] = useState<CartType | null>(null)
    const [products, setProducts] = useState<ProductPersonalized[]>([])
    const { tokens } = useContext(AuthContext)

    const { getCart } = useCartRequests()
    const { getProduct, getProductChildren } = useProductRequests()
    const { setIsLoading } = useContext(LoadingContext)

    const handleData = (data: CartType) => {
        setCart(data)
    }

    const handleChildren = useCallback((product: Product, children: Children[] | null, childId: Number | null) => {
        if(children){
            const chosenChild = children.find(child => child.id === childId) || children.find(child => child.quantity >= 1) || children[0]
            setProducts(oldValues => [...oldValues, {...product, child: chosenChild}])
        }
    }, [])

    const handleProduct = useCallback((data: Product, childId: Number | null) => {
        if(data.has_variations){
            getProductChildren({
                productId: data.id,
                callback: (children) => handleChildren(data, children, childId),
                setIsLoading: setIsLoading
            })
        }else{
            setProducts(oldValue => [...oldValue, {...data, child: null}])
        }
    }, [getProductChildren, handleChildren, setIsLoading])

    useEffect(() => {
        if(tokens.refresh){
            getCart({callback: handleData}) 
        }
    }, [tokens.refresh, getCart])

    useEffect(() => {
        if(cart){
            cart.products.map(product => {
                return getProduct({
                    productId: product.id,
                    isAuthenticated: true,
                    callback: (data) => handleProduct(data, product.child),
                    setIsLoading: setIsLoading
                })
            })
        }
    }, [cart, getProduct, handleProduct, setIsLoading])

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <div>CartPage</div>
                <div className={styles.container}>
                    {products && products.map(product => (
                        <div key={product.id}>{product.name}</div>
                    ))}
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default CartPage