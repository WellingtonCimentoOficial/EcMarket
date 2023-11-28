import React, { useState, useContext, FormEvent, useRef } from 'react'
import styles from "./AddressLookup.module.css"
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01'
import { PiPlusBold } from 'react-icons/pi';
import { ZipCodeContext } from '../../../contexts/ZipCodeContext';
import { axios } from '../../../services/api';
import { PiMapPinLine, PiTrash } from 'react-icons/pi';
import { specialCharactersRegex } from '../../../utils/regexPatterns';

type Props = {}

const AddressLookup = (props: Props) => {
    const [zipCodeText, setZipCodeText] = useState<string>("")
    const [zipCodeisValid, setZipCodeisValid] = useState<boolean>(true)
    const { setShow, setZipCode, zipCode, removeZipCode } = useContext(ZipCodeContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentMouseOverId, setCurrentMouseOverId] = useState<number | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(specialCharactersRegex, "")
        if(isLoading){
            setIsLoading(currentValue => currentValue)
            return
        }

        if(value.length === 8){
            setZipCodeText(value.slice(0, 5) + '-' + value.slice(5))
            setZipCodeisValid(true)
            inputRef.current?.blur()
        }else{
            setZipCodeText(value)
            setZipCodeisValid(false)
        }
    }

    const get_address = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/addresses/cep/${zipCodeText.replaceAll(/\D/g, "")}`)
            if(response.status === 200){
                setZipCode(response.data)
                localStorage.setItem('zip_code', response.data.zip_code)
                setShow(false)
                return
            }
            setZipCodeisValid(false)
        } catch (error) {
            setZipCode(null)
        }
        setIsLoading(false)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if(!isLoading && zipCodeText.replaceAll(/\D/g, "").length === 8){
            get_address()
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.subHeader}>
                        <span className={styles.title}>Escolha a sua localização</span>
                        <span className={styles.subTitle}>Você poderá visualizar os prazos e custos de entrega em todos os produtos</span>
                    </div>
                    <div className={`${styles.closeBtn} ${isLoading ? styles.disabled : null}`} onClick={() => !isLoading && setShow(false)}>
                        <PiPlusBold className={styles.closeIcon} />
                    </div>
                </div>
                <div className={styles.body}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="zip_code">Código postal CEP</label>
                        <div className={styles.inputItem}>
                            <input 
                                ref={inputRef}
                                className={`${styles.input} ${!zipCodeisValid ? styles.inputError : null}`} 
                                type="text" 
                                name="zip_code" 
                                id="zip_code" 
                                minLength={9}
                                maxLength={9}
                                value={zipCodeText}
                                onChange={handleChange}
                                autoComplete='off'
                                disabled={isLoading ? true : false}
                                placeholder='00000-000'
                            />
                            <BtnB01 
                                autoHeight
                                className={styles.btnSubmit} 
                                disabled={isLoading ? true : false}
                                isLoading={isLoading}
                            >
                                Confirmar
                            </BtnB01>
                        </div>
                    </form>
                    {zipCode && (
                        <>
                            <div className={styles.bodyContainer}>
                                <div className={styles.bodyContainerHeader}>
                                    <div className={styles.line}></div>
                                    <span className={styles.bodyContainerHeaderTitle}>Endereços cadastrados</span>
                                    <div className={styles.line}></div>
                                </div>
                                {Array.from(Array(1)).map((_, index) => (
                                    <div key={index} className={styles.bodyItem} onMouseOver={() => setCurrentMouseOverId(index)} onMouseLeave={() => setCurrentMouseOverId(null)}>
                                        <div className={styles.bodyItemSubOne}>
                                            <PiMapPinLine className={styles.bodyItemSubOneIcon} />
                                        </div>
                                        <div className={styles.bodyItemSubTwo}>
                                            <span>{zipCode.address} - {zipCode.neighborhood}, {zipCode.city} - {zipCode.uf}</span>
                                            <span>{zipCode.zip_code.slice(0, 5)} - {zipCode.zip_code.slice(5)}</span>
                                        </div>
                                        <div 
                                            className={`${styles.bodyItemSubThree} ${currentMouseOverId === index ? styles.bodyItemSubThreeShow : styles.bodyItemSubThreeHide}`}
                                            onClick={removeZipCode}>
                                            <PiTrash className={styles.bodyItemSubThreeIcon} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddressLookup