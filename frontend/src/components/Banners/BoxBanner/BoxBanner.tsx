import React from 'react'
import styles from "./BoxBanner.module.css"
import { Product } from '../../../types/ProductType'
import { useSlug } from '../../../hooks/useSlug'

type Props = {
    mainData: Product
    data: Product[]
}

const BoxBanner = ({ mainData, data }: Props) => {
    const { createSlug } = useSlug()
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerBig}>
                    <div className={styles.flexBig}>
                        <a href={`/${createSlug(mainData.name)}/p/${mainData.id}`} className={styles.flexBigHeader} title={mainData.name}>
                            <img className={styles.flexBigImage} src={mainData.children[0].images.principal_image} alt="" />
                        </a>
                    </div>
                </div>
                <div className={styles.containerSmall}>
                    <div className={styles.subContainerSmall}>
                        {data.slice(0, 5).map((product, index) => (
                            <a href={`/${createSlug(product.name)}/p/${product.id}`} className={styles.flexSmall} key={index} title={product.name}>
                                <img className={styles.flexSmallImage} src={product.children[0].images.principal_image} alt="" />
                                {product.children[0].discount_percentage &&
                                    <div className={styles.discountPercentageContainer}>
                                        <span className={styles.discountPercentage}>{Math.floor(product.children[0].discount_percentage)}% OFF</span>
                                    </div>
                                }
                            </a>
                        ))}
                    </div>
                    <div className={styles.subContainerSmall}>
                        {data.slice(5, 10).map((product, index) => (
                            <a href={`/${createSlug(product.name)}/p/${product.id}`} className={styles.flexSmall} key={index} title={product.name}>
                                <img className={styles.flexSmallImage} src={product.children[0].images.principal_image} alt="" />
                                {product.children[0].discount_percentage &&
                                    <div className={styles.discountPercentageContainer}>
                                        <span className={styles.discountPercentage}>{Math.floor(product.children[0].discount_percentage)}% OFF</span>
                                    </div>
                                }
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoxBanner