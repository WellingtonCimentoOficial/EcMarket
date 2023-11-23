import React, { useEffect } from 'react'
import styles from './ResetPasswordPage.module.css'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import CodeConfirmationForm from '../../components/Screens/CodeConfirmationForm/CodeConfirmationForm'

type Props = {}

const ResetPasswordPage = (props: Props) => {
    const { updateTitle } = usePageTitleChanger()

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Reset Password`)
    }, [updateTitle])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <CodeConfirmationForm />
            </div>
        </div>
    )
}

export default ResetPasswordPage