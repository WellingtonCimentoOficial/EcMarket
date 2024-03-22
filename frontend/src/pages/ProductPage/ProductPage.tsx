// HOOKS
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation, useParams } from 'react-router-dom'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import { useDateTimeFormatter } from '../../hooks/useDateTimeFormatter'
import { useSlug } from '../../hooks/useSlug'

// STYLES
import styles from "./ProductPage.module.css"

// UTILS
import { axios } from '../../services/api'

// CONTEXTS
import { LoadingContext } from '../../contexts/LoadingContext'
import { ZipCodeContext } from '../../contexts/ZipCodeContext'

// COMPONENTS
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import StarRating from '../../components/UI/Ratings/StarRating/StarRating'
import BarPagination from '../../components/UI/Paginations/BarPagination/BarPagination'
import SimpleProgressBar from '../../components/UI/ProgressBars/SimpleProgressBar/SimpleProgressBar'
import BtnA01 from '../../components/UI/Buttons/BtnA01/BtnA01'
import BtnB02 from '../../components/UI/Buttons/BtnB02/BtnB02'
import QuantitySelect from '../../components/UI/Selects/QuantitySelect/QuantitySelect'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/UI/ProductCards/SimpleProductCard/SimpleProductCard'

// ICONS
import { PiHeartLight, PiHeartFill, PiArrowBendDownLeft, PiShieldCheck } from 'react-icons/pi';
import { FaShippingFast } from 'react-icons/fa';

// TYPES
import { Delivery } from '../../types/DeliveryType'
import { Category } from '../../types/CategoryType'
import { Attribute, Children, Product, Variant } from '../../types/ProductType'
import { Comment } from '../../types/CommentType'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { AuthContext } from '../../contexts/AuthContext'
import { useFavoritesRequests, useProductRequests } from '../../hooks/useBackendRequests'
import StyledSectionA from '../../styles/StyledSectionA'

type Props = {}

type ProductDetailsType = {
    id: number
    name: string
    show: boolean
    fixed: boolean
}

type StarsRatingType = {
    count: number,
    average: number,
    detail: [
        {
            id: number,
            name: string,
            quantity: number
            percentage: number
        }
    ]
}

type SectionNameType = "rating" | "description"

