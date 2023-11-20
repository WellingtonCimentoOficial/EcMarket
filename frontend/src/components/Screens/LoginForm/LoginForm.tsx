import React, { FormEvent, useState, useRef, MutableRefObject, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import styles from './LoginForm.module.css'
import { PiEnvelope, PiKeyBold, PiEyeBold, PiEyeSlashBold, PiSealWarning } from "react-icons/pi";
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01';
import SimpleCheckBox from '../../UI/Checkboxes/SimpleCheckBox/SimpleCheckBox';
import { axios } from '../../../services/api';
import SprintLoader from '../../UI/Loaders/SprintLoader/SprintLoader';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import * as originalAxios from 'axios';

declare global {
    interface Window {
        grecaptcha: ReCAPTCHA
        google: Google
    }
}

interface ReCAPTCHA {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

type GoogleButtonType = {
    type: 'standard' | 'icon',
    theme?: 'outline' | 'filled_blue' | 'filled_black',
    size?: 'large' | 'medium' | 'small',
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin',
    shape?: 'rectangular' | 'pill' | 'circle' | 'square',
    logo_alignment?: 'left' | 'center',
    width?: string,
    locale?: string,
    click_listener?: () => void,
}

type CredentialResponse = {
    credential: string
    client_id: string
}


type InitializeType = {
    client_id: string, 
    callback: (response: CredentialResponse) => void,
    login_uri?: string
}

interface Google {
    accounts: {
        id: {
            initialize: ({client_id, callback}: InitializeType) => void
            renderButton: (element: HTMLElement, {
                type, theme, size, text, shape, 
                logo_alignment, width, locale, 
                click_listener
            }: GoogleButtonType) =>  void
            prompt: () => void
        }
    }
}


const LoginForm = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(true)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasGeneralError, setHasGeneralError] = useState<boolean>(false)

    const inputEmailRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const inputPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const oAuthButtonsRef: MutableRefObject<{google: HTMLDivElement | null, apple: HTMLDivElement | null}> = useRef({google: null, apple: null})
    
    const navigate = useNavigate()
    
    const { setTokens, storeToken } = useContext(AuthContext)
    
    const reCaptchaToken = '6LeKJCQnAAAAAPFOjyIvDJazV8ja7lEgR1VIv-He'
    const googleOAuthClientId = '131194775869-49hh1dv2m43pm8pkj90hh3e130vqdndu.apps.googleusercontent.com'

    // checks if email has a valid format
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

    // checks if there is at least one uppercase letter, lowercase letter, number and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/;

    const post_data = async (CaptchaToken: string) => {
        setIsLoading(true)
        try {
            const response: {data: {refresh: string, access: string}, status: number} = await axios.post('/users/sign-in/token/', {
                email,
                password,
                "g-recaptcha-response": CaptchaToken
            })
            if(response.status === 200){
                console.log(response.data)
                setHasGeneralError(false)
                setTokens(response.data)
                storeToken(response.data.refresh)
                navigate('/')
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.status === 401){
                    setEmailIsValid(false)
                    setPasswordIsValid(false)
                    setHasGeneralError(false)
                    inputEmailRef.current?.focus()
                }else{
                    setHasGeneralError(true)
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
                window.grecaptcha.ready(function() {
                    window.grecaptcha.execute(reCaptchaToken, {action: 'submit'}).then(function(token) {
                        post_data(token)
                    })
                })
            }else{
                inputPasswordRef.current?.focus()
            }
        }else{
            inputEmailRef.current?.focus()
        }
    }

    const handleGoogleAuthentication = async (googleResponse: CredentialResponse) => {
        console.log(googleResponse)
        
        const response = await axios.post('/users/sign-in/google/token/', {
            token: googleResponse.credential
        })
        if(response.status === 200){
            setHasGeneralError(false)
            setTokens(response.data)
            storeToken(response.data.refresh)
            navigate('/')
        }
        console.log(response.data)
    }

    useEffect(() => {
        const initializeGoogleAccounts = () => {
            window.google?.accounts?.id.initialize({
                client_id: googleOAuthClientId,
                callback: handleGoogleAuthentication,
                login_uri: 'http://localhost:3000/'
            })
    
            if(oAuthButtonsRef.current.google){
                window.google?.accounts?.id.renderButton(
                    oAuthButtonsRef.current.google, {
                        type: 'standard',
                        size: 'large',
                        logo_alignment: 'center',
                        width: '400'
                    }
                )
            }
        }

        const loadScript = async () => {
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            document.head.appendChild(script)

            script.onload = () => {
                initializeGoogleAccounts()
            }
        }

        loadScript()
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h3 className={styles.containerHeaderTitle}>Entrar</h3>
                    <p className={styles.containerHeaderDescription}>Bem vindo de volta! Preencha os campos com os dados que você utilizou durante o cadastro</p>
                </div>
                <div className={styles.containerBody}>
                    {hasGeneralError && 
                        <div className={styles.containerError}>
                            <div className={styles.containerErrorHeader}>
                                <PiSealWarning className={styles.containerErrorHeaderIcon} />
                            </div>
                            <div className={styles.containerErrorBody}>
                                <h3 className={styles.containerErrorBodyTitle}>Ocorreu um problema</h3>
                                <span className={styles.containerErrorBodyText}>Ocorreu um erro ao fazer a solicitação, tente novamente mais tarde.</span>
                            </div>
                        </div>
                    }
                    <div className={styles.containerBodySocialAccounts}>
                        <div ref={element => oAuthButtonsRef.current['google'] = element} style={{minWidth: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center'}}></div>
                        {/* <div className={styles.containerBodySocialAccountsButton}>
                            <svg className={styles.containerBodySocialAccountsButtonIcon} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span className={styles.containerBodySocialAccountsButtonText}>Sign in with Google</span>
                        </div>   */}
                        <div className={styles.containerBodySocialAccountsButton}>
                            <svg className={styles.containerBodySocialAccountsButtonIcon} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                                <path d="M32.5 44c-1.778 0-3.001-.577-4.08-1.086C27.38 42.424 26.481 42 25 42s-2.38.424-3.42.914C20.501 43.423 19.278 44 17.5 44 13.174 44 6 34.071 6 23.5 6 16.49 10.832 11 17 11c2.027 0 3.259.581 4.346 1.093C22.378 12.58 23.27 13 25 13s2.622-.42 3.654-.907C29.741 11.581 30.973 11 33 11c2.664 0 5.033.982 7.042 2.921.338.326.504.793.447 1.26s-.329.88-.735 1.116C37.438 17.644 36 20.499 36 23.75c0 3.661 2.004 6.809 4.986 7.831.391.134.709.423.879.799.171.375.18.805.023 1.188C39.461 39.515 35.424 44 32.5 44zM25.5 10c-.358 0-.708-.128-.984-.368-.363-.316-.554-.788-.51-1.269.012-.123.303-3.045 2.593-5.382l0 0c2.154-2.2 4.251-2.854 4.482-2.922.489-.142 1.017-.026 1.401.308.385.333.574.839.503 1.344-.034.241-.389 2.436-2.232 4.899-1.973 2.636-4.791 3.322-4.91 3.35C25.729 9.987 25.614 10 25.5 10z"></path>
                            </svg>
                            <span className={styles.containerBodySocialAccountsButtonText}>Sign in with Apple</span>
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
                            <a href="/accounts/password/reset">Esqueceu sua senha?</a>
                        </div>
                        <div className={styles.containerBodyFormInputContainer}>
                            <BtnB01 autoWidth className={styles.containerBodyFormInputContainerRememberSubmit}>{isLoading ? <SprintLoader /> : 'Login'}</BtnB01>
                        </div>
                    </form>
                </div>
                <div className={styles.containerFooter}>
                    <span>Não tem uma conta?</span>
                    <a href="/accounts/sign-up">Cadastre-se</a>
                </div>
            </div>
            <Helmet>
                {/* <script src="https://accounts.google.com/gsi/client" async defer></script> */}
                <script src={`https://www.google.com/recaptcha/api.js?render=${reCaptchaToken}`}></script>
            </Helmet>
        </div>
    )
}

export default LoginForm