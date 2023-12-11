import React from 'react'
import styles from './HorizProductCard.module.css'
import { Product } from '../../../../types/ProductType'
import { useCurrencyFormatter } from '../../../../hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router-dom'
import { useSlug } from '../../../../hooks/useSlug'
import BtnB01 from '../../Buttons/BtnB01/BtnB01'
import BtnB02 from '../../Buttons/BtnB02/BtnB02'

type Props = {
    data: Product
    addToCartCallback?: () => void
    removeFromFavoritesCallback?: () => void
}

const HorizProductCard = ({ data, addToCartCallback, removeFromFavoritesCallback }: Props) => {
    const { CurrencyFormatter } = useCurrencyFormatter()
    const { createSlug } = useSlug()
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        navigate(`/${createSlug(data.name)}/p/${data.id}`)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerImage}>
                    <div className={styles.flexImage}>
                        <img 
                            className={styles.image}
                            src={data.children[0].images.principal_image} 
                            alt={data.name} 
                        />
                    </div>
                </div>
                <div className={styles.containerContent}>
                    <div className={styles.header}>
                        <a className={styles.title} href='/' onClick={handleClick}>{data.name.length > 80 ? `${data.name.slice(0, 80)}...` : data.name}</a>
                        <span className={styles.text}>{data.description?.slice(0, 20)}</span>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.bodyPrices}>
                            <span className={styles.price}>{CurrencyFormatter(data.children[0].default_price)}</span>
                            {data.children[0].discount_price &&
                                <span className={styles.discount_price}>{CurrencyFormatter(data.children[0].discount_price)}</span>
                            }
                        </div>
                        <span className={styles.text}>ou 12x {CurrencyFormatter(data.children[0].installment_details.installment_price)} sem juros</span>
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