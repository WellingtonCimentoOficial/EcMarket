import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './ProfilePage.module.css'
import UserMenu from '../../components/UI/Menus/UserMenu/UserMenu'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { NameRegex, emailRegex, onlyNumbersRegex, specialCharactersRegex } from '../../utils/regexPatterns'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'
import { LoadingContext } from '../../contexts/LoadingContext'
import { useCpfValidator } from '../../hooks/useCpfValidator'
import * as originalAxios from 'axios'

type Props = {}

type InputsType = {
    firstName: HTMLInputElement | null
    lastName: HTMLInputElement | null
    email: HTMLInputElement | null
    cpf: HTMLInputElement | null
}

const ProfilePage = (props: Props) => {
    const [firstName, setFirstName] = useState<string>('Wellington')
    const [firstNameIsValid, setFirstNameIsValid] = useState<boolean>(true)

    const [lastName, setLastName] = useState<string>('Cimento')
    const [lastNameIsValid, setLastNameIsValid] = useState<boolean>(true)

    const [email, setEmail] = useState<string>('wellingtoncimentooficial@gmail.com')
    const [emailIsValid, setEmailIsValid] = useState<boolean>(true)

    const [cpf, setCpf] = useState<string>('')
    const [cpfIsValid, setCpfIsValid] = useState<boolean>(false)

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const { updateTitle } = usePageTitleChanger()

    const axiosPrivate = useAxiosPrivate()

    const { getCaptchaToken, initializeRecaptchaScript } = useReCaptchaToken()

    const { isLoading, setIsLoading } = useContext(LoadingContext)

    const { validate_cpf_algorithm } = useCpfValidator()

    const inputsRef = useRef<InputsType>({
        firstName: null,
        lastName: null,
        email: null,
        cpf: null
    })

    const save_data = async (recaptchaToken: string) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.patch('/accounts/profile/update', {
                first_name: firstName,
                last_name: lastName,
                cpf: cpf.replaceAll(specialCharactersRegex, ''),
                "g-recaptcha-response": recaptchaToken
            })
            if(response?.status === 200){
                console.log(response.data)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                console.log(error)
            }
        }
        setIsLoading(false)
    }

    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNameRegex = new RegExp(NameRegex)
        const value = e.target.value
        if(newNameRegex.test(value)){
            setFirstNameIsValid(true)
        }else{
            setFirstNameIsValid(false)
        }
        setFirstName(value)
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNameRegex = new RegExp(NameRegex)
        const value = e.target.value
        if(newNameRegex.test(value)){
            setLastNameIsValid(true)
        }else{
            setLastNameIsValid(false)
        }
        setLastName(value)
    }

    const handleEmail= (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmailRegex = new RegExp(emailRegex)
        const value = e.target.value
        if(newEmailRegex.test(value)){
            setEmailIsValid(true)
        }else{
            setEmailIsValid(false)
        }
        setEmail(value)
    }

    const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOnlyNumbersRegex = new RegExp(onlyNumbersRegex)
        const value = e.target.value.replaceAll(/\D/g, "")
        if(newOnlyNumbersRegex.test(value)){
            if(value.length >= 11){
                const cpfFormatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`
                setCpf(cpfFormatted)
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

    return (
        <WidthLayout width={90}>
            <div className={styles.wrapper}>
                <div className={styles.userMenu}>
                    <UserMenu />
                </div>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h3 className={styles.headerTitle}>Seu perfil</h3>
                        <p className={styles.headerDescription}>Informações relacionadas a você, informações pessoais.</p>
                    </div>
                    <div className={styles.body}>
                        <form className={styles.bodyForm} onSubmit={handleSubmit}>
                            <div className={styles.bodyFormInput}>
                                <span className={`${styles.bodyFormInputLabel} ${(!firstNameIsValid && !isFirstRender) ? styles.invalidInputLabel : null}`}>Primeiro nome</span>
                                <input 
                                    ref={element => inputsRef.current['firstName'] = element}
                                    type="text" 
                                    name="first_name" 
                                    id="first_name" 
                                    className={`${styles.bodyFormInputInput} ${(!firstNameIsValid && !isFirstRender) ? styles.invalidInput : null}`}
                                    onChange={handleFirstName}
                                    value={firstName}
                                />
                            </div>
                            <div className={styles.bodyFormInput}>
                                <span className={`${styles.bodyFormInputLabel} ${(!lastNameIsValid && !isFirstRender) ? styles.invalidInputLabel : null}`}>Sobrenome</span>
                                <input 
                                    ref={element => inputsRef.current['lastName'] = element}
                                    type="text" 
                                    name="last_name" 
                                    id="last_name" 
                                    className={`${styles.bodyFormInputInput} ${(!lastNameIsValid && !isFirstRender) ? styles.invalidInput : null}`}
                                    onChange={handleLastName}
                                    value={lastName}
                                />
                            </div>
                            <div className={styles.bodyFormInput}>
                                <span className={`${styles.bodyFormInputLabel} ${(!emailIsValid && !isFirstRender) ? styles.invalidInputLabel : null}`}>E-mail</span>
                                <input 
                                    ref={element => inputsRef.current['email'] = element}
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className={`${styles.bodyFormInputInput} ${(!emailIsValid && !isFirstRender) ? styles.invalidInput : null}`}
                                    disabled
                                    onChange={handleEmail}
                                    value={email}
                                />
                            </div>
                            <div className={styles.bodyFormInput}>
                                <span className={`${styles.bodyFormInputLabel} ${(!cpfIsValid && !isFirstRender) ? styles.invalidInputLabel : null}`}>CPF</span>
                                <input 
                                    ref={element => inputsRef.current['cpf'] = element}
                                    type="text" 
                                    name="cpf" 
                                    id="cpf" 
                                    placeholder='000.000.000-00' 
                                    className={`${styles.bodyFormInputInput} ${(!cpfIsValid && !isFirstRender) ? styles.invalidInput : null}`}
                                    onChange={handleCpf}
                                    value={cpf}
                                />
                            </div>
                            <BtnB01 autoWidth isLoading={isLoading}>Salvar</BtnB01>
                        </form>
                    </div>
                </div>
            </div>
        </WidthLayout>
    )
}

export default ProfilePage