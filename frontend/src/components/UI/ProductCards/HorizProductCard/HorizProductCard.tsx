import React, { useContext, useEffect, useState, useCallback } from 'react'
import styles from './HorizProductCard.module.css'
import { Children, Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router-dom'
import { useSlug } from '../../../../hooks/useSlug'
import BtnB01 from '../../Buttons/BtnB01/BtnB01'
import BtnB02 from '../../Buttons/BtnB02/BtnB02'
import { LoadingContext } from '../../../../contexts/LoadingContext'
import { useCartRequests, useProductRequests } from '../../../../hooks/useBackendRequests'
import { PiCheckLight } from "react-icons/pi";
import { useProductTitle } from '../../../../hooks/useProductTitle'

type Props = {
    product?: Product
    child?: Children
    addToCartCallback?: () => void
    removeFromFavoritesCallback?: () => void
}

const HorizProductCard = ({ product, child, addToCartCallback, removeFromFavoritesCallback }: Props) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    const navigate = useNavigate()

    const { setIsLoading } = useContext(LoadingContext)
    const [localIsLoading, setLocalIsLoading] = useState<boolean>(false)
    const [localProduct, setLocalProduct] = useState<Product | null>(null)
    const [localChild, setLocalChild] = useState<Children | null>(null)
    const { getProduct, getProductChildren } = useProductRequests()
    const { addToCart } = useCartRequests()
    const { titleHandler } = useProductTitle()

    const handleAddToCart = useCallback((hasVariations: boolean) => {
        if(hasVariations){
            setLocalChild(oldValue => {
                if(oldValue){
                    return {...oldValue, is_added_to_cart: true}
                }
                return oldValue
            })
        }else{
            setLocalProduct(oldValue => {
                if(oldValue){
                    return {...oldValue, is_added_to_cart: true}
                }
                return oldValue
            })
        }
    }, [])

    const handleProduct = (data: Product) => {
        setLocalProduct(data)
    }

    const handleChildren = (data: Children[] | null) => {
        if(data){
            const childrenWithQuantityAvailable = data.filter(child => child.quantity > 0)
            const childWithGreaterDiscount = childrenWithQuantityAvailable.reduce(
                (previousChild, currentChild) => (currentChild.discount_percentage || 0) > (previousChild.discount_percentage || 0) ? currentChild : previousChild
            )
            setLocalChild(childWithGreaterDiscount)
        }
    }

    useEffect(() => {
        product && setLocalProduct({...product, is_added_to_cart: false})
        child && setLocalChild({...child, is_added_to_cart: false})
    }, [product, child])

    useEffect(() => {
        if(product?.has_variations){
            getProductChildren({productId: product.id, callback: handleChildren, setIsLoadingHandler: setIsLoading})
        }else if(child){
            getProduct({productId: child.product_father_id, isAuthenticated: false, setIsLoadingHandler: setIsLoading, callback: handleProduct})
        }
    }, [child, product, getProduct, setIsLoading, getProductChildren])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerImage}>
                    <div className={styles.flexImage}>
                        <img 
                            className={styles.image}
                            src={localProduct?.has_variations ? localChild?.images.principal_image : localProduct?.images.principal_image} 
                            alt={localProduct?.name} 
                        />
                    </div>
                </div>
                <div className={styles.containerContent}>
                    <div className={styles.header}>
                        <a className={styles.title} href={`/${createSlug(localProduct?.name ?? '')}/p/${localProduct?.id}${localChild ? `?child=${localChild.id}` : ''}`}>
                            {titleHandler({productName: localProduct?.name ?? "", child: localChild, length: 79*2})}
                        </a>
                        <span className={styles.text}>
                            {localProduct?.description && localProduct?.description.length > 90 ? `${localProduct?.description?.slice(0, 90)}...` : localProduct?.description}
                        </span>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.bodyPrices}>
                            <span className={styles.price}>
                                {CurrencyFormatter((localProduct?.has_variations && localChild?.default_price) ? localChild.default_price : (localProduct?.default_price || 0))}
                            </span>
                            {(localProduct?.has_variations && localChild?.discount_price) || localProduct?.discount_price ? (
                                <span className={styles.discount_price}>
                                    {CurrencyFormatter((localProduct?.has_variations && localChild?.discount_price) ? localChild.discount_price : (localProduct?.discount_price || 0))}
                                </span>
                            ): null}
                        </div>
                        <span className={styles.text}>
                            ou 12x {CurrencyFormatter((localProduct?.has_variations && localChild?.installment_details?.installment_price) ? localChild.installment_details.installment_price : (localProduct?.installment_details?.installment_price || 0))} sem juros
                        </span>
                    </div>
                </div>
                <div className={styles.containerControllers}>
                    <BtnB01 
                        onClick={() => addToCart({
                            productId: localProduct?.id ?? 10**1000,
                            childId: localChild?.id,
                            quantity: 1,
                            callback: () => handleAddToCart(localChild?.id ? true : false),
                            setIsLoadingHandler: setLocalIsLoading
                        })}
                        autoWidth
                        isLoading={localIsLoading}
                        disabled={(localProduct?.has_variations && localChild?.is_added_to_cart) || localProduct?.is_added_to_cart ? true : false}
                        className={styles.flexController}>
                            {(localProduct?.has_variations && localChild?.is_added_to_cart) || localProduct?.is_added_to_cart ? 
                                <div className={styles.btnAddToCart}>
                                    Adicionado
                                    <PiCheckLight className={styles.btnAddToCartIcon} />
                                </div> : 
                                "Adicionar ao Carrinho"
                            }
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