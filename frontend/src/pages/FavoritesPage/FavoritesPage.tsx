import React, { useContext, useCallback, useEffect, useState } from 'react'
import styles from './FavoritesPage.module.css'
import { AuthContext } from '../../contexts/AuthContext'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import HorizProductCard from '../../components/UI/ProductCards/HorizProductCard/HorizProductCard'
import { Children, Product } from '../../types/ProductType'
import { useFavoritesRequests } from '../../hooks/useBackendRequests'
import { FavoriteType } from '../../types/FavoritesType'

type Props = {}

const FavoritesPage = (props: Props) => {
    const { areTokensUpdated, isAuthenticated } = useContext(AuthContext)
    const [products, setProducts] = useState<Product[] | null>(null)
    const [children, setChildren] = useState<Children[] | null>(null)

    const { getFavorites, removeFromFavorites } = useFavoritesRequests()

    const handleRemoveFromFavorites = ({ productId, childId } : { productId?: number, childId?: number }) => {
        if(childId){
            setChildren(prev => {
                return prev?.filter(item => item.id !== childId) || []
            })
        }else{
            setProducts(prev => {
                return prev?.filter(item => item.id !== productId) || []
            })
        }
    }

    const handleFavorites = useCallback((data: FavoriteType) => {
        const productFathersData: Product[] = data.product_fathers
        const productChildsData: Children[] = data.product_childs
        setProducts(productFathersData.length > 0 ? productFathersData : null)
        setChildren(productChildsData.length > 0 ? productChildsData : null)
    }, [])

    useEffect(() => {
        if(areTokensUpdated && isAuthenticated){
            getFavorites({callback: handleFavorites})
        }
    }, [areTokensUpdated, isAuthenticated, getFavorites, handleFavorites])

    return (
        <WidthLayout width={90}>
            <ProfileLayout 
                title='Seus favoritos' 
                text='Produtos adicionados os seus favoritos.'
                contentClassName={styles.favoritesWrapper}
            >
                <div className={styles.container}>
                    {products && (
                        products.map(product => (
                            <div className={styles.item} key={product.id}>
                                <HorizProductCard 
                                    product={product}
                                    removeFromFavoritesCallback={() => removeFromFavorites({ 
                                        productId: product.id, 
                                        callback: handleRemoveFromFavorites, 
                                        callbackArgs: { productId: product.id } 
                                    })} 
                                />
                            </div>
                        ))
                    )}
                    {children && (
                        children.map(child => (
                            <div className={styles.item} key={child.id}>
                                <HorizProductCard 
                                    child={child}
                                    removeFromFavoritesCallback={() => removeFromFavorites({ 
                                        productId: child.product_father_id,
                                        childId: child.id, 
                                        callback: handleRemoveFromFavorites, 
                                        callbackArgs: {productId: child.product_father_id, childId: child.id } 
                                    })}  
                                />
                            </div>
                        ))
                    )}
                    {!products && !children &&
                        <div className={styles.container2}>
                            <span>Você ainda não adicionou nenhum produto nos seus favoritos.</span>
                        </div>
                    }
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default FavoritesPage