import React, { useEffect, useState, useContext } from 'react'
import styles from "./ProductPage.module.css"
import { axios } from '../../services/api'
import { useParams } from 'react-router-dom'
import { Product } from '../../types/ProductType'
import { LoadingContext } from '../../contexts/LoadingContext'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'

type Props = {}

const ProductPage = (props: Props) => {
    const { productName, productId } = useParams()
    const { setIsLoading } = useContext(LoadingContext)
    const { updateTitle } = usePageTitleChanger()

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
                        <span>ProductPage <b>{product && product.name}</b></span>
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