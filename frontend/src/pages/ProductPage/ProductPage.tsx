import React, { useEffect, useState, useContext } from 'react'
import styles from "./ProductPage.module.css"
import { axios } from '../../services/api'
import { useParams } from 'react-router-dom'
import { Product } from '../../types/ProductType'
import { LoadingContext } from '../../contexts/LoadingContext'

type Props = {}

const ProductPage = (props: Props) => {
    const { productName, productId } = useParams()
    const { setIsLoading } = useContext(LoadingContext)

    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        const get_product = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`/products/${productId}`)
                if(response.status === 200){
                    setProduct(response.data)
                }
            } catch (error) {
                setProduct(null)
            }
            setIsLoading(false)
        }
        get_product()
    }, [productId, setIsLoading])
    return (
        <div>ProductPage <b>{product && product.name}</b></div>
    )
}

export default ProductPage