import React from 'react'
import { Outlet } from "react-router-dom"
import MainHeader from '../../components/UI/Headers/MainHeader/MainHeader'
import MainFooter from '../../components/UI/Footers/MainFooter/MainFooter'
import SimpleCategoriesMenu from '../../components/UI/Menus/SimpleCategoriesMenu/SimpleCategoriesMenu'
import styles from "./MainLayout.module.css"

const MainLayout: React.FC = (): JSX.Element => {
    return (
        <>
            <div className={styles.wrap}>
                <MainHeader/>
                <SimpleCategoriesMenu shadow={true} />
            </div>
            <Outlet />
            <MainFooter />
        </>
    )
}

export default MainLayout