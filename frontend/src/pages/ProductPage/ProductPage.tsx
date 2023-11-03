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
import { FaShippingFast } from 'react-icons/fa';
import { PiHeartLight } from 'react-icons/pi';
import { Presentation, TechnicalInformation } from '../../types/ProductType'


type Props = {}

const ProductPage = (props: Props) => {
    const { productId } = useParams()
    const { setIsLoading } = useContext(LoadingContext)
    const { updateTitle } = usePageTitleChanger()
    const { CurrencyFormatter } = useCurrencyFormatter()

    const [product, setProduct] = useState<Product | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')

    type ProductDetailsType = {
        id: number
        name: string
        body: Presentation | TechnicalInformation[] | string | null
        fixed: boolean
    }

    const [productDetails, setProductDetails] = useState<ProductDetailsType[]>()
    const [productCurrentDetail, setProductCurrentDetail] = useState<number>()

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
    }, [productId, setIsLoading, updateTitle])

    useEffect(() => {
        if(product){
            setProductDetails([
                {
                    id: 0,
                    name: 'Apresentação',
                    body: product?.presentation,
                    fixed: false
                },
                {
                    id: 1,
                    name: 'Descrição',
                    body: product?.description,
                    fixed: false
                },
                {
                    id: 2,
                    name: 'Ficha Técnica',
                    body: product?.technical_informations,
                    fixed: false
                },
                {
                    id: 3,
                    name: 'Avaliações',
                    body: product?.presentation,
                    fixed: true
                },
            ])
        }
    }, [product])

    useEffect(() => {
        if(productDetails){
            const firstItemId = productDetails.find(item => item.body)?.id
            setProductCurrentDetail(firstItemId)
        }
    }, [productDetails])
 
    return (
        product && (
            <div className={styles.wrapper}>
                <WidthLayout>
                    <div className={styles.header}>
                        <a className={styles.headerTitle} href='/'>{product?.store.name}</a>
                    </div>
                    <div className={styles.body}>
                        <div className={`${styles.containerMain} ${styles.default}`}>
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
                                        <div className={styles.containerMainInfoHeaderTitleSubOne}>
                                            <span className={styles.containerMainInfoHeaderDescriptionText}>SKU: {product.children[0].sku || `00000`}</span>
                                            <div className={styles.favoriteButton}>
                                                <PiHeartLight className={styles.favoriteIcon} />
                                            </div>
                                        </div>
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
                                                    <span className={styles.containerMainInfoBodyPriceDiscountFlag}>{Math.floor(product.children[0].discount_percentage)}%</span>
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
                                    <div className={styles.containerMainInfoBodyShipping}>
                                        <div className={styles.containerMainInfoBodyShippingHeader}>
                                            <FaShippingFast className={styles.containerMainInfoBodyShippingIcon} />
                                            <span>Chegará grátis</span>
                                        </div>
                                        <div className={styles.containerMainInfoBodyShippingBody}>
                                            <span>segunda feira</span>
                                        </div>

                                    </div>
                                    <div className={styles.containerMainInfoBodyStock}>
                                        <span className={styles.containerMainInfoBodyStockTextFocus}>Quantidade:</span>
                                        <QuantitySelect min={1} max={product.children[0].quantity || 1} />
                                        <span className={styles.containerMainInfoBodyStockText}>restam {product?.children[0].quantity} disponíveis</span>
                                    </div>
                                    <div className={styles.containerMainInfoBodyActions}>
                                        <div className={styles.containerMainInfoBodyActionsSubOne}>
                                            <BtnB02 autoWidth>Adicionar aos favoritos</BtnB02>
                                            <BtnB02 autoWidth>Adicionar ao carrinho</BtnB02>
                                        </div>
                                        <div className={styles.containerMainInfoBodyActionsSubTwo}>
                                            <BtnA01 href='' autoWidth>Comprar</BtnA01>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {productDetails &&
                            <div className={styles.containerSecondary}>
                                <div className={styles.containerSecondaryHeader}>
                                    <ul className={styles.containerSecondaryHeaderUl}>
                                        {productDetails.map(productDetail => {
                                            if(productDetail.body || productDetail.fixed){
                                                return (
                                                    <li className={`${styles.containerSecondaryHeaderUlLi} ${productDetail.id === productCurrentDetail ? styles.containerSecondaryHeaderUlLiFocus : null}`} key={productDetail.id} onClick={() => setProductCurrentDetail(productDetail.id)}>
                                                        <span className={styles.containerSecondaryHeaderUlLiText}>{productDetail.id === 3 ? productDetail.name + ` (${product.rating.count})` : productDetail.name}</span>
                                                    </li>
                                                )
                                            } 
                                        })}
                                    </ul>
                                </div>
                                <div className={`${styles.containerSecondaryBody} ${styles.default}`}>
                                    {productDetails.map(productDetail => {
                                        if (productCurrentDetail === productDetail.id && productDetail.body && productDetail.id === 0){
                                            return (
                                                <div className={styles.containerSecondaryWindow}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <ul className={styles.containerSecondaryWindowUl}>
                                                            {Object.entries(productDetail.body).map(([key, value], index) => (
                                                                <li key={index} className={styles.containerSecondaryWindowUlLi}><img className={styles.containerSecondaryWindowImg} src={value} alt="" /></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        }else if(productCurrentDetail === productDetail.id && productDetail.body && productDetail.id === 1){
                                            return (
                                                <div className={styles.containerSecondaryWindow}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <p className={styles.containerSecondaryWindowBodyText}>{String(productDetail.body)}</p>
                                                    </div>
                                                </div>
                                            )
                                        }else if(productCurrentDetail === productDetail.id && productDetail.body && productDetail.id === 2){
                                            return (
                                                <div className={styles.containerSecondaryWindow}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <p className={styles.containerSecondaryWindowBodyText}>{String(productDetail.body)}</p>
                                                    </div>
                                                </div>
                                            )
                                        }else if(productCurrentDetail === productDetail.id && productDetail.id === 3){
                                            return (
                                                <div className={styles.containerSecondaryWindow}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name + ` (${product.rating.count})`}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        {productDetail.body ? (
                                                            <p className={styles.containerSecondaryWindowBodyText}>{String(productDetail.body)}</p>
                                                        ):(
                                                            <span>Nenhuma avaliação</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                </WidthLayout>
            </div>
        )
    )
}

export default ProductPage