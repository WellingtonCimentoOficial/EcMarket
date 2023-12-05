import React, { FormEvent, useState, useRef, MutableRefObject, useContext, useEffect } from 'react'
import styles from './LoginForm.module.css'
import { PiEnvelope, PiKeyBold, PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01';
import SimpleCheckBox from '../../UI/Checkboxes/SimpleCheckBox/SimpleCheckBox';
import { axios } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import * as originalAxios from 'axios';
import { useGoogleOAuth } from '../../../hooks/useGoogleOAuth';
import { useReCaptchaToken } from '../../../hooks/useReCaptchaToken';
import { emailRegex, passwordRegex } from '../../../constants/regexPatterns';
import { MessageErrorType } from '../../../types/ErrorType';
import SimpleError from '../../UI/Errors/SimpleError/SimpleError';
import { INVALID_AUTHENTICATION_APPLE_ERROR, INVALID_AUTHENTICATION_GOOGLE_ERROR, REQUEST_ERROR } from '../../../constants/errorMessages';

const LoginForm = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(true)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<MessageErrorType | null>(null)

    const inputEmailRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const inputPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const oAuthButtonsRef: MutableRefObject<{google: HTMLDivElement | null, apple: HTMLDivElement | null}> = useRef({google: null, apple: null})
    
    const navigate = useNavigate()
    
    const { setTokens, storeToken } = useContext(AuthContext)
    
    const { getCaptchaToken } = useReCaptchaToken()

    const { initializeGoogleAccounts } = useGoogleOAuth({ 
        oAuthButtonsRef: oAuthButtonsRef, 
        setMessage: setMessage,
        setIsLoading: setIsLoading,
        config: {
            type: 'standard',
            size: 'large',
            logo_alignment: 'center',
            width: '400',
            text: 'signin_with'
        }
    })

    const post_data = async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setIsLoading(true)
        try {
            const response: {data: {refresh: string, access: string}, status: number} = await axios.post('/accounts/sign-in/token/', {
                email,
                password,
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 200){
                setMessage(null)
                setTokens(response.data)
                storeToken(response.data.refresh)
                navigate('/')
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 4){
                    setMessage({
                        title: INVALID_AUTHENTICATION_GOOGLE_ERROR.title,
                        text: INVALID_AUTHENTICATION_GOOGLE_ERROR.text,
                        isError: true
                    })
                    setEmail('')
                    setPassword('')
                }else if(error.response?.data.cod === 27){
                    setMessage({
                        title: INVALID_AUTHENTICATION_APPLE_ERROR.title,
                        text: INVALID_AUTHENTICATION_APPLE_ERROR.text,
                        isError: true
                    })
                    setEmail('')
                    setPassword('')
                }else if(error.response?.status === 401){
                    setEmailIsValid(false)
                    setPasswordIsValid(false)
                    setMessage(null)
                    inputEmailRef.current?.focus()
                }else{
                    setMessage({
                        title: REQUEST_ERROR.title,
                        text: REQUEST_ERROR.text,
                        isError: true
                    })
                }
            }
        }
        setIsLoading(false)
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmailRegex = new RegExp(emailRegex)
        const value = e.target.value
        if(newEmailRegex.test(value)){
            setEmailIsValid(true)
        }else{
            setEmailIsValid(false)
        }
        setEmail(value)

    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordRegex = new RegExp(passwordRegex)
        const value = e.target.value
        if(value.length >= 8 && newPasswordRegex.test(value)){
            setPasswordIsValid(true)
        }else{
            setPasswordIsValid(false)
        }
        setPassword(value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        if(email.length > 0 && emailIsValid){
            if(password.length > 0 && passwordIsValid){
                setIsLoading(true)
                getCaptchaToken(post_data)
            }else{
                inputPasswordRef.current?.focus()
            }
        }else{
            inputEmailRef.current?.focus()
        }
    }

    useEffect(() => {
        initializeGoogleAccounts()
    }, [initializeGoogleAccounts])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h3 className={styles.containerHeaderTitle}>Entrar</h3>
                    <p className={styles.containerHeaderDescription}>Bem vindo de volta! Preencha os campos com os dados que você utilizou durante o cadastro</p>
                </div>
                <div className={`${styles.containerBody} ${isLoading ? styles.loading : null}`}>
                    {message && 
                        <SimpleError title={message.title} text={message.text} isError={message.isError} />
                    }
                    <div className={styles.containerBodySocialAccounts}>
                        <div 
                            ref={element => oAuthButtonsRef.current['google'] = element} 
                            style={{minWidth: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center'}}
                            >
                        </div>
                    </div>
                    <div className={styles.separator}>
                        <div className={styles.separatorBar}></div>
                        <span className={styles.separatorText}>Ou</span>
                        <div className={styles.separatorBar}></div>
                    </div>
                    <form className={styles.containerBodyForm} onSubmit={handleSubmit}>
                        <div className={styles.containerBodyFormInputContainer}>
                            <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                <PiEnvelope className={styles.containerBodyFormInputContainerIconIcon} />
                            </div>
                            <span className={styles.containerBodyFormInputContainerLabel}>E-mail</span>
                            <input 
                                ref={inputEmailRef}
                                className={`${styles.containerBodyFormInputContainerInput} ${!emailIsValid ? styles.containerBodyFormInputContainerInputError : null}`} 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder='Digite seu e-mail'
                                required
                                value={email}
                                disabled={isLoading ? true : false}
                                onChange={handleEmail}
                            />
                        </div>
                        <div className={styles.containerBodyFormInputContainer}>
                            <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                <PiKeyBold className={styles.containerBodyFormInputContainerIconIcon} />
                            </div>
                            <span className={styles.containerBodyFormInputContainerLabel}>Password</span>
                            <input 
                                ref={inputPasswordRef}
                                className={`${styles.containerBodyFormInputContainerInput} ${!passwordIsValid ? styles.containerBodyFormInputContainerInputError : null}`} 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                id="password" 
                                placeholder='**********'
                                minLength={8}
                                value={password}
                                disabled={isLoading ? true : false}
                                onChange={handlePassword}
                            />
                            <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconRight}`}>
                                {showPassword ? (
                                    <PiEyeSlashBold 
                                        className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                                        onClick={() => setShowPassword(oldValue => !oldValue)}
                                    />
                                ) : (
                                    <PiEyeBold 
                                    className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                                    onClick={() => setShowPassword(oldValue => !oldValue)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={styles.containerBodyFormInputContainer}>
                            <div className={styles.containerBodyFormInputContainerRemember}>
                                <SimpleCheckBox 
                                    className={styles.containerBodyFormInputContainerRememberInput} 
                                    name='remember-me' 
                                    id='remember-me' 
                                    value={rememberMe} 
                                    onChange={setRememberMe} 
                                />
                                <label className={styles.containerBodyFormInputContainerRememberInputLabel} htmlFor="remember-me">Lembrar de min</label>
                            </div>
                            <a className={styles.containerBodyFormInputContainerForgetPassword} href="/account/reset/password">Esqueceu sua senha?</a>
                        </div>
                        <div className={styles.containerBodyFormInputContainer}>
                            <BtnB01 
                                autoWidth 
                                disabled={isLoading ? true : false}
                                isLoading={isLoading}>
                                    Login
                            </BtnB01>
                        </div>
                    </form>
                </div>
                <div className={`${styles.containerFooter} ${isLoading ? styles.loading : null}`}>
                    <span>Não tem uma conta?</span>
                    <a href="/account/sign-up">Cadastre-se</a>
                </div>
            </div>
        </div>
    )
}

export default LoginForm