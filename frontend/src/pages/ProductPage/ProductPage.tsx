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
import { Category } from '../../types/CategoryType'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/ProductCards/SimpleProductCard/SimpleProductCard'
import { Comment } from '../../types/CommentType'
import { useDateDifferenceCalculator } from '../../hooks/useDateDifferenceCalculator'
import BarPagination from '../../components/Paginations/BarPagination/BarPagination'


type Props = {}

const ProductPage = (props: Props) => {
    const { productId } = useParams()
    const { setIsLoading } = useContext(LoadingContext)
    const { updateTitle } = usePageTitleChanger()
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { dateDifferenceFormat } = useDateDifferenceCalculator()

    const [product, setProduct] = useState<Product | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')

    const [categoriesData, setCategoriesData] = useState<Category[]>([])

    type ProductDetailsType = {
        id: number
        name: string
        show: boolean
        fixed: boolean
    }

    const [productDetails, setProductDetails] = useState<ProductDetailsType[]>([])
    const [currentProductDetailId, setCurrentProductDetailId] = useState<number>()

    const [comments, setComments] = useState<Comment[]>([])

    const [currentPage, setCurrentPage] = useState<number>(0)
    const [totalPageCount, setTotalPageCount] = useState<number>(0)
    const itemsPerPage = 10

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
        const get_comments = async () => {
            setIsLoading(true)
            try {
                const offset = currentPage * itemsPerPage
                const response = await axios.get(`/comments/product/${productId}?limit=${itemsPerPage}&offset=${offset}`)
                if(response.status === 200){
                    setComments(response.data.results)
                    setTotalPageCount(response.data.total_page_count)
                }
            } catch (error) {
                setComments([])
            }
            setIsLoading(false)
        }
        get_comments()
    }, [productId, currentPage, itemsPerPage, setComments, setIsLoading])

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
    }, [productDetails])

    useEffect(() => {
        const get_categories = async () => {
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
        }
        get_categories()
    }, [setIsLoading])
 
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
                                            if(productDetail.show || productDetail.fixed){
                                                return (
                                                    <li className={`${styles.containerSecondaryHeaderUlLi} ${productDetail.id === currentProductDetailId ? styles.containerSecondaryHeaderUlLiFocus : null}`} key={productDetail.id} onClick={() => setCurrentProductDetailId(productDetail.id)}>
                                                        <span className={styles.containerSecondaryHeaderUlLiText}>{productDetail.id === 3 ? productDetail.name + ` (${product.rating.count})` : productDetail.name}</span>
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
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
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
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
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
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name}</h4>
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
                                                        <h4 className={styles.containerSecondaryWindowHeaderTitle}>{productDetail.name + ` (${product.rating.count})`}</h4>
                                                    </div>
                                                    <div className={styles.containerSecondaryWindowBody}>
                                                        <div className={styles.containerSecondaryWindowBodyComments}>
                                                            <div className={styles.containerSecondaryWindowBodyCommentsHeader}>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItem}>
                                                                    <StarRating size='20pt' rate={product.rating.average} />
                                                                    <span>{product.rating.average} de 5</span>
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItem}>
                                                                    <span>{product.rating.count} avaliações</span>
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsHeaderItem}>
                                                                    
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
                                                                                        <span className={styles.containerSecondaryWindowBodyCommentsBodyCommentDate}>há {dateDifferenceFormat(commentT.created_at).value} {dateDifferenceFormat(commentT.created_at).noun}</span>
                                                                                    </div>
                                                                                    <StarRating rate={commentT.rating} />
                                                                                    <p className={styles.containerSecondaryWindowBodyCommentsBodyCommentDescription}>{commentT.comment}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ):(
                                                                        <span>Nenhuma avaliação</span>
                                                                    )}
                                                                </div>
                                                                <div className={styles.containerSecondaryWindowBodyCommentsBodyFooter}>
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
                                            )
                                        }else{
                                            return null
                                        }
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.footer}>
                        <section className={styles.sectionA}>
                            {categoriesData[0] && categoriesData[0].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[0].name} href={`/search?q=&categories=${categoriesData[0].id}`} enableScroll={true} autoScroll={true}>
                                    {categoriesData[0].products.map((product) => (
                                        <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </section>
                        <section className={styles.sectionA}>
                            {categoriesData[1] && categoriesData[1].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[1].name} href={`/search?q=&categories=${categoriesData[1].id}`} enableScroll={true} autoScroll={true}>
                                    {categoriesData[1].products.map((product) => (
                                        <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </section>
                    </div>
                </WidthLayout>
            </div>
        )
    )
}

export default ProductPage