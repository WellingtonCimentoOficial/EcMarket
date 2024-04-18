import React, { useEffect, useContext } from 'react'
import styles from './ResetPasswordPage.module.css'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import CodeConfirmationForm from '../../components/Screens/CodeConfirmationForm/CodeConfirmationForm'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'
import { UserContext } from '../../contexts/UserContext'
import { useQueryParam } from '../../hooks/useQueryParam'

type Props = {}

const ResetPasswordPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()
    const { areTokensUpdated, isAuthenticated } = useContext(AuthContext)
    const { initializeRecaptchaScript } = useReCaptchaToken()
    const [searchParams] = useSearchParams()
    const emailParam = searchParams.get("email")
    const { user } = useContext(UserContext)

    const navigate = useNavigate()
    const { removeParam } = useQueryParam()

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Reset Password`)
        const userIsAuthenticated = areTokensUpdated && isAuthenticated
        if((userIsAuthenticated && !emailParam) || (userIsAuthenticated && emailParam !== user.email)){
            navigate('/account/password/change')
        }else if(!userIsAuthenticated && emailParam){
            removeParam("email")
        }
    }, [areTokensUpdated, isAuthenticated, emailParam, removeParam, user.email, updateTitle, navigate])

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
                <CodeConfirmationForm userEmail={emailParam} />
            </div>
        </div>
    )
}

export default ResetPasswordPage