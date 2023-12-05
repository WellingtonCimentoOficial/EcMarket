import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { axios } from '../../services/api'
import * as originalAxios from 'axios'
import styles from './VerifyAccountPage.module.css'
import { PiSealCheckFill, PiXCircleFill  } from "react-icons/pi";
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'
import { LoadingContext } from '../../contexts/LoadingContext'
import { VERIFIED_ACCOUNT_SUCCESS } from '../../constants/successMessages'
import { 
    ACCOUNT_ALREADY_VERIFIED_ERROR, ACCOUNT_VERIFICATION_CODE_NOT_FOUND_ERROR, 
    ACCOUNT_VERIFICATION_ERROR, EXPIRED_ACCOUNT_VERIFICATION_CODE_ERROR, 
    INVALID_ACCOUNT_VERIFICATION_CODE_ERROR, INVALID_ACCOUNT_VERIFICATION_CODE_FORMAT_ERROR, 
    RECAPTCHA_ERROR 
} from '../../constants/errorMessages'

type Props = {}

const VerifyAccountPage = (props: Props) => {
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('code')
    const [message, setMessage] = useState<{title: string, text: string, isError: boolean} | null>(null)

    const { updateTitle } = usePageTitleChanger()

    const { getCaptchaToken, recaptchaScriptLoaded, initializeRecaptchaScript } = useReCaptchaToken()

    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const verify_account = useCallback(async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        try {
            const response = await axios.post(`/accounts/verify/`, {
                code,
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 200){
                setIsVerified(true)
                setMessage({
                    title: VERIFIED_ACCOUNT_SUCCESS.title,
                    text: VERIFIED_ACCOUNT_SUCCESS.text,
                    isError: false
                })
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error?.response?.data.cod === 12){
                    setMessage({
                        title: EXPIRED_ACCOUNT_VERIFICATION_CODE_ERROR.title,
                        text: EXPIRED_ACCOUNT_VERIFICATION_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 13){
                    setMessage({
                        title: INVALID_ACCOUNT_VERIFICATION_CODE_FORMAT_ERROR.title,
                        text: INVALID_ACCOUNT_VERIFICATION_CODE_FORMAT_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 14){
                    setMessage({
                        title: ACCOUNT_ALREADY_VERIFIED_ERROR.title,
                        text: ACCOUNT_ALREADY_VERIFIED_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 15){
                    setMessage({
                        title: INVALID_ACCOUNT_VERIFICATION_CODE_ERROR.title,
                        text: INVALID_ACCOUNT_VERIFICATION_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 16){
                    setMessage({
                        title: ACCOUNT_VERIFICATION_CODE_NOT_FOUND_ERROR.title,
                        text: ACCOUNT_VERIFICATION_CODE_NOT_FOUND_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 24){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
                }else{
                    setMessage({
                        title: ACCOUNT_VERIFICATION_ERROR.title,
                        text: ACCOUNT_VERIFICATION_ERROR.text,
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
        setIsLoading(true)
        if(recaptchaScriptLoaded){
            getCaptchaToken(verify_account)
            setIsLoading(false)
        }
    }, [recaptchaScriptLoaded, verify_account, getCaptchaToken ,setIsLoading])

    useEffect(() => {
        initializeRecaptchaScript()
    }, [initializeRecaptchaScript])

    return (
        <>
            {!isLoading &&
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
                                    <><a href="/account/sign-in">Clique aqui</a> para fazer login na sua conta. </>
                                    :
                                    <>Para fazer a solicitação de outro <a href="/account/sign-in">Clique aqui</a> para fazer login na sua conta. </>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default VerifyAccountPage