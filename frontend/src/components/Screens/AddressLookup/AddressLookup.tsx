import React, { useState, useContext, ChangeEventHandler, FormEvent } from 'react'
import styles from "./AddressLookup.module.css"
import BtnB01 from '../../UI/Buttons/BtnB01/BtnB01'
import { PiPlusBold } from 'react-icons/pi';
import { ZipCodeContext } from '../../../contexts/ZipCodeContext';
import SprintLoader from '../../UI/Loaders/SprintLoader/SprintLoader';
import { axios } from '../../../services/api';

type Props = {}

const AddressLookup = (props: Props) => {
    const [zipCodeText, setZipCodeText] = useState<string>("")
    const { setShow, setZipCode } = useContext(ZipCodeContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(/\D/g, "")
        if(isLoading){
            setIsLoading(currentValue => currentValue)
            return
        }

        if(value.length === 8){
            setZipCodeText(value.slice(0, 5) + '-' + value.slice(5))
        }else{
            setZipCodeText(value)
        }
    }

    const get_address = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/addresses/cep/${zipCodeText.replaceAll(/\D/g, "")}`)
            if(response.status === 200){
                setZipCode(response.data)
                setShow(false)
            }
        } catch (error) {
            setZipCode(null)
        }
        setIsLoading(false)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if(zipCodeText.replaceAll(/\D/g, "").length === 8){
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
                                className={styles.input} 
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
                                className={styles.btnSubmit} 
                                disabled={isLoading ? true : false}
                            >
                                    {isLoading ? <SprintLoader className={styles.loader} /> : 'Confirmar'}
                            </BtnB01>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddressLookup