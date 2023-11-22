import React, { useContext, useEffect } from 'react'
import styles from "./RegisterPage.module.css"
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../../components/Screens/RegisterForm/RegisterForm'

type Props = {}

const RegisterPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()
    const { tokens } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Register`)
        if(tokens.refresh){
            navigate('/')
        }
    }, [tokens.refresh, updateTitle, navigate])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage