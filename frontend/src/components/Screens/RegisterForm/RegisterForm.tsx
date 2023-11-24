import React, { FormEvent, useState, useRef, MutableRefObject, useEffect } from 'react'
import styles from './RegisterForm.module.css'
import { PiEnvelope, PiKeyBold, PiEyeBold, PiEyeSlashBold, PiSealWarning, PiUserBold, PiCheck } from "react-icons/pi";
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01';
import SimpleCheckBox from '../../UI/Checkboxes/SimpleCheckBox/SimpleCheckBox';
import { axios } from '../../../services/api';
import SprintLoader from '../../UI/Loaders/SprintLoader/SprintLoader';
import * as originalAxios from 'axios';
import { useGoogleOAuth } from '../../../hooks/useGoogleOAuth';
import { useReCaptchaToken } from '../../../hooks/useReCaptchaToken';

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
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<{title: string, text: string, isError: boolean} | null>(null)
    const [created, setCreated] = useState<boolean>(false)
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const inputsRef: MutableRefObject<{ 
        firstName: HTMLInputElement | null, 
        lastName: HTMLInputElement | null, 
        email: HTMLInputElement | null, 
        password: HTMLInputElement | null, 
        confirmPassword: HTMLInputElement | null
    }> = useRef({firstName: null, lastName: null, email: null, password: null, confirmPassword: null})

    const oAuthButtonsRef: MutableRefObject<{google: HTMLDivElement | null, apple: HTMLDivElement | null}> = useRef({google: null, apple: null})
    
    const { initializeGoogleAccounts } = useGoogleOAuth({
        oAuthButtonsRef: oAuthButtonsRef,
        setMessage: setMessage
    })

    const { getCaptchaToken, initializeRecaptchaScript } = useReCaptchaToken()
    
    // checks if name has a valid format
    const NameRegex = /^[a-zA-Z\s]+$/;

    // checks if email has a valid format
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

    // checks if there is at least one uppercase letter, lowercase letter, number and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/;

    const post_data = async (CaptchaToken: string) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/accounts/sign-up/', {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                terms: acceptTerms,
                "g-recaptcha-response": CaptchaToken
            })
            if(response.status === 201){
                setMessage({
                    title: 'Conta criada',
                    text: 'Olá, sua conta foi criada com sucesso!',
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
                    inputsRef.current.firstName?.focus()
                }else if(error.response?.status === 400 && error.response.data.cod === 6){
                    setLastNameIsValid(false)
                    inputsRef.current.lastName?.focus()
                }else if(error.response?.status === 400 && error.response.data.cod === 7){
                    setEmailIsValid(false)
                    inputsRef.current.email?.focus()
                }else if(error.response?.status === 400 && error.response.data.cod === 8){
                    setPasswordIsValid(false)
                    inputsRef.current.password?.focus()
                }else if(error.response?.status === 400 && error.response.data.cod === 9){
                    setEmailIsValid(false)
                    inputsRef.current.email?.focus()
                    setMessage({
                        title: 'E-mail ja utilizado',
                        text: 'Já existe uma conta vinculada ao endereço de e-mail informado.',
                        isError: true
                    })
                }else if(error.response?.status === 400 && error.response.data.cod === 10){
                    setMessage({
                        title: 'Termos de uso',
                        text: 'Para prosseguir com a criação da conta é necessario aceitar os termos.',
                        isError: true
                    })
                    setAcceptTerms(false)
                }else if(error.response?.status === 400 && error.response.data.cod === 11){
                    setMessage({
                        title: 'ReCaptcha Inválido',
                        text: 'O recaptcha token informado é inválido.',
                        isError: true
                    })
                }else{
                    setMessage({
                        title: 'Ocorreu um erro',
                        text: 'Ocorreu um erro ao fazer a solicitação, tente novamente mais tarde.',
                        isError: true
                    })
                }
            }
        }
        setIsLoading(false)
    }

    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(NameRegex.test(value)){
            setFirstNameIsValid(true)
        }else{
            setFirstNameIsValid(false)
        }
        setFirstName(value)
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(NameRegex.test(value)){
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
                            inputsRef.current.confirmPassword?.focus()
                        }
                    }else{
                        inputsRef.current.password?.focus()
                    }
                }else{
                    inputsRef.current.email?.focus()
                }
            }else{
                inputsRef.current.lastName?.focus()
            }
        }else{
            inputsRef.current.firstName?.focus()
        }
    }

    useEffect(() => {
        initializeGoogleAccounts()
        initializeRecaptchaScript()
    }, [initializeGoogleAccounts, initializeRecaptchaScript])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h3 className={styles.containerHeaderTitle}>Criar uma conta</h3>
                    <p className={styles.containerHeaderDescription}>Seja bem vindo(a)! Preencha os campos abaixo para fazer o cadastro</p>
                </div>
                <div className={`${styles.containerBody} ${isLoading ? styles.loading : null}`}>
                    {message && 
                        <div className={styles.containerError} style={{ borderColor: message.isError ? 'red' : 'green' }}>
                            <div className={styles.containerErrorHeader}>
                                {message.isError ? 
                                    <PiSealWarning className={`${styles.containerErrorHeaderIcon} ${styles.messageFailure}`} /> : 
                                    <PiCheck className={`${styles.containerErrorHeaderIcon} ${styles.messageSuccess}`} />
                                }
                            </div>
                            <div className={styles.containerErrorBody}>
                                <h3 className={`${styles.containerErrorBodyTitle} ${message.isError ? styles.messageFailure : styles.messageSuccess}`}>{message.title}</h3>
                                <span className={styles.containerErrorBodyText}>{message.text}</span>
                            </div>
                        </div>
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
                                <div className={styles.containerBodyFormInputContainer}>
                                    <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                        <PiUserBold className={styles.containerBodyFormInputContainerIconIcon} />
                                    </div>
                                    <span className={styles.containerBodyFormInputContainerLabel}>Nome</span>
                                    <input 
                                        ref={element => inputsRef.current['firstName'] = element}
                                        className={`${styles.containerBodyFormInputContainerInput} ${!firstNameIsValid && !isFirstRender ? styles.containerBodyFormInputContainerInputError : null}`} 
                                        type="text" 
                                        name="first_name" 
                                        id="first_name" 
                                        placeholder='Digite seu nome'
                                        required
                                        value={firstName}
                                        minLength={1}
                                        disabled={isLoading ? true : false}
                                        onChange={handleFirstName}
                                    />
                                </div>
                                <div className={styles.containerBodyFormInputContainer}>
                                    <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                        <PiUserBold className={styles.containerBodyFormInputContainerIconIcon} />
                                    </div>
                                    <span className={styles.containerBodyFormInputContainerLabel}>Sobrenome</span>
                                    <input 
                                        ref={element => inputsRef.current['lastName'] = element}
                                        className={`${styles.containerBodyFormInputContainerInput} ${!lastNameIsValid && !isFirstRender ? styles.containerBodyFormInputContainerInputError : null}`} 
                                        type="text" 
                                        name="last_name" 
                                        id="last_name" 
                                        placeholder='Digite seu sobrenome'
                                        required
                                        minLength={1}
                                        value={lastName}
                                        disabled={isLoading ? true : false}
                                        onChange={handleLastName}
                                    />
                                </div>
                                <div className={styles.containerBodyFormInputContainer}>
                                    <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                        <PiEnvelope className={styles.containerBodyFormInputContainerIconIcon} />
                                    </div>
                                    <span className={styles.containerBodyFormInputContainerLabel}>E-mail</span>
                                    <input 
                                        ref={element => inputsRef.current['email'] = element}
                                        className={`${styles.containerBodyFormInputContainerInput} ${!emailIsValid && !isFirstRender ? styles.containerBodyFormInputContainerInputError : null}`} 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        placeholder='Digite seu e-mail'
                                        required
                                        minLength={1}
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
                                        ref={element => inputsRef.current['password'] = element}
                                        className={`${styles.containerBodyFormInputContainerInput} ${!passwordIsValid && !isFirstRender ? styles.containerBodyFormInputContainerInputError : null}`} 
                                        type={showPassword ? 'text' : 'password'} 
                                        name="password" 
                                        id="password" 
                                        placeholder='**********'
                                        minLength={8}
                                        value={password}
                                        required
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
                                    <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                                        <PiKeyBold className={styles.containerBodyFormInputContainerIconIcon} />
                                    </div>
                                    <span className={styles.containerBodyFormInputContainerLabel}>Confirmar senha</span>
                                    <input 
                                        ref={element => inputsRef.current['confirmPassword'] = element}
                                        className={`${styles.containerBodyFormInputContainerInput} ${!confirmPasswordIsValid && !isFirstRender ? styles.containerBodyFormInputContainerInputError : null}`} 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        name="confirm_password" 
                                        id="confirm_password" 
                                        placeholder='**********'
                                        minLength={8}
                                        value={confirmPassword}
                                        required
                                        disabled={isLoading ? true : false}
                                        onChange={handleConfirmPassword}
                                    />
                                    <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconRight}`}>
                                        {showConfirmPassword ? (
                                            <PiEyeSlashBold 
                                                className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                                                onClick={() => setShowConfirmPassword(oldValue => !oldValue)}
                                            />
                                        ) : (
                                            <PiEyeBold 
                                            className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                                            onClick={() => setShowConfirmPassword(oldValue => !oldValue)}
                                            />
                                        )}
                                    </div>
                                </div>
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
                                        className={styles.containerBodyFormInputContainerRememberSubmit} 
                                        disabled={isLoading ? true : false}>
                                        {isLoading ? <SprintLoader /> : 'Cadastrar'}
                                    </BtnB01>
                                </div>
                            </form>
                        </>
                    }
                </div>
                <div className={`${styles.containerFooter} ${isLoading ? styles.loading : null}`}>
                    <span>Já tem uma conta?</span>
                    <a href="/accounts/sign-in">Entrar</a>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm