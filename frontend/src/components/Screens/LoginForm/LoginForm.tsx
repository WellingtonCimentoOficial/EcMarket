import React, { FormEvent, useState, useRef, MutableRefObject, useContext, useEffect } from 'react'
import styles from './LoginForm.module.css'
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
import StandardInput from '../../UI/Inputs/PasswordInput/StandardInput';

const LoginForm = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(true)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<MessageErrorType | null>(null)

    const oAuthButtonsRef: MutableRefObject<{google: HTMLDivElement | null, apple: HTMLDivElement | null}> = useRef({google: null, apple: null})

    const [inputsFocus, setInputsFocus] = useState<{id: string, value: boolean}[]>([
        {id: 'email', value: false},
        {id: 'password', value: false}
    ])
    
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

    const handleInputFocus = (id: string) => {
        setInputsFocus(prevValues => {
            const updatedValues = prevValues.map(input => {
                if(input.id === id){
                    return {...input, value: true}
                }
                return {...input, value: false}
            })
            return updatedValues
        })
    }

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
                    handleInputFocus("email")
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
                handleInputFocus("password")
            }
        }else{
            handleInputFocus("email")
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
                        <StandardInput 
                            label='E-mail'
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder='Digite seu e-mail'
                            required
                            value={email}
                            disabled={isLoading}
                            isValid={emailIsValid}
                            focus={inputsFocus.find(input => input.id === "email")?.value}
                            onChange={handleEmail}
                        />
                        <StandardInput 
                            type='password'
                            label='Password'
                            isValid={passwordIsValid}
                            name='password'
                            id='password'
                            placeholder='**********'
                            minLength={8}
                            value={password}
                            disabled={isLoading}
                            focus={inputsFocus.find(input => input.id === "password")?.value}
                            onChange={handlePassword}
                        />
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