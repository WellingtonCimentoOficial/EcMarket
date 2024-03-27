import React, { useContext, useCallback, useEffect, useState } from 'react'
import styles from './FavoritesPage.module.css'
import { AuthContext } from '../../contexts/AuthContext'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import HorizProductCard from '../../components/UI/ProductCards/HorizProductCard/HorizProductCard'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { LoadingContext } from '../../contexts/LoadingContext'
import { Product } from '../../types/ProductType'
import { useFavoritesRequests } from '../../hooks/useBackendRequests'

type Props = {}

const FavoritesPage = (props: Props) => {
    const { tokens } = useContext(AuthContext)
    const axiosPrivate = useAxiosPrivate()
    const { setIsLoading } = useContext(LoadingContext)
    const [products, setProducts] = useState<Product[] | null>(null)

    const { removeFromFavorites } = useFavoritesRequests()

    const handleRemoveFromFavorites = ({ productId } : { productId?: number }) => {
        setProducts(prev => {
            return prev?.filter(item => item.id !== productId) || []
        })
    }

    const get_favorites = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/favorites/')
            if(response?.status === 200){
                const data: Product[] = response.data.products
                setProducts(data.length > 0 ? data : null)
            }
        } catch (error) {
            
        }
        setIsLoading(false)
    }, [setIsLoading, axiosPrivate])

    useEffect(() => {
        if(tokens.refresh){
            get_favorites()
        }
    }, [tokens.refresh, get_favorites])

    return (
        <WidthLayout width={90}>
            <ProfileLayout 
                title='Seus favoritos' 
                text='Produtos adicionados os seus favoritos.'
                contentClassName={styles.favoritesWrapper}
            >
                <div className={styles.container}>
                    {products ? (
                        products.map(product => (
                            <div className={styles.item} key={product.id}>
                                <HorizProductCard 
                                    key={product.id} 
                                    product={product}
                                    removeFromFavoritesCallback={() => removeFromFavorites({ 
                                        productId: product.id, 
                                        callback: handleRemoveFromFavorites, 
                                        callbackArgs: { productId: product.id } 
                                    })} 
                                />
                            </div>
                        ))
                    ):(
                        <div className={styles.container2}>
                            <span>Você ainda não adicionou nenhum produto nos seus favoritos.</span>
                        </div>
                    )}
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default FavoritesPage