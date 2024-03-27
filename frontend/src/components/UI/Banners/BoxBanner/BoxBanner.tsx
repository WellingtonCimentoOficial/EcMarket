import React, { useState, useEffect, useContext } from 'react'
import styles from "./BoxBanner.module.css"
import { Children, Product } from '../../../../types/ProductType'
import { useSlug } from '../../../../hooks/useSlug'
import { useProductRequests } from '../../../../hooks/useBackendRequests'
import { LoadingContext } from '../../../../contexts/LoadingContext'

type Props = {
    products: Product[]
}
type ProductPersonalized = Product & {
    child?: Children
}

const BoxBanner = ({ products }: Props) => {
    const { createSlug } = useSlug()
    const { getProductChildren } = useProductRequests()
    const { setIsLoading } = useContext(LoadingContext)
    const [customProducts, setCustomProducts] = useState<ProductPersonalized[]>([])
    const [mainProduct, setMainProduct] = useState<ProductPersonalized | null>(null)

    const handleChildren = (data: Children[] | null, product: Product) => {
        if(data){
            const childrenWithQuantityAvailable = data.filter(child => child.quantity > 0)
            const childWithGreaterDiscount = childrenWithQuantityAvailable.reduce(
                (previousChild, currentChild) => (currentChild.discount_percentage || 0) > (previousChild.discount_percentage || 0) ? 
                currentChild : previousChild
            )
            setCustomProducts(prevState => [...prevState, { ...product, child: childWithGreaterDiscount }])
        }
    }

    useEffect(() => {
        products.map(product => {
            if(product.has_variations){
                getProductChildren({
                    productId: product.id, 
                    callback: (data) => handleChildren(data, product), 
                    setIsLoading: setIsLoading
                })
            }else{
                setCustomProducts(prevState => [...prevState, product])
            }
            return null
        })
    }, [products, getProductChildren, setIsLoading])

    useEffect(() => {
        if(customProducts.length === products.length){
            const productWithGreatherDiscount = customProducts.reduce((prevProduct, currentProduct) => {
                if((currentProduct.has_variations ? 
                    (currentProduct.child?.discount_percentage || 0) : 
                    (currentProduct.discount_percentage || 0)) > 
                    (prevProduct.has_variations ? 
                    (prevProduct.child?.discount_percentage || 0) : 
                    (prevProduct.discount_percentage || 0))){
                        return currentProduct
                    }
                return prevProduct
            })
            setMainProduct(productWithGreatherDiscount)
        }
    }, [products, customProducts, setMainProduct])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {mainProduct &&
                    <div className={styles.containerBig}>
                        <div className={styles.flexBig}>
                            <a href={`/${createSlug(mainProduct.name)}/p/${mainProduct.id}`} className={styles.flexBigHeader} title={mainProduct.name}>
                                <img className={styles.flexBigImage} src={mainProduct.has_variations ? mainProduct.child?.images.principal_image : mainProduct.images.principal_image} alt="" />
                                {(mainProduct.has_variations && mainProduct.child?.discount_percentage) || mainProduct.discount_percentage ? (
                                    <div className={styles.discountPercentageContainer}>
                                        <span className={styles.discountPercentage}>
                                            {Math.floor(
                                                (mainProduct.has_variations && mainProduct.child?.discount_percentage) ? 
                                                mainProduct.child.discount_percentage : (mainProduct.discount_percentage || 0)
                                            )}% OFF
                                        </span>
                                    </div>
                                ): null}
                            </a>
                        </div>
                    </div>
                }
                <div className={styles.containerSmall}>
                    <div className={styles.subContainerSmall}>
                        {customProducts.slice(0, 5).map((product) => (
                            <a href={`/${createSlug(product.name)}/p/${product.id}?child=${product.child?.id}`} className={styles.flexSmall} key={product.id} title={product.name}>
                                <img className={styles.flexSmallImage} src={
                                    product.has_variations ? product.child?.images.principal_image : product.images.principal_image} alt="" />
                                {(product.has_variations && product.child?.discount_percentage) || product.discount_percentage ? (
                                    <div className={styles.discountPercentageContainer}>
                                        <span className={styles.discountPercentage}>
                                            {Math.floor(
                                                (product.has_variations && product.child?.discount_percentage) ? 
                                                product.child.discount_percentage : (product.discount_percentage || 0)
                                            )}% OFF
                                        </span>
                                    </div>
                                ): null}
                            </a>
                        ))}
                    </div>
                    <div className={styles.subContainerSmall}>
                        {customProducts.slice(5, 10).map((product) => (
                            <a href={`/${createSlug(product.name)}/p/${product.id}`} className={styles.flexSmall} key={product.id} title={product.name}>
                                <img className={styles.flexSmallImage} src={product.has_variations ? product.child?.images.principal_image : product.images.principal_image} alt="" />
                                {(product.has_variations && product.child?.discount_percentage) || product.discount_percentage ? (
                                    <div className={styles.discountPercentageContainer}>
                                        <span className={styles.discountPercentage}>
                                            {Math.floor(
                                                (product.has_variations && product.child?.discount_percentage) ? 
                                                product.child.discount_percentage : (product.discount_percentage || 0)
                                            )}% OFF
                                        </span>
                                    </div>
                                ): null}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoxBanner