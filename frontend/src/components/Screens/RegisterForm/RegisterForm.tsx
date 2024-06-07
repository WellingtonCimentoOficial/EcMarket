import React, { FormEvent, useState, useRef, MutableRefObject, useEffect } from 'react'
import styles from './RegisterForm.module.css'
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01';
import SimpleCheckBox from '../../UI/Checkboxes/SimpleCheckBox/SimpleCheckBox';
import { axios } from '../../../services/api';
import * as originalAxios from 'axios';
import { useGoogleOAuth } from '../../../hooks/useGoogleOAuth';
import { useReCaptchaToken } from '../../../hooks/useReCaptchaToken';
import { onlyUpperCaseLowerCaseAndSpaceLettersRegex, emailRegex, passwordRegex } from '../../../constants/regexPatterns';
import { MessageErrorType } from '../../../types/ErrorType';
import SimpleErrorResponseMessage from '../../UI/ResponseMessages/SimpleErrorResponseMessage/SimpleErrorResponseMessage';
import { ACCOUNT_CREATED_SUCCESS } from '../../../constants/successMessages';
import { EMAIL_ALREADY_USED_ERROR, RECAPTCHA_ERROR, REQUEST_ERROR, TERMS_NOT_ACCEPTED_ERROR } from '../../../constants/errorMessages';
import StandardInput from '../../UI/Inputs/PasswordInput/StandardInput';
import { SIGN_IN_PATH } from '../../../routes';

const RegisterForm = () => {
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [firstNameIsValid, setFirstNameIsValid] = useState<boolean>(false)
    const [lastNameIsValid, setLastNameIsValid] = useState<boolean>(false)
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<MessageErrorType | null>(null)
    const [created, setCreated] = useState<boolean>(false)
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const [inputsFocus, setInputsFocus] = useState<{id: string, value: boolean}[]>([
        {id: 'firstName', value: false},
        {id: 'lastName', value: false},
        {id: 'email', value: false},
        {id: 'password', value: false},
        {id: 'confirmPassword', value: false},
    ])

    const oAuthButtonsRef: MutableRefObject<{google: HTMLDivElement | null, apple: HTMLDivElement | null}> = useRef({google: null, apple: null})
    
    const { initializeGoogleAccounts } = useGoogleOAuth({
        oAuthButtonsRef: oAuthButtonsRef,
        setMessage: setMessage,
        config: {
            type: 'standard',
            size: 'large',
            logo_alignment: 'center',
            width: '400',
            text: 'signup_with'
        }
    })

    const { getCaptchaToken } = useReCaptchaToken()

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
            const response = await axios.post('/accounts/sign-up/', {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                terms: acceptTerms,
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 201){
                setMessage({
                    title: ACCOUNT_CREATED_SUCCESS.title,
                    text: ACCOUNT_CREATED_SUCCESS.text,
                    isError: false
                })
                setFirstName('')
                setLastName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setAcceptTerms(false)
                setCreated(true)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.status === 400 && error.response.data.cod === 5){
                    setFirstNameIsValid(false)
                    handleInputFocus("firstName")
                }else if(error.response?.status === 400 && error.response.data.cod === 6){
                    setLastNameIsValid(false)
                    handleInputFocus("lastName")
                }else if(error.response?.status === 400 && error.response.data.cod === 7){
                    setEmailIsValid(false)
                    handleInputFocus("email")
                }else if(error.response?.status === 400 && error.response.data.cod === 8){
                    setPasswordIsValid(false)
                    handleInputFocus("password")
                }else if(error.response?.status === 400 && error.response.data.cod === 9){
                    setEmailIsValid(false)
                    handleInputFocus("email")
                    setMessage({
                        title: EMAIL_ALREADY_USED_ERROR.title,
                        text: EMAIL_ALREADY_USED_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.status === 400 && error.response.data.cod === 10){
                    setMessage({
                        title: TERMS_NOT_ACCEPTED_ERROR.title,
                        text: TERMS_NOT_ACCEPTED_ERROR.text,
                        isError: true
                    })
                    setAcceptTerms(false)
                }else if(error.response?.status === 400 && error.response.data.cod === 11){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
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


    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(onlyUpperCaseLowerCaseAndSpaceLettersRegex.test(value)){
            setFirstNameIsValid(true)
        }else{
            setFirstNameIsValid(false)
        }
        setFirstName(value)
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(onlyUpperCaseLowerCaseAndSpaceLettersRegex.test(value)){
            setLastNameIsValid(true)
        }else{
            setLastNameIsValid(false)
        }
        setLastName(value)
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

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(password === value){
            setConfirmPasswordIsValid(true)
        }else{
            setConfirmPasswordIsValid(false)
        }
        setConfirmPassword(value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsFirstRender(false)
        if(firstNameIsValid){
            if(lastNameIsValid){
                if(email.length > 0 && emailIsValid){
                    if(password.length > 0 && passwordIsValid){
                        if(confirmPasswordIsValid) {
                            if(acceptTerms){
                                setIsLoading(true)
                                getCaptchaToken(post_data)
                            }else{
                                // setMessage({
                                //     title: 'Formulario incompleto',
                                //     text: 'Para criar sua conta, você precisa aceitar os termos.',
                                //     isError: true
                                // })
                                setAcceptTerms(false)
                            }
                        }else{
                            setConfirmPasswordIsValid(false)
                            handleInputFocus("confirmPassword")
                        }
                    }else{
                        handleInputFocus("password")
                    }
                }else{
                    handleInputFocus("email")
                }
            }else{
                handleInputFocus("lastName")
            }
        }else{
            handleInputFocus("firstName")
        }
    }

    useEffect(() => {
        initializeGoogleAccounts()
    }, [initializeGoogleAccounts])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h3 className={styles.containerHeaderTitle}>Criar uma conta</h3>
                    <p className={styles.containerHeaderDescription}>Seja bem vindo(a)! Preencha os campos abaixo para fazer o cadastro</p>
                </div>
                <div className={`${styles.containerBody} ${isLoading ? styles.loading : null}`}>
                    {message && 
                        <SimpleErrorResponseMessage title={message.title} text={message.text} isError={message.isError} />
                    }
                    {!created && 
                        <>
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
                                    label='Nome'
                                    type="username" 
                                    name="first_name" 
                                    id="first_name" 
                                    placeholder='Digite seu nome'
                                    required
                                    minLength={1}
                                    value={firstName}
                                    disabled={isLoading}
                                    isValid={!firstNameIsValid && !isFirstRender ? false : true}
                                    focus={inputsFocus.find(input => input.id === "firstName")?.value}
                                    onChange={handleFirstName}
                                />
                                <StandardInput 
                                    label='Sobrenome'
                                    type="username" 
                                    name="last_name" 
                                    id="last_name" 
                                    placeholder='Digite seu sobrenome'
                                    required
                                    minLength={1}
                                    value={lastName}
                                    disabled={isLoading}
                                    isValid={!lastNameIsValid && !isFirstRender ? false : true}
                                    focus={inputsFocus.find(input => input.id === "lastName")?.value}
                                    onChange={handleLastName}
                                />
                                <StandardInput 
                                    label='E-mail'
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder='Digite seu e-mail'
                                    required
                                    minLength={1}
                                    value={email}
                                    disabled={isLoading}
                                    isValid={!emailIsValid && !isFirstRender ? false : true}
                                    focus={inputsFocus.find(input => input.id === "email")?.value}
                                    onChange={handleEmail}
                                />
                                <StandardInput 
                                    type='password'
                                    label='Password'
                                    name="password" 
                                    id="password" 
                                    placeholder='**********'
                                    minLength={8}
                                    value={password}
                                    required
                                    disabled={isLoading}
                                    isValid={!passwordIsValid && !isFirstRender ? false : true}
                                    focus={inputsFocus.find(input => input.id === "password")?.value}
                                    onChange={handlePassword}
                                />
                                <StandardInput 
                                    type='password'
                                    label='Confirm password'
                                    name="confirm_password" 
                                    id="confirm_password" 
                                    placeholder='**********'
                                    minLength={8}
                                    value={confirmPassword}
                                    required
                                    disabled={isLoading}
                                    isValid={!confirmPasswordIsValid && !isFirstRender ? false : true}
                                    focus={inputsFocus.find(input => input.id === "confirmPassword")?.value}
                                    onChange={handleConfirmPassword}
                                />
                                <div className={styles.containerBodyFormInputContainer}>
                                    <div className={styles.containerBodyFormInputContainerRemember}>
                                        <SimpleCheckBox 
                                            className={`${styles.containerBodyFormInputContainerRememberInput} ${!acceptTerms && !isFirstRender ? styles.InvalidAcceptTerms : null}`} 
                                            name='terms' 
                                            id='terms' 
                                            value={acceptTerms}
                                            onChange={setAcceptTerms} 
                                        />
                                        <span>Aceito todos os <a href="/">termos de uso</a> e <a href="/">privacidade</a> de dados.</span>
                                    </div>
                                </div>
                                <div className={styles.containerBodyFormInputContainer}>
                                    <BtnB01 
                                        autoWidth 
                                        disabled={isLoading ? true : false}
                                        isLoading={isLoading}>
                                            Cadastrar
                                    </BtnB01>
                                </div>
                            </form>
                        </>
                    }
                </div>
                <div className={`${styles.containerFooter} ${isLoading ? styles.loading : null}`}>
                    <span>Já tem uma conta?</span>
                    <a href={SIGN_IN_PATH}>Entrar</a>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm