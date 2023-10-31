import React, { useEffect, useState, useContext } from 'react'
import styles from "./ProductPage.module.css"
import { axios } from '../../services/api'
import { useParams } from 'react-router-dom'
import { Product } from '../../types/ProductType'
import { LoadingContext } from '../../contexts/LoadingContext'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import StarRating from '../../components/Ratings/StarRating/StarRating'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import BtnA01 from '../../components/Buttons/BtnA01/BtnA01'
import BtnB02 from '../../components/Buttons/BtnB02/BtnB02'
import QuantitySelect from '../../components/Selects/QuantitySelect/QuantitySelect'

type Props = {}

const ProductPage = (props: Props) => {
    const { productName, productId } = useParams()
    const { setIsLoading } = useContext(LoadingContext)
    const { updateTitle } = usePageTitleChanger()
    const { CurrencyFormatter } = useCurrencyFormatter()

    const [product, setProduct] = useState<Product | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')

    useEffect(() => {
        const get_product = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`/products/${productId}`)
                const data: Product = await response.data
                if(response.status === 200){
                    setProduct(data)
                    setCurrentImage(data.children[0].images.principal_image)
                    updateTitle(`${data.name} | ${process.env.REACT_APP_PROJECT_NAME}`)
                }
            } catch (error) {
                setProduct(null)
            }
            setIsLoading(false)
        }
        get_product()
    }, [productId, setIsLoading])

    return (
        product && (
            <div className={styles.wrapper}>
                <WidthLayout>
                    <div className={styles.header}>
                        <a className={styles.headerTitle} href='/'>{product?.store.name}</a>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.containerMain}>
                            <div className={styles.containerMainImages}>
                                <div className={styles.flexMainImagesThumbs}>
                                    {Object.values(product.children[0].images).filter(value => value !== null).map((img, index) => (
                                        <div className={`${styles.flexMainImagesThumb} ${currentImage === img ? styles.flexMainImagesThumbActive : null}`} key={index} onClick={() => setCurrentImage(img || '')}>
                                            <img className={styles.flexMainImagesThumbImg} src={img || ''} alt="" />
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.flexMainImagesThumbnail}>
                                    <img 
                                        className={styles.flexMainImagesThumbnailImg} 
                                        src={currentImage} 
                                        alt="" />
                                </div>
                            </div>
                            <div className={styles.containerMainInfo}>
                                <div className={styles.containerMainInfoHeader}>
                                    <div className={styles.containerMainInfoHeaderTitle}>
                                        <span className={styles.containerMainInfoHeaderTitleText}>{product?.name}</span>
                                    </div>
                                    <div className={styles.containerMainInfoHeaderRating}>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne}>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText}>{product?.rating.average}</span>
                                            <StarRating rate={product?.rating.average} />
                                        </div>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne}>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText}>{product?.rating.count}</span>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneText}>Avaliações</span>
                                        </div>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne}>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText}>{product?.rating.count}</span>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneText}>Avaliações</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.containerMainInfoBody}>
                                    <div className={styles.containerMainInfoBodyPrice}>
                                        <div className={styles.containerMainInfoBodyPricePrice}>
                                            {product?.children[0].discount_price &&
                                                <span className={styles.containerMainInfoBodyPriceDefaultText}>{CurrencyFormatter(product.children[0].default_price)}</span>
                                            }
                                            <div className={styles.containerMainInfoBodyPriceDiscountFlex}>
                                                <span className={styles.containerMainInfoBodyPriceDiscountFlexText}>{CurrencyFormatter(product.children[0].discount_price || product.children[0].default_price)}</span>
                                                {product?.children[0].discount_percentage && 
                                                    <span className={styles.containerMainInfoBodyPriceDiscountFlag}>{product.children[0].discount_percentage}%</span>
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.containerMainInfoBodyPriceInstallments}>
                                            <span className={styles.containerMainInfoBodyPriceInstallmentsText}>ou {product?.children[0].installment_details.installments}x de {CurrencyFormatter(product?.children[0].installment_details.installment_price)} sem juros</span>
                                        </div>
                                    </div>
                                    <div className={styles.containerMainInfoBodyChildren}>
                                        {product?.children.map((child) => (
                                            <div className={styles.containerMainInfoBodyChildrenChild} key={child.id}>
                                                <div className={styles.containerMainInfoBodyChildrenChildHeader}>
                                                    <span className={styles.containerMainInfoBodyChildrenChildHeaderS}>Opção:</span>
                                                    <span className={styles.containerMainInfoBodyChildrenChildHeaderText}>{product?.children[0].id}</span>
                                                </div>
                                                <div className={styles.containerMainInfoBodyChildrenChildBody}>
                                                    <img className={styles.containerMainInfoBodyChildrenChildBodyImage} src={child.images.principal_image} alt="" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.containerMainInfoBodyActions}>
                                        <div className={styles.containerMainInfoBodyActionsSubTwo}>
                                            <QuantitySelect min={1} max={1000} />
                                        </div>
                                        <div className={styles.containerMainInfoBodyActionsSubOne}>
                                            <BtnB02 autoWidth>Adicionar aos favoritos</BtnB02>
                                            <BtnA01 href='' autoWidth>Comprar</BtnA01>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.containerSecondary}>

                        </div>
                    </div>
                </WidthLayout>
            </div>
        )
    )
}

export default ProductPage