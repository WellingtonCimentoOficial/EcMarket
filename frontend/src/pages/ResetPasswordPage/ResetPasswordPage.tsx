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
                <div className={styles.containerHeader}>
                    <h3 className={styles.containerHeaderTitle}>Trocar de senha</h3>
                    <p className={styles.containerHeaderDescription}>Esqueceu a senha? fique tranquilo(a) que em poucos minutos ela será redefinida.</p>
                </div>
                <CodeConfirmationForm />
            </div>
        </div>
    )
}

export default ResetPasswordPage