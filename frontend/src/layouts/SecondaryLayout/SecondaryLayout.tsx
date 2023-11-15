import React from 'react'
import { Outlet } from 'react-router-dom'
import SimpleHeader from '../../components/UI/Headers/SimpleHeader/SimpleHeader'
import SimpleFooter from '../../components/UI/Footers/SimpleFooter/SimpleFooter'
import styles from './SecondaryLayout.module.css'

type Props = {}

const SecondaryLayout = (props: Props) => {
    return (
        <>
            <div className={styles.fixed}>
                <SimpleHeader />
            </div>
            <Outlet />
            <SimpleFooter />
        </>
    )
}

export default SecondaryLayout