import React, { useState } from 'react'
import styles from './ChangePasswordPage.module.css'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import StandardInput from '../../components/UI/Inputs/PasswordInput/StandardInput'
import CodeConfirmationForm from '../../components/Screens/CodeConfirmationForm/CodeConfirmationForm'

type Props = {}

const ChangePasswordPage = (props: Props) => {
    const [password, setPassword] = useState<string>("")
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState<boolean>(false)
    const [stage, setStage] = useState<number>(0)
    const [inputsFocus, setInputsFocus] = useState<{id: string, value: boolean}[]>([
        {id: 'password', value: false},
        {id: 'confirmPassword', value: false},
    ])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const handlePassword = () => {

    }

    const handleConfirmPassword = () => {

    }

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <CodeConfirmationForm />
            </ProfileLayout>
        </WidthLayout>
    )
}

export default ChangePasswordPage