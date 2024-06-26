import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './ProfilePage.module.css'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { onlyUpperCaseLowerCaseAndSpaceLettersRegex, emailRegex, onlyNumbersRegex, everythingExceptNumbersRegex } from '../../constants/regexPatterns'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'
import { useCpfValidator } from '../../hooks/useCpfValidator'
import * as originalAxios from 'axios'
import { UserProfileType } from '../../types/UserType'
import { UserContext } from '../../contexts/UserContext'
import { MessageErrorType } from '../../types/ErrorType'
import SimpleErrorResponseMessage from '../../components/UI/ResponseMessages/SimpleErrorResponseMessage/SimpleErrorResponseMessage'
import { RECAPTCHA_ERROR, REQUEST_ERROR } from '../../constants/errorMessages'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import LabelInput from '../../components/UI/Inputs/LabelInput/LabelInput'

type Props = {}

type InputsType = {
    firstName: HTMLInputElement | null
    lastName: HTMLInputElement | null
    email: HTMLInputElement | null
    cpf: HTMLInputElement | null
}

const ProfilePage = (props: Props) => {
    const [firstName, setFirstName] = useState<string>('')
    const [firstNameIsValid, setFirstNameIsValid] = useState<boolean>(false)

    const [lastName, setLastName] = useState<string>('')
    const [lastNameIsValid, setLastNameIsValid] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(false)

    const [cpf, setCpf] = useState<string>('')
    const [cpfIsValid, setCpfIsValid] = useState<boolean>(false)

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const { updateTitle } = usePageTitleChanger()

    const axiosPrivate = useAxiosPrivate()

    const { getCaptchaToken, initializeRecaptchaScript } = useReCaptchaToken()

    const { validate_cpf_algorithm } = useCpfValidator()

    const { user, setUser } = useContext(UserContext)

    const [message, setMessage] = useState<MessageErrorType | null>(null)

    const [localIsLoading, setLocalIsLoading] = useState<boolean>(false)

    const inputsRef = useRef<InputsType>({
        firstName: null,
        lastName: null,
        email: null,
        cpf: null
    })

    const save_data = async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setLocalIsLoading(true)
        try {
            const response = await axiosPrivate.patch('/accounts/profile/update', {
                first_name: firstName,
                last_name: lastName,
                cpf: cpf.replaceAll(everythingExceptNumbersRegex, ''),
                "g-recaptcha-response": RecaptchaToken
            })
            if(response?.status === 200){
                const data: UserProfileType = response.data
                setUser(data)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error.response?.data.cod === 36){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 37){
                    setFirstNameIsValid(false)
                    inputsRef.current.firstName?.focus()
                }else if(error.response?.data.cod === 38){
                    setLastNameIsValid(false)
                    inputsRef.current.lastName?.focus()
                }else if(error.response?.data.cod === 39 || error.response?.data.cod === 40){
                    setCpfIsValid(false)
                    inputsRef.current.cpf?.focus()
                }else{
                    setMessage({
                        title: REQUEST_ERROR.title,
                        text: REQUEST_ERROR.text,
                        isError: true
                    })
                }
            }
        }
        setLocalIsLoading(false)
    }

    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNameRegex = new RegExp(onlyUpperCaseLowerCaseAndSpaceLettersRegex)
        const value = e.target.value
        if(newNameRegex.test(value) && value.length > 3 && value.length <= 50){
            setFirstNameIsValid(true)
        }else{
            setFirstNameIsValid(false)
        }
        setFirstName(value.length > 50 ? value.slice(0, 50) : value)
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNameRegex = new RegExp(onlyUpperCaseLowerCaseAndSpaceLettersRegex)
        const value = e.target.value
        if(newNameRegex.test(value)){
            setLastNameIsValid(true)
        }else{
            setLastNameIsValid(false)
        }
        setLastName(value.length > 50 ? value.slice(0, 50) : value)
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmailRegex = new RegExp(emailRegex)
        const value = e.target.value
        if(newEmailRegex.test(value) && value.length > 3 && value.length <= 255){
            setEmailIsValid(true)
        }else{
            setEmailIsValid(false)
        }
        setEmail(value.length > 255 ? value.slice(0, 255) : value)
    }

    const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOnlyNumbersRegex = new RegExp(onlyNumbersRegex)
        const value = e.target.value.replaceAll(/\D/g, "")
        if(newOnlyNumbersRegex.test(value)){
            if(value.length >= 11){
                setCpf(value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))
                if(validate_cpf_algorithm(value.slice(0, 11))){
                    setCpfIsValid(true)
                    inputsRef.current.cpf?.blur()
                }else{
                    setCpfIsValid(false)
                }
            }else{
                setCpf(value)
            }
        }else{
            setCpf('')
            setCpfIsValid(false)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsFirstRender(false)
        if(firstNameIsValid){
            if(lastNameIsValid){
                if(emailIsValid){
                    if(cpfIsValid){
                        getCaptchaToken(save_data)
                    }else{
                        inputsRef.current.cpf?.focus()
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
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Profile`)
    }, [updateTitle])

    useEffect(() => {
        initializeRecaptchaScript()
    }, [initializeRecaptchaScript])

    useEffect(() => {
        if(user){
            setFirstName(() => {
                if(user.first_name){
                    setFirstNameIsValid(true)
                    return user.first_name
                }
                return ''
            })
            setLastName(() => {
                if(user.last_name){
                    setLastNameIsValid(true)
                    return user.last_name
                }
                return ''
            })
            setEmail(() => {
                if(user.email){
                    setEmailIsValid(true)
                    return user.email
                }
                return ''
            })
            setCpf(() => {
                if(user.id_number){
                    setCpfIsValid(true)
                    return user.id_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                }
                return ''
            })
        }
    }, [user, setFirstName, setLastName, setEmail, setCpf, setFirstNameIsValid, setLastNameIsValid, setEmailIsValid, setCpfIsValid])

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Seu perfil' text='Informações relacionadas a você, informações pessoais.'>
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        {message &&
                            <SimpleErrorResponseMessage title={message.title} text={message.text} isError={message.isError} />
                        }
                        <form className={styles.bodyForm} onSubmit={handleSubmit}>
                            <LabelInput 
                                invalid={(!firstNameIsValid && !isFirstRender) ? true : false}
                                ref={element => inputsRef.current['firstName'] = element}
                                type="text" 
                                name="first_name" 
                                id="first_name"
                                minLength={3}
                                maxLength={50}
                                onChange={handleFirstName}
                                value={firstName}
                                labelText='Primeiro nome'
                                disabled={localIsLoading}
                            />
                            <LabelInput 
                                invalid={(!lastNameIsValid && !isFirstRender) ? true : false}
                                ref={element => inputsRef.current['lastName'] = element}
                                type="text" 
                                name="last_name" 
                                id="last_name"
                                minLength={3}
                                maxLength={50}
                                onChange={handleLastName}
                                value={lastName}
                                labelText='Sobrenome'
                                disabled={localIsLoading}
                            />
                            <LabelInput 
                                invalid={(!emailIsValid && !isFirstRender) ? true : false}
                                ref={element => inputsRef.current['email'] = element}
                                type="email" 
                                name="email" 
                                id="email"
                                minLength={3}
                                maxLength={255}
                                disabled
                                onChange={handleEmail}
                                value={email}
                                labelText='E-mail'
                            />
                            <LabelInput 
                                invalid={(!cpfIsValid && !isFirstRender) ? true : false}
                                ref={element => inputsRef.current['cpf'] = element}
                                type="text" 
                                name="cpf" 
                                id="cpf"
                                placeholder='000.000.000-00'
                                minLength={14}
                                maxLength={14}
                                disabled={user.id_number ? true : false}
                                onChange={handleCpf}
                                value={cpf}
                                labelText='CPF'
                            />
                            <BtnB01 autoWidth isLoading={localIsLoading} disabled={localIsLoading}>Salvar</BtnB01>
                        </form>
                    </div>
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default ProfilePage