import React, { useContext, useEffect } from 'react'
import LoginForm from '../../components/Screens/LoginForm/LoginForm'
import styles from "./LoginPage.module.css"
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

type Props = {}

const LoginPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()
    const { tokens } = useContext(AuthContext)

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Login`)
    }, [updateTitle])

    // if(tokens.refresh){
    //     return <Navigate to='/' />
    // }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage