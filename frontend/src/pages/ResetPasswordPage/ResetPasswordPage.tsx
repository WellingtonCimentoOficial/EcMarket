import React, { useEffect, useContext } from 'react'
import styles from './ResetPasswordPage.module.css'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import CodeConfirmationForm from '../../components/Screens/CodeConfirmationForm/CodeConfirmationForm'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'

type Props = {}

const ResetPasswordPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()
    const { tokens } = useContext(AuthContext)
    const { initializeRecaptchaScript } = useReCaptchaToken()

    const navigate = useNavigate()

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Reset Password`)
        if(tokens.refresh){
            navigate('/')
        }
    }, [tokens.refresh, updateTitle, navigate])

    useEffect(() => {
        initializeRecaptchaScript()
    }, [initializeRecaptchaScript])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <CodeConfirmationForm />
            </div>
        </div>
    )
}

export default ResetPasswordPage