const ProductPage = (props: Props) => {
    const { productId, productName } = useParams()
    const { setIsLoading } = useContext(LoadingContext)
    const { updateTitle } = usePageTitleChanger()
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { dateDifferenceFormat, getNameDay, getNameMonth } = useDateTimeFormatter()
    const { setShow, zipCodeContextData } = useContext(ZipCodeContext)
    const { createSlug } = useSlug()

    const [product, setProduct] = useState<Product | null>(null)
    const [children, setChildren] = useState<Children[] | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')
    const [deliveryInfo, setDeliveryInfo] = useState<Delivery | null>(null)
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const [productDetails, setProductDetails] = useState<ProductDetailsType[]>([])
    const [currentProductDetailId, setCurrentProductDetailId] = useState<number>()
    const [comments, setComments] = useState<Comment[]>([])
    const [starsRating, setStarsRating] = useState<StarsRatingType | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [totalPageCount, setTotalPageCount] = useState<number>(0)
    const [shouldScroll, setShouldScroll] = useState<boolean>(false)
    const [starRatingFilter, setStarRatingFilter] = useState<number | null>(null)
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [currentChild, setCurrentChild] = useState<Children | null>(null)
    const [variantDescriptions, setVariantDescriptions] = useState<{id: number, description: string} | null>(null)
    const itemsPerPage = 10

    const sectionToScrollRef = useRef<HTMLDivElement>(null)

    const location = useLocation()

    const navigate = useNavigate()

    const axiosPrivate = useAxiosPrivate()

    const { tokens } = useContext(AuthContext)

    const { addToFavorites, removeFromFavorites } = useFavoritesRequests()
    const { getProductChildren } = useProductRequests()

    const handleAddToFavorites = () => {
        setIsFavorite(true)
    }

    const handleRemoveFromFavorites = () => {
        setIsFavorite(false)
    }

    const get_product = useCallback(async ({ isAuthenticated }:{ isAuthenticated?: boolean }={}) => {
        setIsLoading(true)
        try {
            const path = `/products/${productId}`
            const response = isAuthenticated ? await axiosPrivate.get(path) : await axios.get(path)
            if(response.status === 200){
                const data: Product = await response.data
                setProduct(data)
                setIsFavorite(data.is_favorite)
                updateTitle(`${data.name} | ${process.env.REACT_APP_PROJECT_NAME}`)
                navigate(location.pathname.replace(String(productName), createSlug(data.name)), { replace: true })
                !data.has_variations && setCurrentImage(data.images.principal_image)
            }
        } catch (error) {
            setProduct(null)
        }
        setIsLoading(false)
    }, [productId, location.pathname, productName, axiosPrivate, createSlug, navigate, setIsLoading, updateTitle])
    
    const get_rating_statistics = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/comments/product/statistics/${productId}`)
            if(response.status === 200){
                setStarsRating(response.data)
            }
        } catch (error) {
            setStarsRating(null)
        }
        setIsLoading(false)
    }, [productId, setStarsRating ,setIsLoading])

    const get_comments = useCallback(async () => {
        setIsLoading(true)
        try {
            const offset = currentPage * itemsPerPage
            const response = await axios.get(`/comments/product/${productId}?rating=${starRatingFilter}&limit=${itemsPerPage}&offset=${offset}`)
            if(response.status === 200){
                setComments(response.data.results)
                setTotalPageCount(response.data.total_page_count)
            }
        } catch (error) {
            setComments([])
        }
        setIsLoading(false)
    },[productId, currentPage, itemsPerPage, starRatingFilter, setComments, setIsLoading])

    const get_categories = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/categories/?limit=6&min_product_count=10&max_product_count=20&random=true')
            if(response.status === 200){
                setCategoriesData(response.data.results)
            }
            
        } catch (error) {
            setCategoriesData([])
        }
        setIsLoading(false)
    }, [setIsLoading])

    const get_delivery_info = useCallback(async () => {
        try {
            const response = await axios.get(`/products/${productId}/delivery/${zipCodeContextData?.zip_code}`)
            if(response.status === 200){
                setDeliveryInfo(response.data)
            }
        } catch (error) {
            setDeliveryInfo(null)
        }
    }, [productId, zipCodeContextData, setDeliveryInfo])

    const scrollToSection = (sectionName: SectionNameType) => {
        if(sectionName === 'rating'){
            setCurrentProductDetailId(productDetails.find(detail => detail.id === 3)?.id)
            setShouldScroll(true)
        }
    }

    const handleChildren = (data: Children[] | null, childId?: number) => {
        if(data){
            const primaryChild = data.find(child => child.product_variant.find(variant => variant.is_primary))
            const firstChildWithImage = data.find(child => child.product_variant.find(variant => variant.attribute.is_image_field))
            const startChild = childId ? data.find(child => child.id === childId) : (primaryChild || firstChildWithImage || data[0])
            setChildren(data)
            setCurrentChild(startChild || data[0])
            setCurrentImage(startChild?.images.principal_image || '')
        }
    }

    const handleVariant = (variantId: number, attributeId: number) => {
        const anotherVariantIds = currentChild?.product_variant.filter(
            currVar => currVar.attribute.id !== attributeId
        ).map(varr => varr.id) || []

        anotherVariantIds.push(variantId)
        
        const newCurrentChild = children?.find(child => 
            child.product_variant.every(variant => anotherVariantIds?.includes(variant.id))
        )

        const firstChildWithThisVariant = children?.find(child => child.product_variant.some(variant => variant.id === variantId))

        getProductChildren({
            productId: Number(productId), 
            callback: (data: Children[] | null) => handleChildren(data, (newCurrentChild?.id || firstChildWithThisVariant?.id)), 
            setIsLoading: setIsLoading
        })
    }
    
    useEffect(() => {get_product({ isAuthenticated: !!tokens.refresh })}, [tokens.refresh, get_product])
    useEffect(() => {get_rating_statistics()}, [get_rating_statistics])
    useEffect(() => {get_comments()}, [get_comments])
    useEffect(() => {get_categories()}, [get_categories])
    useEffect(() => {zipCodeContextData ? get_delivery_info() : setDeliveryInfo(null)}, [zipCodeContextData, get_delivery_info, setDeliveryInfo])

    useEffect(() => {
        if(productId && product?.has_variations){
            getProductChildren({productId: Number(productId), callback: handleChildren, setIsLoading: setIsLoading})
        } 
    }, [productId, product?.has_variations, getProductChildren, setIsLoading])
    
    useEffect(() => {
        if(product && comments){
            setProductDetails([
                {
                    id: 0,
                    name: 'Apresentação',
                    show: product.presentation ? true : false,
                    fixed: false
                },
                {
                    id: 1,
                    name: 'Descrição',
                    show: product.description ? true : false,
                    fixed: false
                },
                {
                    id: 2,
                    name: 'Ficha Técnica',
                    show: product.technical_informations ? true : false,
                    fixed: false
                },
                {
                    id: 3,
                    name: 'Avaliações',
                    show: comments.length > 0 ? true : false,
                    fixed: true
                },
            ])
        }
    }, [product, comments, setProductDetails])
    
    useEffect(() => {
        if(productDetails && !currentProductDetailId){
            const firstItemId = productDetails.find(item => item.show)?.id
            setCurrentProductDetailId(firstItemId)
        }
    }, [productDetails, currentProductDetailId])
    
    useEffect(() => {
        if(sectionToScrollRef.current && shouldScroll){
            sectionToScrollRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
            setShouldScroll(false)
        }
    }, [sectionToScrollRef, shouldScroll])
 
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
                                    {Object.values((product.has_variations && currentChild) ? currentChild.images : (product.images || [])).filter(value => typeof value === 'string').map((img, index) => (
                                        <div className={`${styles.flexMainImagesThumb} ${currentImage === img ? styles.flexMainImagesThumbActive : null}`} key={index} onMouseOver={() => setCurrentImage(img || '')}>
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
                                            <span className={styles.containerMainInfoHeaderDescriptionText}>SKU: {product.has_variations ? currentChild?.sku : product.sku}</span>
                                            <div 
                                                className={styles.favoriteButton} 
                                                onClick={() => isFavorite ? 
                                                removeFromFavorites({ productId: product.id, callback: handleRemoveFromFavorites }) : 
                                                addToFavorites({ productId: product.id, callback: handleAddToFavorites })}
                                            >
                                                {isFavorite ? (
                                                    <PiHeartFill className={styles.favoriteIcon} />
                                                ):(
                                                    <PiHeartLight className={styles.favoriteIcon} />
                                                )}
                                            </div>
                                        </div>
                                        <span className={styles.containerMainInfoHeaderTitleText}>
                                            {product?.name} - {currentChild?.product_variant.map((variant, index) => index + 1 !== currentChild?.product_variant.length ? `${variant.description} ` : `(${variant.description})`)}
                                        </span>
                                    </div>
                                    <div className={styles.containerMainInfoHeaderRating}>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne} >
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText} onClick={() => scrollToSection('rating')}>
                                                {product?.rating.average.toFixed(1)}
                                            </span>
                                            <StarRating rate={product?.rating.average} />
                                        </div>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne}>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText} onClick={() => scrollToSection('rating')}>
                                                {
                                                    // simplifying an example number 5300 into 5.3
                                                    product?.rating.count >= 1000 ? `${(product.rating.count / 1000).toFixed(1).replace('.', ',')} mil` : 
                                                    product?.rating.count >= 1000000 ? `${(product.rating.count / 1000000).toFixed(1).replace('.', ',')} milhões` :
                                                    product?.rating.count
                                                }
                                            </span>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneText}>Avaliações</span>
                                        </div>
                                        <div className={styles.containerMainInfoHeaderRatingSubOne}>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneSText} onClick={() => scrollToSection('rating')}>
                                                {
                                                    // simplifying an example number 5300 into 5.3
                                                    product?.sales.count >= 1000 ? `${(product.sales.count / 1000).toFixed(1).replace('.', ',')} mil` : 
                                                    product?.sales.count >= 1000000 ? `${(product.sales.count / 1000000).toFixed(1).replace('.', ',')} milhões` :
                                                    product?.sales.count
                                                }
                                            </span>
                                            <span className={styles.containerMainInfoHeaderRatingSubOneText}>Vendidos</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.containerMainInfoBody}>
                                    <div className={styles.containerMainInfoBodyPrice}>
                                        <div className={styles.containerMainInfoBodyPricePrice}>
                                            {(product.has_variations && currentChild?.discount_price) || product.discount_price ? (
                                                <span className={styles.containerMainInfoBodyPriceDefaultText}>
                                                    {CurrencyFormatter((product.has_variations && currentChild?.discount_price) ? currentChild.default_price : product.default_price)}
                                                </span>
                                            ) : null}
                                            <div className={styles.containerMainInfoBodyPriceDiscountFlex}>
                                                <span className={styles.containerMainInfoBodyPriceDiscountFlexText}>
                                                    {
                                                        CurrencyFormatter((product.has_variations && currentChild) ? 
                                                        (currentChild.discount_price || currentChild.default_price) : 
                                                        (product.discount_price || product.default_price || 0))
                                                    }
                                                </span>
                                                {(product.has_variations && currentChild?.discount_percentage) || product.discount_percentage ? (
                                                    <span className={styles.containerMainInfoBodyPriceDiscountFlag}>
                                                        {
                                                            Math.floor((product.has_variations && currentChild?.discount_percentage) ? 
                                                            currentChild.discount_percentage : 
                                                            (product.discount_percentage || 0))
                                                        }%
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className={styles.containerMainInfoBodyPriceInstallments}>
                                            <span className={styles.containerMainInfoBodyPriceInstallmentsText}>
                                                ou {
                                                    product.has_variations ? 
                                                    currentChild?.installment_details?.installments : 
                                                    product.installment_details?.installments}x de {
                                                        CurrencyFormatter((product.has_variations && currentChild?.installment_details?.installment_price) ? 
                                                        currentChild.installment_details.installment_price : 
                                                        (product.installment_details?.installment_price || 0))
                                                } sem juros
                                            </span>
                                        </div>
                                    </div>
                                    {currentChild &&
                                        <div className={styles.containerMainInfoBodyChildren}>
                                            {(() => {
                                                if(children){
                                                    const attributeFormatted: Attribute[] = []
                                                    const variantsFormatted: Variant[] = [] 
                                                    const variantsImgFormatted: string[] = [] 
                                                    return children.map(child => child.product_variant.map(variant => {
                                                        if(!attributeFormatted.some(item => item.id === variant.attribute.id)){
                                                            attributeFormatted.push(variant.attribute)
                                                            return (
                                                                <div className={styles.containerMainInfoBodyChildrenChild} key={variant.id}>
                                                                    <div className={styles.containerMainInfoBodyChildrenChildHeader}>
                                                                        <span className={styles.containerMainInfoBodyChildrenChildHeaderS}>{variant.attribute.name}:</span>
                                                                        <span className={styles.containerMainInfoBodyChildrenChildHeaderText}>
                                                                            {variantDescriptions?.id === variant.id ? 
                                                                                variantDescriptions.description :
                                                                                currentChild.product_variant.find(currVariant => currVariant.attribute.id === variant.attribute.id)?.description 
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles.containerMainInfoBodyChildrenChildBodyContainer}>
                                                                        {variant.attribute.is_image_field ? (() => {
                                                                            return children.map(childImg => {
                                                                                if(!variantsImgFormatted.some(item => item === childImg.images.principal_image)){
                                                                                    variantsImgFormatted.push(childImg.images.principal_image)
                                                                                    return childImg.product_variant.filter(variantImg => variantImg.attribute.is_image_field).map(variantImg => {
                                                                                        return (
                                                                                            <div className={
                                                                                                `${styles.containerMainInfoBodyChildrenChildBody} ${
                                                                                                    currentChild.product_variant.some(varrItem => varrItem.id === variantImg.id) ? 
                                                                                                    styles.containerMainInfoBodyChildrenChildBodyFocus : 
                                                                                                    null
                                                                                                } ${(() => {
                                                                                                    if(currentChild.product_variant.length > 1){
                                                                                                        const anotherVariantIds = currentChild.product_variant.filter(
                                                                                                            currentChildStyle => currentChildStyle.attribute.id !== variantImg.attribute.id
                                                                                                        ).map(varr => varr.id)
                                                                                                        
                                                                                                        anotherVariantIds.push(variantImg.id)
    
                                                                                                        const has_variant = children.some(
                                                                                                            childStyle => childStyle.product_variant.every(variantStyle => anotherVariantIds.includes(variantStyle.id))
                                                                                                        )
    
                                                                                                        if(!has_variant){
                                                                                                            return styles.containerMainInfoBodyChildrenChildBodyBlur
                                                                                                        }
                                                                                                        return null
                                                                                                    }
                                                                                                    return null
                                                                                                })()}`
                                                                                            } key={childImg.id}
                                                                                            onClick={() => handleVariant(variantImg.id, variantImg.attribute.id)}
                                                                                            onMouseEnter={() => setVariantDescriptions({id: variant.id, description: variantImg.description})}
                                                                                            onMouseLeave={() => setVariantDescriptions(null)}>
                                                                                                <img className={styles.containerMainInfoBodyChildrenChildBodyImage} src={childImg.images.principal_image} alt="" />
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                                return null
                                                                            })
                                                                        })():(() => {
                                                                            return children.map(childText => childText.product_variant.map(variantText => {
                                                                                if(!variantsFormatted.some(itemText => itemText.id === variantText.id) && variant.attribute.id === variantText.attribute.id){
                                                                                    variantsFormatted.push(variantText)
                                                                                    return (
                                                                                        <div className={
                                                                                            `${styles.containerMainInfoBodyChildrenChildBodyText} ${
                                                                                                currentChild.product_variant.some(currVariant => currVariant.id === variantText.id) ? 
                                                                                                styles.containerMainInfoBodyChildrenChildBodyTextFocus : 
                                                                                                null
                                                                                            } ${(() => {
                                                                                                if(currentChild.product_variant.length > 1){
                                                                                                    const anotherVariantIds = currentChild.product_variant.filter(
                                                                                                        currentChildStyle => currentChildStyle.attribute.id !== variantText.attribute.id
                                                                                                    ).map(varr => varr.id)
                                                                                                    
                                                                                                    anotherVariantIds.push(variantText.id)

                                                                                                    const has_variant = children.some(
                                                                                                        childStyle => childStyle.product_variant.every(variantStyle => anotherVariantIds.includes(variantStyle.id))
                                                                                                    )

                                                                                                    if(!has_variant){
                                                                                                        return styles.containerMainInfoBodyChildrenChildBodyTextBlur
                                                                                                    }
                                                                                                    return null
                                                                                                }
                                                                                                return null
                                                                                            })()}`
                                                                                        } key={variantText.id}
                                                                                        onClick={() => handleVariant(variantText.id, variantText.attribute.id)}
                                                                                        onMouseEnter={() => setVariantDescriptions({id: variant.id, description: variantText.description})}
                                                                                        onMouseLeave={() => setVariantDescriptions(null)}>
                                                                                            <span>{variantText.description}</span>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                return null
                                                                            }))
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        return null
                                                    }))
                                                }
                                                return null
                                            })()}
                                        </div>
                                    }
                                    <div className={styles.containerMainInfoBodyShipping}>
                                        <div className={styles.containerMainInfoBodyShippingHeader}>
                                            <FaShippingFast className={styles.containerMainInfoBodyShippingIcon} />
                                        </div>
                                        <div className={styles.containerMainInfoBodyShippingBody}>
                                            {(() => {
                                                if(deliveryInfo){
                                                    const date = new Date(deliveryInfo.max_date)
                                                    return (
                                                        <>
                                                            <span className={styles.containerMainInfoBodyShippingBodyTitle}>Prazo de entrega</span>
                                                            <div>
                                                                <span className={styles.containerMainInfoBodyShippingBodyText}>Receba até {getNameDay(date.getDay())}, {date.getDate()} de {getNameMonth(date)} por </span>
                                                                <span className={styles.containerMainInfoBodyShippingBodyPrice}>{CurrencyFormatter(deliveryInfo.price)}</span>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                return (
                                                    <span>
                                                        Para obter o calculo do frete <span className={styles.containerMainInfoBodyShippingBodyTextColor} onClick={() => setShow(true)}>Clique aqui</span>
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                    <div className={styles.containerMainInfoBodyAdditionalPositives}>
                                        <div className={styles.containerMainInfoBodyAdditionalPositiveItem}>
                                            <div className={styles.containerMainInfoBodyAdditionalPositiveLeft}>
                                                <PiArrowBendDownLeft className={styles.containerMainInfoBodyAdditionalPositiveLeftIcon} />
                                            </div>
                                            <div className={styles.containerMainInfoBodyAdditionalPositiveRight}>
                                                <span className={styles.containerMainInfoBodyAdditionalPositiveRightTitle}>Devolução grátis</span>
                                                <span className={styles.containerMainInfoBodyAdditionalPositiveRightText}>Você tem 7 dias a partir da data de recebimento.</span>
                                            </div>
                                        </div>
                                        <div className={styles.containerMainInfoBodyAdditionalPositiveItem}>
                                            <div className={styles.containerMainInfoBodyAdditionalPositiveLeft}>
                                                <PiShieldCheck className={styles.containerMainInfoBodyAdditionalPositiveLeftIcon} />
                                            </div>
                                            <div className={styles.containerMainInfoBodyAdditionalPositiveRight}>
                                                <span className={styles.containerMainInfoBodyAdditionalPositiveRightTitle}>Compra Garantida</span>
                                                <span className={styles.containerMainInfoBodyAdditionalPositiveRightText}>receba o produto que está esperando ou devolvemos o dinheiro.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.containerMainInfoBodyStock}>
                                        <span className={styles.containerMainInfoBodyStockTextFocus}>Quantidade:</span>
                                        <QuantitySelect 
                                            min={(product.has_variations && currentChild?.quantity) || product.quantity ? 1 : 0} 
                                            max={currentChild?.quantity || product.quantity || 0} 
                                        />
                                        <span className={styles.containerMainInfoBodyStockText} style={(product.has_variations && currentChild?.quantity) || product.quantity ? undefined : {color: 'red'}}>
                                            restam {product.has_variations ? currentChild?.quantity : product.quantity} disponíveis
                                        </span>
                                    </div>
                                    <div ref={sectionToScrollRef} className={styles.containerMainInfoBodyActions}>
                                        <div className={styles.containerMainInfoBodyActionsSubOne}>
                                            <BtnB02 autoWidth>Adicionar aos favoritos</BtnB02>
                                            <BtnB02 autoWidth>Adicionar ao carrinho</BtnB02>
                                        </div>
                                        <div className={styles.containerMainInfoBodyActionsSubTwo}>
                                            <BtnA01 
                                                href='' 
                                                autoWidth 
                                                disabled={(product.has_variations && currentChild?.quantity) || product.quantity ? false : true}>
                                                    Comprar
                                            </BtnA01>
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
                                            if(productDetail.show || productDetail.fixed){
                                                return (
                                                    <li className={`${styles.containerSecondaryHeaderUlLi} ${productDetail.id === currentProductDetailId ? styles.containerSecondaryHeaderUlLiFocus : null}`} key={productDetail.id} onClick={() => setCurrentProductDetailId(productDetail.id)}>
                                                        <span className={styles.containerSecondaryHeaderUlLiText}>
                                                            {
                                                                productDetail.id === 3 ? (
                                                                    // simplifying an example number 5300 into 5.3
                                                                    productDetail.name + ` (${
                                                                        starsRating && starsRating.count >= 1000 ? `${(starsRating.count / 1000).toFixed(1).replace('.', ',')} mil` : 
                                                                        starsRating && starsRating.count >= 1000000 ? `${(starsRating.count / 1000000).toFixed(1).replace('.', ',')} milhões` :
                                                                        starsRating?.count
                                                                        
                                                                    })` 
                                                                ) : productDetail.name
                                                            }
                                                        </span>
                                                    </li>
                                                )
                                            }
                                            return null
                                        })}
                                    </ul>
                                </div>
                                <div className={`${styles.containerSecondaryBody} ${styles.default}`}>
                                    {productDetails.map(productDetail => {
                                        if (currentProductDetailId === productDetail.id && (productDetail.show || productDetail.fixed) && productDetail.id === 0){
                                            return (
                                                <div className={styles.containerSecondaryWindow} key={productDetail.id}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitleText}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <ul className={styles.containerSecondaryWindowUl}>
                                                            {product.presentation && Object.entries(product.presentation).map(([key, value], index) => (
                                                                <li key={index} className={styles.containerSecondaryWindowUlLi}><img className={styles.containerSecondaryWindowImg} src={value} alt="" /></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        }else if(currentProductDetailId === productDetail.id && (productDetail.show || productDetail.fixed) && productDetail.id === 1){
                                            return (
                                                <div className={styles.containerSecondaryWindow} key={productDetail.id}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitleText}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <p className={styles.containerSecondaryWindowBodyText}>{product.description}</p>
                                                    </div>
                                                </div>
                                            )
                                        }else if(currentProductDetailId === productDetail.id && (productDetail.show || productDetail.fixed) && productDetail.id === 2){
                                            return (
                                                <div className={styles.containerSecondaryWindow} key={productDetail.id}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitleText}>{productDetail.name}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <table className={styles.containerSecondaryWindowBodyTable}>
                                                            <tbody className={styles.containerSecondaryWindowBodyTableBody}>
                                                                {product.technical_informations.map(item => (
                                                                    <tr className={styles.containerSecondaryWindowBodyTableBodyTr} key={item.id}>
                                                                        <th className={styles.containerSecondaryWindowBodyTableHeadTrTh}>{item.name}</th>
                                                                        <td className={styles.containerSecondaryWindowBodyTableBodyTrTd}>{item.description}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )
                                        }else if(currentProductDetailId === productDetail.id && (productDetail.show || productDetail.fixed) && productDetail.id === 3){
                                            return (
                                                <div className={styles.containerSecondaryWindow} key={productDetail.id}>
                                                    <div className={styles.containerSecondaryWindowHeader}>
                                                        <div className={styles.containerSecondaryWindowHeaderTitle}>
                                                            <h4 className={styles.containerSecondaryWindowHeaderTitleText}>{productDetail.name + ` (${starsRating?.count.toLocaleString('pt-BR')})`}</h4>
                                                        </div>
                                                        <div className={styles.containerSecondaryWindowHeaderFilters}>
                                                            <div 
                                                                className={
                                                                    `${styles.containerSecondaryWindowHeaderFiltersFilter} 
                                                                    ${!starRatingFilter ? styles.containerSecondaryWindowHeaderFiltersFilterSelected : null}`
                                                                }
                                                                onClick={() => {setStarRatingFilter(null);scrollToSection('rating')}}
                                                            >
                                                                <span className={styles.containerSecondaryWindowHeaderFiltersFilterText}>Tudo</span>
                                                            </div>
                                                            {starsRating && starsRating.detail.map(star => (
                                                                <div 
                                                                    key={star.id} 
                                                                    className={`
                                                                        ${styles.containerSecondaryWindowHeaderFiltersFilter} 
                                                                        ${starRatingFilter === star.id ? styles.containerSecondaryWindowHeaderFiltersFilterSelected : null}
                                                                    `} 
                                                                    onClick={() => {setStarRatingFilter(star.id);scrollToSection('rating')}}
                                                                >
                                                                    <span className={styles.containerSecondaryWindowHeaderFiltersFilterText}>{star.name} {parseInt(star.name) > 1 ? 'estrelas' : 'estrela'} {`(${star.quantity.toLocaleString('pt-BR')})`}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <div className={styles.containerSecondaryWindowBodyComments}>
                                                            <div className={styles.containerSecondaryWindowBodyCommentsHeader}>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItem}>
                                                                    <StarRating size='20pt' rate={starsRating?.average || 0} />
                                                                    <span className={styles.containerSecondaryWindowBodyCommentsHeaderItemRatingText}>
                                                                        <span className={styles.containerSecondaryWindowBodyCommentsHeaderItemRatingTextD}>{starsRating && Math.floor(starsRating.average * 10) / 10}</span> de 5
                                                                    </span>
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItem}>
                                                                    <span>Total de {starsRating?.count.toLocaleString('pt-BR')} avaliações</span>
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItemTwo}>
                                                                    {starsRating && starsRating.detail.map(star => (
                                                                        <div key={star.id} className={styles.containerSecondaryWindowBodyCommentsHeaderItemTwoItem}>
                                                                            <span className={styles.containerSecondaryWindowBodyCommentsHeaderItemTwoItemText}>{star.name} {parseInt(star.name) > 1 ? 'estrelas' : 'estrela'}</span>
                                                                            <SimpleProgressBar 
                                                                                currentValue={star.quantity} 
                                                                                totalValue={starsRating.count} 
                                                                                height={10}
                                                                                backgroundColor='var(--star-color)'
                                                                            />
                                                                            <span className={styles.containerSecondaryWindowBodyCommentsHeaderItemTwoItemText}>{Math.floor(star.percentage)}%</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className={styles.containerSecondaryWindowBodyCommentsBody}>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsBodyBody}>
                                                                    {comments.length > 0 ? (
                                                                        comments.map(commentT => (
                                                                            <div className={styles.containerSecondaryWindowBodyCommentsBodyComment} key={commentT.id}>
                                                                                <div className={styles.containerSecondaryWindowBodyCommentsBodyCommentHeader} >
                                                                                    <img className={styles.containerSecondaryWindowBodyCommentsBodyCommentHeaderImage} src="https://images-na.ssl-images-amazon.com/images/S/amazon-avatars-global/default._CR0,0,1024,1024_SX48_.png" alt="" />
                                                                                </div>
                                                                                <div className={styles.containerSecondaryWindowBodyCommentsBodyCommentBody} >
                                                                                    <div className={styles.containerSecondaryWindowBodyCommentsBodyCommentBodyT}>
                                                                                        <span className={styles.containerSecondaryWindowBodyCommentsBodyCommentTitle}>{`${commentT.owner.first_name} ${commentT.owner.last_name}`}</span>
                                                                                        <span className={styles.containerSecondaryWindowBodyCommentsBodyCommentDate}>
                                                                                            há {dateDifferenceFormat(commentT.created_at).value} {dateDifferenceFormat(commentT.created_at).value > 1 ? dateDifferenceFormat(commentT.created_at).plural : dateDifferenceFormat(commentT.created_at).noun}
                                                                                        </span>
                                                                                    </div>
                                                                                    <StarRating rate={commentT.rating} />
                                                                                    <p className={styles.containerSecondaryWindowBodyCommentsBodyCommentDescription}>{commentT.comment}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ):(
                                                                        <div className={styles.containerSecondaryWindowBodyCommentsBodyNoComments}>
                                                                            <span>Nenhuma avaliação</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsBodyFooter}>
                                                                    <div onClick={() => scrollToSection('rating')}>
                                                                        <BarPagination 
                                                                            totalPageCount={totalPageCount}
                                                                            currentPage={currentPage}
                                                                            onChange={setCurrentPage}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                </div>
                            </div>
                        }
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
                        <StyledSectionA>
                            {categoriesData[1] && categoriesData[1].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[1].name} href={`/search?q=&categories=${categoriesData[1].id}`} enableScroll={true} autoScroll={true}>
                                    {categoriesData[1].products.map((product) => (
                                        <SimpleProductCard key={product.id} product={product} showDiscountPercentage={true} />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </StyledSectionA>
                    </div>
                </WidthLayout>
            </div>
        )
    )
}

export default ProductPage