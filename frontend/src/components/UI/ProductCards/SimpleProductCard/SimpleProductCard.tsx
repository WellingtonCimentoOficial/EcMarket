import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./SimpleProductCard.module.css"
import { Children, Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import StarRating from '../../Ratings/StarRating/StarRating'
import { useSlug } from '../../../../hooks/useSlug'
import { LoadingContext } from '../../../../contexts/LoadingContext'
import { useProductRequests } from '../../../../hooks/useBackendRequests'

type Props = {
    product: Product
    showDiscountPercentage?: boolean
    showRating?: boolean
    showRatingFixed?: boolean
    priceRange?: [number,  number]
    filterBy?: "biggestPrice" | "lowestPrice" | null
}

const SimpleProductCard: React.FC<Props> = ({ 
    product, showDiscountPercentage = false, showRating = false, 
    showRatingFixed = false, priceRange, filterBy }) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    const { setIsLoading } = useContext(LoadingContext)
    const [child, setChild] = useState<Children | null>(null)
    const [children, setChildren]  = useState<Children[] | null>(null)
    const {  getProductChildren } = useProductRequests()

    const handleChildren = useCallback(() => {
        const childrenWithQuantityAvailable = children?.filter(child => child.quantity > 0)
        const minPrice = (priceRange ? priceRange[0] : 0)
        const maxPrice = (priceRange ? priceRange[1] : 10**6)
        const childWithGreaterDiscount = childrenWithQuantityAvailable?.reduce((previousChild, currentChild) => {
            const currentChildRealPrice = currentChild.discount_price || currentChild.default_price
            const previousChildRealPrice = previousChild.discount_price || previousChild.default_price
            if(currentChildRealPrice >= minPrice && currentChildRealPrice <= maxPrice){
                if(filterBy === "biggestPrice"){
                    return currentChildRealPrice > previousChildRealPrice ? currentChild : previousChild
                }else if(filterBy === "lowestPrice"){
                    return currentChildRealPrice < previousChildRealPrice ? currentChild : previousChild
                }
                return (currentChild.discount_percentage || 0) > (previousChild.discount_percentage || 0) ? currentChild : previousChild
            }
            return previousChild
        })
        setChild(childWithGreaterDiscount || null)
    }, [priceRange, filterBy, children])

    useEffect(() => {
        if(product.has_variations){
            getProductChildren({productId: product.id, callback: setChildren, setIsLoading: setIsLoading})
        }
    }, [product.id, product.has_variations, getProductChildren, setIsLoading])

    useEffect(() => {children && handleChildren()}, [children, handleChildren])

    return (
        <div className={styles.wrapper}>
            <a className={styles.container} href={`/${createSlug(product.name)}/p/${product.id}?child=${child?.id}`}>
                <div className={styles.header}>
                    <div className={styles.containerImage}>
                        <img className={styles.image} src={product.has_variations ? child?.images.principal_image : product.images.principal_image} alt="" />
                    </div>
                    <div className={styles.containerText}>
                        <h3 className={styles.title}>
                            {(() => {
                                if(product.has_variations){
                                    const variantDescriptionsFormatted = child?.product_variant.map(
                                        (variant, index) => (index + 1) !== child?.product_variant.length ? 
                                        `${variant.description} ` : 
                                        `(${variant.description})`
                                    )
                                    const formattedName = `${product?.name} - ${variantDescriptionsFormatted}`
                                    const shortenedName = formattedName.length > 40 ? `${formattedName.slice(0, 40)}...` : formattedName
                                    return shortenedName
                                }
                                return product.name
                            })()}
                        </h3>
                        {product.description && 
                            <p className={styles.description}>{product.description.length > 25 ? `${product.description.slice(0, 25)}...` : product.description}</p>
                        }
                        {showRating && 
                            (product.rating.average || showRatingFixed) && (

                                <div className={styles.containerRating}>
                                    <StarRating rate={product.rating.average} />
                                    <span className={styles.ratingText}>{`(${product.rating.count.toLocaleString('pt-BR')})`}</span>
                                </div>
                            )
                        }
                    </div>
                </div>
                <>
                    <div className={styles.body}>
                        <div className={styles.containerPrices}>
                            {(product.has_variations && child?.discount_price) || product.discount_price ? (
                                <>
                                    <span className={styles.discountPrice}>
                                        {CurrencyFormatter((product.has_variations && child?.discount_price) ? child.discount_price : (product.discount_price || 0))}
                                    </span>
                                    <span className={styles.defaultPrice}>
                                        {CurrencyFormatter((product.has_variations && child?.default_price) ? child.default_price : product.default_price)}
                                    </span>
                                </>
                            ):(
                                <span className={styles.discountPrice}>
                                    {CurrencyFormatter((product.has_variations && child?.default_price) ? child.default_price : (product.default_price || 0))}
                                </span>
                            )}
                        </div>
                        <span className={styles.installments}>
                            em até {(product.has_variations && child?.installment_details?.installments) ? 
                            child.installment_details.installments : 
                            product.installment_details?.installments}x de {
                            CurrencyFormatter(
                                (product.has_variations && child?.installment_details?.installment_price) ? 
                                child.installment_details.installment_price : (product.installment_details?.installment_price || 0)
                            )
                            } sem juros
                        </span>
                    </div>
                    {showDiscountPercentage && ((product.has_variations && child?.discount_percentage) || product.discount_percentage) &&
                        <div className={styles.containerPercentage}>
                            <span className={styles.discountPercentage}>
                                {Math.floor((product.has_variations && child?.discount_percentage) ? child.discount_percentage : (product.discount_percentage || 0))}%
                            </span>
                        </div>
                    }
                </>
            </a>
        </div>
    )
}

export default SimpleProductCard