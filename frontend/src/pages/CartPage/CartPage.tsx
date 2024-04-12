import React, { useContext, useEffect, useState } from 'react'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import { Product } from '../../types/ProductType'
import { useCartRequests } from '../../hooks/useBackendRequests'
import { CartType } from '../../types/CartType'
import { AuthContext } from '../../contexts/AuthContext'

type Props = {}

const CartPage = (props: Props) => {
    const [products, setProducts] = useState<Product[]>([])
    const { tokens } = useContext(AuthContext)

    const { getCart } = useCartRequests()

    const handleData = (data: CartType) => {
        setProducts(data.products)
        console.log(data)
    }

    useEffect(() => {
        if(tokens.refresh){
            getCart({callback: handleData}) 
        }
    }, [tokens.refresh, getCart])

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <div>CartPage</div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default CartPage