import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { axios } from '../../services/api'
import * as originalAxios from 'axios'
import styles from './VerifyAccountPage.module.css'
import { PiSealCheckFill, PiXCircleFill  } from "react-icons/pi";
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'

type Props = {}

const VerifyAccountPage = (props: Props) => {
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('code')
    const [message, setMessage] = useState<{title: string, text: string, isError: boolean} | null>(null)

    const { updateTitle } = usePageTitleChanger()

    const { scriptLoaded, getCaptchaToken } = useReCaptchaToken()

    const verify_account = useCallback(async (CaptchaToken: string) => {
        try {
            const response = await axios.post(`/accounts/verify/`, {
                code,
                "g-recaptcha-response": CaptchaToken
            })
            if(response.status === 200){
                setIsVerified(true)
                setMessage({
                    title: 'Conta Verificada!',
                    text: 'Sua conta foi verificada com sucesso, agora você pode aproveitar todos os beneficios.',
                    isError: false
                })
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error?.response?.data.cod === 12){
                    setMessage({
                        title: 'Código Expirado',
                        text: 'O código de verificação está expirado. Será necesário solicitar outro para poder efeturar a verificação da conta.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 13){
                    setMessage({
                        title: 'Formato Inválido',
                        text: 'O formato do código de verificação informado é inválido. Verifique o mesmo e tente novamente.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 14){
                    setMessage({
                        title: 'Conta já verificada',
                        text: 'A conta portadora do código de verificação ja foi validada.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 15){
                    setMessage({
                        title: 'Código Inválido',
                        text: 'O código de verificação informado é inválido.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 16){
                    setMessage({
                        title: 'Código não encontrado',
                        text: 'O código de verificação não foi encontrado.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 24){
                    setMessage({
                        title: 'Erro no ReCaptcha',
                        text: 'Ocorreu um erro ao tentar validar o recaptcha, tente novamente mais tarde.',
                        isError: true
                    })
                }else{
                    setMessage({
                        title: 'Ocorreu um erro',
                        text: 'Ocorreu um erro ao tentar validar a conta.',
                        isError: true
                    })
                }
            }
        }
    }, [code])
    
    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Verify Account`)
    }, [updateTitle])

    useEffect(() => {
        if(scriptLoaded){
            getCaptchaToken(verify_account)
        }
    }, [verify_account, scriptLoaded, getCaptchaToken])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    {!message?.isError ?
                        <PiSealCheckFill className={styles.headerIcon} /> :
                        <PiXCircleFill className={styles.headerIcon} />
                    }
                    <h3 className={styles.headerTitle}>
                        {message?.title}
                    </h3>
                </div>
                <div className={styles.body}>
                    <p className={styles.headerDescription}>
                        {message?.text + ' '}
                        {isVerified ? 
                            <>
                                <a href="/accounts/sign-in">Clique aqui</a> para fazer login na sua conta. 
                            </>
                            :
                            <>
                                Para fazer a solicitação de outro <a href="/accounts/sign-in">Clique aqui</a> para fazer login na sua conta. 
                            </>
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccountPage