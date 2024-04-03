import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './CodeConfirmationForm.module.css'
import { PiEnvelope } from "react-icons/pi";
import * as originalAxios from 'axios';
import { axios } from '../../../services/api';
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01';
import { useReCaptchaToken } from '../../../hooks/useReCaptchaToken';
import { emailRegex, passwordRegex } from '../../../constants/regexPatterns';
import { MessageErrorType } from '../../../types/ErrorType';
import SimpleError from '../../UI/Errors/SimpleError/SimpleError';
import { EXPIRED_CODE_ERROR, INVALID_THIRD_PARTY_AUTHENTICATION_ERROR, INVALID_CODE_ERROR, INVALID_CODE_FORMAT_ERROR, INVALID_EMAIL_ERROR, INVALID_PASSWORD_ERROR, NEW_PASSWORD_SAME_AS_CURRENT_ERROR, RECAPTCHA_ERROR, REQUEST_ERROR } from '../../../constants/errorMessages';
import { PASSWORD_CHANGED_SUCCESS } from '../../../constants/successMessages';
import StandardInput from '../../UI/Inputs/PasswordInput/StandardInput';

type Props = {}

const CodeConfirmationForm = (props: Props) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<MessageErrorType | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
    const [stage, setStage] = useState<number>(1)
    const [code, setCode] = useState<{
        first: number | null, 
        second: number | null, 
        third: number | null, 
        fourth: number | null, 
        fifth: number | null
    }>({first: null, second: null, third: null, fourth: null, fifth: null})

    const inputsRef: React.MutableRefObject<{ 
        firstCode: HTMLInputElement | null, 
        secondCode: HTMLInputElement | null,
        thirdCode: HTMLInputElement | null,
        fourthCode: HTMLInputElement | null,
        fifthCode: HTMLInputElement | null,
    }> = useRef({
        firstCode: null, 
        secondCode: null,
        thirdCode: null,
        fourthCode: null,
        fifthCode: null, 
    })
    const [leftTime, setLeftTime] = useState('00:00')
    const [codeExp, setCodeExp] = useState<string>('')
    const [inputsFocus, setInputsFocus] = useState<{id: string, value: boolean}[]>([
        {id: 'firstCode', value: false},
        {id: 'secondCode', value: false},
        {id: 'thirdCode', value: false},
        {id: 'fourthCode', value: false},
        {id: 'fifthCode', value: false},
        {id: 'email', value: false},
        {id: 'password', value: false},
        {id: 'confirmPassword', value: false},
    ])

    const { getCaptchaToken } = useReCaptchaToken()
    
    const send_reset_password_code = async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/accounts/reset/password/code', {
                email: email,
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 200){
                setCodeExp(response.data.exp)
                setStage(2)
                setMessage(null)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error?.response?.data.cod === 17){
                    setIsFirstRender(false)
                    setEmailIsValid(false)
                    setMessage({
                        title: INVALID_EMAIL_ERROR.title,
                        text: INVALID_EMAIL_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 23){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
                }else if(error?.response?.data.cod === 26){
                    setMessage({
                        title: INVALID_THIRD_PARTY_AUTHENTICATION_ERROR.title,
                        text: INVALID_THIRD_PARTY_AUTHENTICATION_ERROR.text,
                        isError: true
                    })
                }else{
                    setMessage({
                        title: REQUEST_ERROR.title,
                        text: REQUEST_ERROR.text,
                        isError: true
                    })
                    setEmailIsValid(false)
                }
            }
        }
        setIsLoading(false)
    }

    const confirm_reset_password_code = async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/accounts/reset/password/code/confirm', {
                email,
                code: Object.values(code).join().replaceAll(',', ''),
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 200){
                setStage(3)
                setMessage(null)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 18){
                    setCode(prev => {
                        return {
                            ...prev,
                            first: null,
                            second: null,
                            third: null,
                            fourth: null,
                            fifth: null
                        }
                    })
                    setMessage({
                        title: EXPIRED_CODE_ERROR.title,
                        text: EXPIRED_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 19){
                    setIsFirstRender(false)
                    setCode(prev => {
                        return {
                            ...prev,
                            first: null,
                            second: null,
                            third: null,
                            fourth: null,
                            fifth: null
                        }
                    })
                    setMessage({
                        title: INVALID_CODE_ERROR.title,
                        text: INVALID_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 20){
                    setMessage({
                        title: INVALID_EMAIL_ERROR.title,
                        text: INVALID_EMAIL_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 21){
                    setMessage({
                        title: INVALID_CODE_ERROR.title,
                        text: INVALID_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 22){
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

    const reset_password = async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/accounts/reset/password', {
                email,
                code: Object.values(code).join().replaceAll(',', ''),
                password,
                "g-recaptcha-response": RecaptchaToken
            })
            if(response.status === 200){
                setMessage({
                    title: PASSWORD_CHANGED_SUCCESS.title,
                    text: PASSWORD_CHANGED_SUCCESS.text,
                    isError: false
                })
                setSuccess(true)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 32){
                    setMessage({
                        title: INVALID_CODE_FORMAT_ERROR.title,
                        text: INVALID_CODE_FORMAT_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 28){
                    setMessage({
                        title: INVALID_PASSWORD_ERROR.title,
                        text: INVALID_PASSWORD_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 29){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 31){
                    setMessage({
                        title: INVALID_THIRD_PARTY_AUTHENTICATION_ERROR.title,
                        text: INVALID_THIRD_PARTY_AUTHENTICATION_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 33){
                    setMessage({
                        title: EXPIRED_CODE_ERROR.title,
                        text: EXPIRED_CODE_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 34){
                    setMessage({
                        title: NEW_PASSWORD_SAME_AS_CURRENT_ERROR.title,
                        text: NEW_PASSWORD_SAME_AS_CURRENT_ERROR.text,
                        isError: true
                    })
                    setIsFirstRender(false)
                    setPassword('')
                    setConfirmPassword('')
                    setPasswordIsValid(false)
                    setConfirmPasswordIsValid(false)
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

    const handleInputFocus = (id: string) => {
        if(id === "password" || id === "confirmPassword" || id === "email" ){
            setInputsFocus(prevValues => {
                const updatedValues = prevValues.map(input => {
                    if(input.id === id){
                        return {...input, value: true}
                    }
                    return {...input, value: false}
                })
                return updatedValues
            })
        }else if(id === "firstCode"){
            inputsRef.current.firstCode?.focus()
        }else if(id === "secondCode"){
            inputsRef.current.secondCode?.focus()
        }else if(id === "thirdCode"){
            inputsRef.current.thirdCode?.focus()
        }else if(id === "fourthCode"){
            inputsRef.current.fourthCode?.focus()
        }else if(id === "fifthCode"){
            inputsRef.current.fifthCode?.focus()
        }
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
            if(confirmPassword === value){
                setConfirmPasswordIsValid(true)
            }else{
                setConfirmPasswordIsValid(false)
            }
            setPasswordIsValid(true)
        }else{
            setPasswordIsValid(false)
        }
        setPassword(value)
    }

    const handleCode = (e: React.ChangeEvent<HTMLInputElement>, code: number) => {
        const value = parseInt(e.target.value.slice(0, 1))
        if(code === 1){
            setCode(prev => {
                return {...prev, first: !isNaN(value) ? value : prev.first}
            })
            !isNaN(value) && handleInputFocus("secondCode")
        }else if(code === 2){
            setCode(prev => {
                return {...prev, second: !isNaN(value) ? value : prev.second}
            })
            !isNaN(value) && handleInputFocus("thirdCode")
        }else if(code === 3){
            setCode(prev => {
                return {...prev, third: !isNaN(value) ? value : prev.third}
            })
            !isNaN(value) && handleInputFocus("fourthCode")
        }else if(code === 4){
            setCode(prev => {
                return {...prev, fourth: !isNaN(value) ? value : prev.fourth}
            })
            !isNaN(value) && handleInputFocus("fifthCode")
        }else if(code === 5){
            setCode(prev => {
                return {...prev, fifth: !isNaN(value) ? value : prev.fifth}
            })
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsFirstRender(stage === 1 ? false : true)

        if(email.length > 0 && emailIsValid){
            setIsFirstRender(stage === 2 ? false : true)
            stage === 1 && getCaptchaToken(send_reset_password_code)
            if(code.first !== null){
                if(code.second !== null){
                    if(code.third !== null){
                        if(code.fourth !== null){
                            if(code.fifth !== null){
                                setIsFirstRender(stage === 3 ? false : true)
                                stage === 2 && getCaptchaToken(confirm_reset_password_code)
                                if(password.length > 0 && passwordIsValid){
                                    if(confirmPasswordIsValid) {
                                        if(stage === 3){
                                            setIsLoading(true)
                                            getCaptchaToken(reset_password)
                                        }
                                    }else{
                                        setConfirmPasswordIsValid(false)
                                        handleInputFocus("confirmPassword")
                                    }
                                }else{
                                    handleInputFocus("password")
                                }
                            }else{
                                handleInputFocus("fifthCode")
                            }
                        }else{
                            handleInputFocus("fourthCode")
                        }
                    }else{
                        handleInputFocus("thirdCode")
                    }
                }else{
                    handleInputFocus("secondCode")
                }
            }else{
                handleInputFocus("firstCode")
            }

        }else{
            handleInputFocus("email")
        }
    }

    const stopWatch = useCallback(() => {
        const currentDate = new Date()
        const expirationDate = new Date(codeExp)
        const differenceInMilliseconds  = expirationDate.getTime() - currentDate.getTime()

        if(differenceInMilliseconds <= 0){
            setLeftTime('00:00')
        }else{
            const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
            const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);
    
            setLeftTime(`${minutes}:${seconds}`)
        }
    }, [codeExp])

    useEffect(() => {
        if(codeExp){
            const interval = setInterval(() => {
                stopWatch()
            }, 1000)
    
            return () => {
                clearInterval(interval)
            }
        }
    }, [codeExp, stopWatch])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={`${styles.containerBody} ${isLoading ? styles.loading : null}`}>
                    {message && 
                        <SimpleError title={message.title} text={message.text} isError={message.isError} />
                    }
                    {!success && 
                        <>
                            <form className={styles.containerBodyForm} onSubmit={handleSubmit}>
                                {stage === 1 &&
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
                                }
                                {stage === 2 &&
                                    <>
                                        <div className={styles.containerBodyFormCodeInputs}>
                                            <input 
                                                ref={element => inputsRef.current['firstCode'] = element}
                                                className={`${styles.containerBodyFormCodeInputsInput} ${code.first === null && !isFirstRender ? styles.containerBodyFormCodeInputsInputError : null}`} 
                                                type="number" 
                                                name="first_number" 
                                                id="first_number"
                                                minLength={1}
                                                maxLength={1} 
                                                value={code.first !== null ? code.first : ''}
                                                onChange={(e) => handleCode(e, 1)}
                                            />
                                            <input 
                                                ref={element => inputsRef.current['secondCode'] = element}
                                                className={`${styles.containerBodyFormCodeInputsInput} ${code.second === null && !isFirstRender ? styles.containerBodyFormCodeInputsInputError : null}`} 
                                                type="number" 
                                                name="second_number"
                                                id="second_number" 
                                                minLength={1}
                                                maxLength={1}
                                                value={code.second !== null ? code.second : ''}
                                                onChange={(e) => handleCode(e, 2)}
                                            />
                                            <input 
                                                ref={element => inputsRef.current['thirdCode'] = element}
                                                className={`${styles.containerBodyFormCodeInputsInput} ${code.third === null && !isFirstRender ? styles.containerBodyFormCodeInputsInputError : null}`} 
                                                type="number" 
                                                name="third_number" 
                                                id="third_number" 
                                                minLength={1}
                                                maxLength={1}
                                                value={code.third !== null ? code.third : ''}
                                                onChange={(e) => handleCode(e, 3)}
                                            />
                                            <input 
                                                ref={element => inputsRef.current['fourthCode'] = element}
                                                className={`${styles.containerBodyFormCodeInputsInput} ${code.fourth === null && !isFirstRender ? styles.containerBodyFormCodeInputsInputError : null}`} 
                                                type="number" 
                                                name="fourth_number"
                                                id="fourth_number" 
                                                minLength={1}
                                                maxLength={1}
                                                value={code.fourth !== null ? code.fourth : ''}
                                                onChange={(e) => handleCode(e, 4)}
                                            />
                                            <input 
                                                ref={element => inputsRef.current['fifthCode'] = element}
                                                className={`${styles.containerBodyFormCodeInputsInput} ${code.fifth === null && !isFirstRender ? styles.containerBodyFormCodeInputsInputError : null}`} 
                                                type="number" 
                                                name="fifth_number" 
                                                id="fifth_number" 
                                                minLength={1}
                                                maxLength={1}
                                                value={code.fifth !== null ? code.fifth : ''}
                                                onChange={(e) => handleCode(e, 5)}
                                            />
                                        </div>
                                        <span className={styles.containerHeaderDescription}>Código enviado para o email {email}</span>
                                        <span className={styles.containerHeaderDescription}>Restam apenas {leftTime} minutos</span>
                                    </>
                                }
                                {stage === 3 &&
                                    <>
                                        <StandardInput 
                                            type='password'
                                            isValid={!passwordIsValid && !isFirstRender ? false : true} 
                                            onChange={handlePassword}
                                            name='password'
                                            id='password'
                                            placeholder='**********'
                                            minLength={8}
                                            value={password}
                                            required
                                            disabled={isLoading}
                                            label='Password'
                                            focus={inputsFocus.find(input => input.id === "password")?.value}
                                        />
                                        <StandardInput 
                                            type='password'
                                            isValid={!confirmPasswordIsValid && !isFirstRender ? false : true} 
                                            onChange={handleConfirmPassword}
                                            name='confirm_password'
                                            id='confirm_password'
                                            placeholder='**********'
                                            minLength={8}
                                            value={confirmPassword}
                                            required
                                            disabled={isLoading}
                                            label='Confirm password'
                                            focus={inputsFocus.find(input => input.id === "confirmPassword")?.value}
                                        />
                                    </>
                                }
                                <div className={styles.containerBodyFormInputContainer}>
                                    <BtnB01 
                                        autoWidth 
                                        disabled={isLoading}
                                        isLoading={isLoading}>
                                        {stage === 3 ? 'Enviar' : 'Próximo'}
                                    </BtnB01>
                                </div>
                            </form>
                        </>
                    }
                </div>
                {stage === 2 &&
                    <div className={`${styles.containerFooter} ${isLoading ? styles.loading : null} ${leftTime !== '00:00' ? styles.loading : null}`}>
                        <span>Não recebeu o código?</span>
                        <span 
                            className={styles.containerFooterResend}
                            onClick={() => getCaptchaToken(send_reset_password_code)}
                        >
                            Reenviar
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

export default CodeConfirmationForm