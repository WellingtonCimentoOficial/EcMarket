import React, { useContext, useEffect, useState } from 'react'
import styles from "./SimpleProductCard.module.css"
import { Children, Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import StarRating from '../../Ratings/StarRating/StarRating'
import { useSlug } from '../../../../hooks/useSlug'
import { LoadingContext } from '../../../../contexts/LoadingContext'
import { useProductRequests } from '../../../../hooks/useBackendRequests'

type Props = {
    data: Product
    showDiscountPercentage?: boolean
    showRating?: boolean
    showRatingFixed?: boolean
}

const SimpleProductCard: React.FC<Props> = ({ data, showDiscountPercentage = false, showRating = false, showRatingFixed = false }) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    const { setIsLoading } = useContext(LoadingContext)
    const [children, setChildren] = useState<Children | null>(null)
    const {  getProductChildren } = useProductRequests()

    const handleChildren = (data: Children[] | null) => {
        if(data){
            const primary = data.find(child => child.product_variant.find(variant => variant.is_primary))
            setChildren(primary || data[0])
        }
    }

    useEffect(() => {
        if(data.has_variations){
            getProductChildren({productId: data.id, callback: handleChildren, setIsLoading: setIsLoading})
        }
    }, [data.id, data.has_variations, getProductChildren, setIsLoading])

    return (
        <div className={styles.wrapper}>
            <a className={styles.container} href={`/${createSlug(data.name)}/p/${data.id}`}>
                <div className={styles.header}>
                    <div className={styles.containerImage}>
                        <img className={styles.image} src={data.has_variations ? children?.images.principal_image : data.images.principal_image} alt="" />
                    </div>
                    <div className={styles.containerText}>
                        <h3 className={styles.title}>{data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}</h3>
                        {data.description && 
                            <p className={styles.description}>{data.description.length > 25 ? `${data.description.slice(0, 25)}...` : data.description}</p>
                        }
                        {showRating && 
                            (data.rating.average || showRatingFixed) &&
                                <div className={styles.containerRating}>
                                    <StarRating rate={data.rating.average} />
                                    <span className={styles.ratingText}>{`(${data.rating.count.toLocaleString('pt-BR')})`}</span>
                                </div>
                        }
                    </div>
                </div>
                <>
                    <div className={styles.body}>
                        <div className={styles.containerPrices}>
                            {(data.has_variations && children?.discount_price) || data.discount_price ? (
                                <>
                                    <span className={styles.discountPrice}>
                                        {CurrencyFormatter((data.has_variations && children?.discount_price) ? children.discount_price : (data.discount_price || 0))}
                                    </span>
                                    <span className={styles.defaultPrice}>
                                        {CurrencyFormatter((data.has_variations && children?.default_price) ? children.default_price : data.default_price)}
                                    </span>
                                </>
                            ):(
                                <span className={styles.discountPrice}>
                                    {CurrencyFormatter((data.has_variations && children?.default_price) ? children.default_price : (data.default_price || 0))}
                                </span>
                            )}
                        </div>
                        <span className={styles.installments}>
                            em até {(data.has_variations && children?.installment_details?.installments) ? 
                            children.installment_details.installments : 
                            data.installment_details?.installments}x de {
                            CurrencyFormatter(
                                (data.has_variations && children?.installment_details?.installment_price) ? 
                                children.installment_details.installment_price : (data.installment_details?.installment_price || 0)
                            )
                            } sem juros
                        </span>
                    </div>
                    {showDiscountPercentage && ((data.has_variations && children?.discount_percentage) || data.discount_percentage) &&
                        <div className={styles.containerPercentage}>
                            <span className={styles.discountPercentage}>
                                {Math.floor((data.has_variations && children?.discount_percentage) ? children.discount_percentage : (data.discount_percentage || 0))}%
                            </span>
                        </div>
                    }
                </>
            </a>
        </div>
    )
}

export default SimpleProductCard