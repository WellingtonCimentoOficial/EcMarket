import React, { useState, useCallback, useEffect } from 'react'
import styles from './ProfileLayout.module.css'
import MyAccountMenu from '../../components/UI/Menus/MyAccountMenu/MyAccountMenu'
import { NavLink, useLocation } from 'react-router-dom'
import { PiCaretRightLight } from 'react-icons/pi'
import { Category } from '../../types/CategoryType'
import HeaderAndContentLayout from '../HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/UI/ProductCards/SimpleProductCard/SimpleProductCard'
import StyledSectionA from '../../styles/StyledSectionA'
import { useCategoriesRequests } from '../../hooks/useBackendRequests'

type Props = {
    title: string,
    text: string,
    children: React.ReactNode
    contentClassName?: string
}

const ProfileLayout = ({ title, text, children, contentClassName }: Props) => {
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const currentRoute = useLocation()
    const { getCategories} = useCategoriesRequests()

    const handleCategories = useCallback((data: Category[]) => {
        setCategoriesData(data)
    }, [])

    useEffect(() => {
        getCategories({callback: handleCategories})
    }, [getCategories, handleCategories])

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapperHeader}>
                {currentRoute.pathname.split('/').map((path, index) => (
                    <div className={styles.wrapperHeaderContainer} key={index}>
                        <NavLink 
                            to={`/${path}`} 
                                className={({ isActive }) => !isActive ? `${styles.path} ${styles.pathActive}` : styles.path}
                            >
                            {path.charAt(0).toUpperCase() + path.slice(1)}
                        </NavLink>
                        {(index > 0 && index + 1 < currentRoute.pathname.split('/').length) &&
                            <PiCaretRightLight className={styles.pathIcon} />
                        }
                    </div>
                ))}
            </div>
            <div className={styles.wrapperBody}>
                <div className={styles.userMenu}>
                    <div className={styles.myAccountMenuContainer}>
                        <MyAccountMenu shadow />
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h3 className={styles.headerTitle}>{title}</h3>
                        <p className={styles.headerDescription}>{text}</p>
                    </div>
                    <div className={`${styles.body} ${contentClassName}`}>
                        {children}
                    </div>
                </div>
            </div>
            <div className={styles.wrapperFooter}>
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
    )
}

export default ProfileLayout