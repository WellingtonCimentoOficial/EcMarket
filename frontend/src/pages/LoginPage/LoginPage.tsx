import React, { useContext, useEffect } from 'react'
import LoginForm from '../../components/Screens/LoginForm/LoginForm'
import styles from "./LoginPage.module.css"
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

type Props = {}

const LoginPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()
    const { tokens } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Login`)
        if(tokens.refresh){
            navigate('/')
        }
    }, [tokens.refresh, updateTitle, navigate])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage