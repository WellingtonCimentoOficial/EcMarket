import React from 'react'
import styles from "./SimpleProductCard.module.css"
import { Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import StarRating from '../../Ratings/StarRating/StarRating'
import { useSlug } from '../../../../hooks/useSlug'

type Props = {
    data: Product
    showDiscountPercentage?: boolean
    showRating?: boolean
}

const SimpleProductCard: React.FC<Props> = ({ data, showDiscountPercentage = false, showRating = false }) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    return (
        <div className={styles.wrapper}>
            <a className={styles.container} href={`/${createSlug(data.name)}/p/${data.id}`}>
                <div className={styles.header}>
                    <div className={styles.containerImage}>
                        <img className={styles.image} src={data.children[0].images.principal_image} alt="" />
                    </div>
                    <div className={styles.containerText}>
                        <h3 className={styles.title}>{data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}</h3>
                        {data.description && 
                            <p className={styles.description}>{data.description.length > 25 ? `${data.description.slice(0, 25)}...` : data.description}</p>
                        }
                        {showRating && 
                            <div className={styles.containerRating}>
                                <StarRating rate={data.rating.average} />
                                <span className={styles.ratingText}>{`(${data.rating.count})`}</span>
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.containerPrices}>
                        {data.children[0].discount_price ? (
                            <>
                                <span className={styles.discountPrice}>{CurrencyFormatter(data.children[0].discount_price)}</span>
                                <span className={styles.defaultPrice}>{CurrencyFormatter(data.children[0].default_price)}</span>
                            </>
                        ): (
                            <span className={styles.discountPrice}>{CurrencyFormatter(data.children[0].default_price)}</span>
                        )}
                    </div>
                    <span className={styles.installments}>em até {data.children[0].installment_details.installments}x de {CurrencyFormatter(data.children[0].installment_details.installment_price)} sem juros</span>
                </div>
                { showDiscountPercentage && data.children[0].discount_percentage &&
                    <div className={styles.containerPercentage}>
                        <span className={styles.discountPercentage}>{Math.floor(data.children[0].discount_percentage)}%</span>
                    </div>
                }
            </a>
        </div>
    )
}

export default SimpleProductCard