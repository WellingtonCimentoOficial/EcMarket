import React, { useEffect, useState } from 'react'
import styles from './CartProductCard.module.css'
import QuantitySelect from '../../Selects/QuantitySelect/QuantitySelect'
import { PiArrowRightLight } from "react-icons/pi";
import { Children, Product } from '../../../../types/ProductType';
import { useSlug } from '../../../../hooks/useSlug';
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter';
import { useProductTitle } from '../../../../hooks/useProductTitle';
import { useCartRequests } from '../../../../hooks/useBackendRequests';
import { CartType } from '../../../../types/CartType';

type Props = {
    cart: CartType
    setUpdated?: React.Dispatch<React.SetStateAction<boolean>>
    onDeleteCallback: () => void
}

const CartProductCard = ({ cart, setUpdated, onDeleteCallback }: Props) => {
    const { createSlug } = useSlug()
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { titleHandler } = useProductTitle()
    const { updateCart } = useCartRequests()
    const [product, setProduct] = useState<Product>(cart.product_father)
    const [child, setChild] = useState<Children | null>(cart.product_child)
    const [quantity, setQuantity] = useState<number>(cart.quantity)
    const [oldQuantity, setOldQuantity] = useState<number>(cart.quantity)

    
    useEffect(() => {
        if(quantity !== oldQuantity){
            updateCart({cartId: cart.id, 
                quantity: quantity,
                callback: (data) => {
                    setProduct(data.product_father)
                    setChild(data.product_child)
                    setOldQuantity(quantity)
                    setUpdated && setUpdated(true)
                },
                errorCallback: () => setQuantity(oldQuantity)
            })
        }
    }, [cart, quantity, oldQuantity, updateCart, setUpdated])

    const URL = `/${createSlug(product.name)}/p/${product.id}${product.has_variations ? `?child=${child?.id}` : ''}`
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.primaryTitle}>{product.store.name}</h2>
                </div>
                <div className={styles.body}>
                    <div className={styles.containerMain}>
                        <a className={styles.containerImage} href={URL}>
                            <div className={styles.flexImage}>
                                <img 
                                    className={styles.image}
                                    src={product.has_variations ? child?.images.principal_image : product.images.principal_image}
                                    alt=""
                                />
                            </div>
                        </a>
                        <div className={styles.containerInfo}>
                            <div className={styles.containerTitle}>
                                <a className={styles.secondTitle} href={URL}>
                                    {titleHandler({productName: product.name, child: child ?? null, length: 50})}
                                </a>
                            </div>
                            <div className={styles.containercontrollers}>
                                <span className={styles.flexController} onClick={() => onDeleteCallback()}>Excluir</span>
                                <span className={styles.flexController}>Salvar</span>
                                <span className={styles.flexController}>Comprar</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.containerQuantity}>
                        <QuantitySelect
                            value={quantity}
                            min={(product.has_variations && child?.quantity) || product.quantity ? 1 : 0} 
                            max={child?.quantity || product.quantity || 0} 
                            setValue={setQuantity}
                        />
                        <span className={styles.quantityText}>
                            {product.has_variations ? child?.quantity : product.quantity} Disponíveis 
                        </span>
                    </div>
                    <div className={styles.containerPrices}>
                        {(product.has_variations && child?.discount_percentage) || product.discount_percentage ? (
                            <span className={styles.discountPercentage}>
                                {Math.floor((product.has_variations && child?.discount_percentage) ? child.discount_percentage : (product.discount_percentage ?? 0))}% OFF
                            </span>
                        ): null}
                        {(product.has_variations && child?.discount_price) || (!product.has_variations && product.discount_price) ? (
                            <>
                                <span className={styles.defaultPrice}>
                                    {CurrencyFormatter(product.has_variations ? (child?.default_price ?? 0) : (product.default_price ?? 0))}
                                </span>
                                <span className={styles.discountPrice}>
                                    {CurrencyFormatter(product.has_variations ? (child?.discount_price ?? 0) : (product.discount_price ?? 0))}
                                </span>
                            </>
                        ):(
                            <span className={styles.discountPrice}>
                                {CurrencyFormatter(product.has_variations ? (child?.default_price ?? 0) : product.default_price)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.footer}>
                    <span className={styles.footerPrimaryText}>
                        Compre mais e ganhe vantagens exclusivas. <a href="/" className={styles.footerSecondText}>Ver mais produtos do vendedor <PiArrowRightLight className={styles.footerIcon} /></a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CartProductCard