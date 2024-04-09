import React, { useContext } from 'react'
import styles from './ChangePasswordPage.module.css'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import { UserContext } from '../../contexts/UserContext'
import { PiShieldFill, PiKeyDuotone } from "react-icons/pi";
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import { useNavigate } from 'react-router-dom'


type Props = {}

const ChangePasswordPage = (props: Props) => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/account/reset/password?email=${user.email}`)
    }

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <div className={styles.container}>
                    <div className={styles.item}>
                        <div className={styles.iconContainer}>
                            <PiShieldFill className={styles.icon} />
                            <PiKeyDuotone className={styles.iconOn} />
                        </div>
                    </div>
                    <div className={styles.item2}>
                        <span className={styles.text}>
                            Para redefinir seu acesso, clique no botão abaixo. Lembre-se de não compartilhar suas credenciais com ninguém. Após clicar no botão, será necessário fornecer o código que será enviado para:
                            <strong className={styles.email}>{user.email}</strong> 
                            Para concluir o processo de atualização da senha, clique em alterar minha senha.
                        </span>
                        <BtnB01 autoWidth onClick={handleClick}>Alterar minha senha</BtnB01>
                    </div>
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default ChangePasswordPage