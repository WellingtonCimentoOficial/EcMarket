import React from 'react'
import styles from './ProfilePage.module.css'
import UserMenu from '../../components/UI/Menus/UserMenu/UserMenu'

type Props = {}

const ProfilePage = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <UserMenu />
            </div>
        </div>
    )
}

export default ProfilePage