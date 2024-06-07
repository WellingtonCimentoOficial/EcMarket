import React, { useContext, useEffect, useState } from 'react'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { useCartRequests, useCategoriesRequests } from '../../hooks/useBackendRequests'
import { CartDetailsType, CartType } from '../../types/CartType'
import { AuthContext } from '../../contexts/AuthContext'
import styles from "./CartPage.module.css"
import CartProductCard from '../../components/UI/ProductCards/CartProductCard/CartProductCard'
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import StyledSectionA from '../../styles/StyledSectionA'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/UI/ProductCards/SimpleProductCard/SimpleProductCard'
import { Category } from '../../types/CategoryType'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import { UserContext } from '../../contexts/UserContext'

type Props = {}

const CartPage = (props: Props) => {
    const [carts, setCarts] = useState<CartType[]>([])
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const [cartDetails, setCartDetails] = useState<CartDetailsType | null>(null)
    const { areTokensUpdated, isAuthenticated } = useContext(AuthContext)
    const [updateCartDetails, setUpdateCartDetails] = useState<boolean>(true)

    const { getCart, getCartDetails, deleteCart } = useCartRequests()

    const { getCategories } = useCategoriesRequests()
    const { CurrencyFormatter } = useCurrencyFormatter()

    const { setUser } = useContext(UserContext)

    const handleDelete = (cartId: number, quantity: number) => {
        deleteCart({
            cartId,
            callback: () => {
                setCarts(oldValue => oldValue.filter(cart => cart.id !== cartId))
                setUpdateCartDetails(true)
                setUser(oldValue => {
                    return {...oldValue, cart_quantity: oldValue.cart_quantity - quantity}
                })
            }
        })
    }

    useEffect(() => {
        getCategories({
            callback: (data: Category[]) => setCategoriesData(data)
        })
    }, [getCategories])

    useEffect(() => {
        if(areTokensUpdated && isAuthenticated && updateCartDetails){
            getCartDetails({
                callback: (data) => {
                    setCartDetails(data)
                    setUpdateCartDetails(false)
                }
            })
        }
    }, [areTokensUpdated, isAuthenticated, updateCartDetails, getCartDetails])

    useEffect(() => {
        if(areTokensUpdated && isAuthenticated){
            getCart({callback: (data) => setCarts(data)}) 
        }
    }, [areTokensUpdated, isAuthenticated, getCart])

    return (
        <WidthLayout width={80}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    
                </div>
                <div className={styles.body}>
                    {carts.length > 0 && cartDetails ? (
                        <>
                            <div className={styles.containerMain}>
                                {carts.map(cart => (
                                    <div className={styles.flexCard} key={cart.id}>
                                        <CartProductCard cart={cart} setUpdated={setUpdateCartDetails} onDeleteCallback={() => handleDelete(cart.id, cart.quantity)} />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.containerSummary}>
                                <div className={styles.flexSummary}>
                                    <div className={styles.flexSummaryHeader}>
                                        <span className={styles.flexSummaryHeaderTitle}>Resumo da compra</span>
                                    </div>
                                    <div className={styles.flexSummaryBody}>
                                        <div className={styles.flexSummaryItem}>
                                            <span>Produtos{`(${cartDetails.products_quantity})`}</span>
                                            <span>{CurrencyFormatter(cartDetails.total_price)}</span>
                                        </div>
                                        <div className={styles.flexSummaryItem}>
                                            <span>Frete</span>
                                            <span className={!cartDetails.shipping_price ? styles.customText : undefined}>
                                                {cartDetails.shipping_price ? CurrencyFormatter(cartDetails.shipping_price) : "Grátis"}
                                            </span>
                                        </div>
                                        <div className={styles.flexSummaryItem}>
                                            <span>Impostos</span>
                                            <span className={!cartDetails.tax_price ? styles.customText : undefined}>
                                                {cartDetails.tax_price ? CurrencyFormatter(cartDetails.tax_price) : "Isento"}
                                            </span>
                                        </div>
                                        <div className={styles.flexSummaryItem}>
                                            <span>Cupons</span>
                                            <span>{CurrencyFormatter(cartDetails.coupon_discount_price)}</span>
                                        </div>
                                        <div className={styles.flexSummaryItem}>
                                            <span>Total descontos</span>
                                            <span>-{CurrencyFormatter(cartDetails.total_discount_price)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.flexSummaryFooter}>
                                        <div className={styles.flexSummaryItem}>
                                            <span className={styles.flexSummaryFooterTitle}>Total</span>
                                            <span className={styles.flexSummaryFooterDescription}>{CurrencyFormatter(cartDetails.final_price)}</span>
                                        </div>
                                        <div className={styles.flexSummaryItem}>
                                            <BtnB01 autoWidth>Continuar compra</BtnB01>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ):(
                        <div className={styles.containerMessage}>
                            <span>Você ainda não tem nenhum produto adicionado no carrinho. &#128530;</span>
                        </div>
                    )}
                </div>
                <div className={styles.footer}>
                    <StyledSectionA>
                        {categoriesData[0] && categoriesData[0].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[0].name} href={`/search?q=&categories=${categoriesData[0].id}`} enableScroll={true} autoScroll={true}>
                                {categoriesData[0].products.map((product) => (
                                    <SimpleProductCard key={product.id} product={product} showDiscountPercentage={true} />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </StyledSectionA>
                </div>
            </div>
        </WidthLayout>
    )
}

export default CartPage