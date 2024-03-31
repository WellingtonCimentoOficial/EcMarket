import React, { useContext, useEffect, useState } from 'react'
import styles from './HorizProductCard.module.css'
import { Children, Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router-dom'
import { useSlug } from '../../../../hooks/useSlug'
import BtnB01 from '../../Buttons/BtnB01/BtnB01'
import BtnB02 from '../../Buttons/BtnB02/BtnB02'
import { LoadingContext } from '../../../../contexts/LoadingContext'
import { useProductRequests } from '../../../../hooks/useBackendRequests'

type Props = {
    product: Product
    addToCartCallback?: () => void
    removeFromFavoritesCallback?: () => void
}

const HorizProductCard = ({ product, addToCartCallback, removeFromFavoritesCallback }: Props) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    const navigate = useNavigate()

    const { setIsLoading } = useContext(LoadingContext)
    const [child, setChild] = useState<Children | null>(null)
    const { getProductChildren } = useProductRequests()

    const handleChildren = (data: Children[] | null) => {
        if(data){
            const childrenWithQuantityAvailable = data.filter(child => child.quantity > 0)
            const childWithGreaterDiscount = childrenWithQuantityAvailable.reduce(
                (previousChild, currentChild) => (currentChild.discount_percentage || 0) > (previousChild.discount_percentage || 0) ? currentChild : previousChild
            )
            setChild(childWithGreaterDiscount)
        }
    }

    useEffect(() => {
        if(product.has_variations){
            getProductChildren({productId: product.id, callback: handleChildren, setIsLoading: setIsLoading})
        }
    }, [product.id, product.has_variations, setIsLoading, getProductChildren])

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        navigate(`/${createSlug(product.name)}/p/${product.id}?child=${child?.id}`)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerImage}>
                    <div className={styles.flexImage}>
                        <img 
                            className={styles.image}
                            src={product.has_variations ? child?.images.principal_image : product.images.principal_image} 
                            alt={product.name} 
                        />
                    </div>
                </div>
                <div className={styles.containerContent}>
                    <div className={styles.header}>
                        <a className={styles.title} href={`/${createSlug(product.name)}/p/${product.id}?child=${child?.id}`} onClick={handleClick}>
                            {(() => {
                                if(product.has_variations){
                                    const variantDescriptionsFormatted = child?.product_variant.map(
                                        (variant, index) => (index + 1) !== child?.product_variant.length ? 
                                        `${variant.description} ` : 
                                        `(${variant.description})`
                                    )
                                    const formattedName = `${product?.name} - ${variantDescriptionsFormatted}`
                                    const shortenedName = formattedName.length > 80 ? `${formattedName.slice(0, 80)}...` : formattedName
                                    return shortenedName
                                }
                                return product.name
                            })()}
                        </a>
                        <span className={styles.text}>
                            {product.description && product.description.length > 90 ? `${product.description?.slice(0, 90)}...` : product.description}
                        </span>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.bodyPrices}>
                            <span className={styles.price}>
                                {CurrencyFormatter((product.has_variations && child?.default_price) ? child.default_price : (product.default_price || 0))}
                            </span>
                            {(product.has_variations && child?.discount_price) || product.discount_price ? (
                                <span className={styles.discount_price}>
                                    {CurrencyFormatter((product.has_variations && child?.discount_price) ? child.discount_price : (product.discount_price || 0))}
                                </span>
                            ): null}
                        </div>
                        <span className={styles.text}>
                            ou 12x {CurrencyFormatter((product.has_variations && child?.installment_details?.installment_price) ? child.installment_details.installment_price : (product.installment_details?.installment_price || 0))} sem juros
                        </span>
                    </div>
                </div>
                <div className={styles.containerControllers}>
                    <BtnB01 
                        onClick={() => addToCartCallback && addToCartCallback()}
                        autoWidth 
                        className={styles.flexController}>
                            Adicionar ao Carrinho
                    </BtnB01>
                    <BtnB02 
                        onClick={() => removeFromFavoritesCallback && removeFromFavoritesCallback()}
                        autoWidth 
                        className={styles.flexController}>
                            Excluir
                    </BtnB02>
                </div>
            </div>
        </div>
    )
}

export default HorizProductCard