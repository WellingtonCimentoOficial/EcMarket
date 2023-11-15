import React from 'react'
import LoginForm from '../../components/Screens/LoginForm/LoginForm'
import styles from "./LoginPage.module.css"

type Props = {}

const LoginPage = (props: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage