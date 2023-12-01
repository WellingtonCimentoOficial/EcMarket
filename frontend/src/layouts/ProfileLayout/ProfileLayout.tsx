import React from 'react'
import styles from './ProfileLayout.module.css'
import UserMenu from '../../components/UI/Menus/UserMenu/UserMenu'

type Props = {
    title: string,
    text: string,
    children: React.ReactNode
}

const ProfileLayout = ({ title, text, children }: Props) => {
    return (
        <div className={styles.wrapper}>
                <div className={styles.userMenu}>
                    <UserMenu />
                </div>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h3 className={styles.headerTitle}>{title}</h3>
                        <p className={styles.headerDescription}>{text}</p>
                    </div>
                    <div className={styles.body}>
                        {children}
                    </div>
                </div>
         </div>       
    )
}

export default ProfileLayout