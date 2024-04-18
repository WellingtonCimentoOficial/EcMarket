import React, { useEffect, useState, useCallback, useContext, useRef, FormEvent } from 'react'
import styles from './AddressesPage.module.css'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { PiHouseLight, PiPencilSimpleLight, PiPlusLight, PiPushPin, PiTrashLight } from 'react-icons/pi'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { AddressType, DeliveryAddressType } from '../../types/AddressesType'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { AuthContext } from '../../contexts/AuthContext'
import { LoadingContext } from '../../contexts/LoadingContext'
import * as axiosOriginal from 'axios'
import LabelInput from '../../components/UI/Inputs/LabelInput/LabelInput'
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import { everythingExceptNumbersRegex, onlyNumbersRegex } from '../../constants/regexPatterns'
import { useReCaptchaToken } from '../../hooks/useReCaptchaToken'
import SimpleSelect from '../../components/UI/Selects/SimpleSelect/SimpleSelect'
import { SelectType } from '../../types/SelectType'
import { axios } from '../../services/api'
import { MessageErrorType } from '../../types/ErrorType'
import SimpleErrorResponseMessage from '../../components/UI/ResponseMessages/SimpleErrorResponseMessage/SimpleErrorResponseMessage'
import { 
    DELIVERY_ADDRESS_NOT_FOUND, INVALID_ADDRESS_ERROR, 
    INVALID_DELIVERY_ADDRESS_COMPLEMENT_FIELD, 
    INVALID_DELIVERY_ADDRESS_NAME_FIELD, 
    MAXIMUM_NUMBER_OF_DELIVERY_ADDRESSES_REACHED_ERROR, 
    RECAPTCHA_ERROR, REQUEST_ERROR 
} from '../../constants/errorMessages'
import { useAddressRequests } from '../../hooks/useAddressRequests'
import { ZipCodeContext } from '../../contexts/ZipCodeContext'

type Props = {}

type InputsType = {
    name: HTMLInputElement | null
    street: HTMLInputElement | null
    number: HTMLInputElement | null
    district: HTMLInputElement | null
    complement: HTMLInputElement | null
    city: HTMLInputElement | null
    state: HTMLInputElement | null
    uf: HTMLInputElement | null
    zipCode: HTMLInputElement | null
    country: HTMLInputElement | null
}

const AddressesPage = (props: Props) => {
    const [address, setAddress] = useState<AddressType | null>(null)
    const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddressType[] | null>(null)
    const { updateTitle } = usePageTitleChanger()
    const axiosPrivate = useAxiosPrivate()
    const { areTokensUpdated, isAuthenticated } = useContext(AuthContext)
    const { setIsLoading } = useContext(LoadingContext)
    const [showForm, setShowForm] = useState<{
        show: boolean, 
        isUpdate?: boolean, 
        idAddress?: number, 
        idDeliveryAddress?: number
    }>({ show: false})

    const [name, setName] = useState<string>('')
    const [nameIsValid, setNameIsValid] = useState<boolean>(false)

    const [street, setStreet] = useState<string>('')
    const [streetIsValid, setStreetIsValid] = useState<boolean>(false)

    const [number, setNumber] = useState<string>('')
    const [numberIsValid, setNumberIsValid] = useState<boolean>(false)

    const [district, setDistrict] = useState<string>('')
    const [districtIsValid, setDistrictIsValid] = useState<boolean>(false)

    const [complement, setComplement] = useState<string>('')
    const [complementIsValid, setComplementIsValid] = useState<boolean>(true)

    const [city, setCity] = useState<string>('')
    const [cityIsValid, setCityIsValid] = useState<boolean>(false)

    const [state, setState] = useState<string>('')
    const [stateIsValid, setStateIsValid] = useState<boolean>(false)

    const [uf, setUf] = useState<string>('')
    const [ufIsValid, setUfIsValid] = useState<boolean>(false)

    const [zipCode, setZipCode] = useState<string>('')
    const [zipCodeIsValid, setZipCodeIsValid] = useState<boolean>(false)

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
    const [isFirstRenderFirst, setIsFirstRenderFirst] = useState<boolean>(true)

    const { getCaptchaToken, initializeRecaptchaScript } = useReCaptchaToken()
    
    const [message, setMessage] = useState<MessageErrorType | null>(null)

    const [localIsLoading, setLocalIsLoading] = useState<boolean>(false)

    const inputsRef = useRef<InputsType>({
        name: null,
        street: null,
        number: null,
        district: null,
        complement: null,
        city: null,
        state: null,
        uf: null,
        zipCode: null,
        country: null
    })
    
    const countries = [
        {
            text: "Brasil",
            value: "BR"
        },
    ]
    const [country, setCountry] = useState<SelectType>(countries[0])
    const countryIsValid = country ? true : false

    const { getUserAddress } = useAddressRequests()
    const { setZipCodeContextData } = useContext(ZipCodeContext)

    const getCep = useCallback(async (zipCode: string) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/addresses/cep/${zipCode}`)
            if(response?.status === 200){
                const data: AddressType = response.data

                setNameIsValid(!address ? true : false)

                setStreet(data.street)
                setStreetIsValid(true)

                setDistrict(data.district)
                setDistrictIsValid(true)

                setCity(data.city)
                setCityIsValid(true)

                setState(data.state)
                setStateIsValid(true)
                
                setUf(data.uf)
                setUfIsValid(true)

                setMessage(null)
            }
        } catch (error) {
            if(axiosOriginal.isAxiosError(error)){
                if(error.response?.data.cod === 48){
                    setZipCodeIsValid(false)
                    inputsRef.current.zipCode?.focus()
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
    }, [address, setNameIsValid, setStreet, setDistrict, setCity, setUf, setIsLoading])

    const addAddress = useCallback(async ({ RecaptchaToken }: { RecaptchaToken: string }) => {
        setLocalIsLoading(true)
        try {
            const link = (showForm.isUpdate && showForm.idAddress) ? '/addresses/address/update' :
            (showForm.isUpdate && showForm.idDeliveryAddress) ? `/addresses/delivery/update/${showForm.idDeliveryAddress}` :
            (!address) ? '/addresses/address/create' : '/addresses/delivery/create'
            const response = await axiosPrivate({
                method: showForm.isUpdate ? 'PUT' : 'POST',
                url: link,
                data: {
                    name,
                    street,
                    number,
                    district,
                    complement,
                    city,
                    state,
                    uf,
                    zip_code: zipCode.replace('-', ''),
                    country: country.value,
                    "g-recaptcha-response": RecaptchaToken
                }
            })
            const data = response.data
            if(response?.status === 200 || response?.status === 201){
                const updateAddresses = () => {
                    setAddress(data)
                    setZipCodeContextData(data)
                }
                (!address || (address && showForm.isUpdate && showForm.idAddress)) ? updateAddresses() : setDeliveryAddresses(prev => {
                    if(prev && showForm.isUpdate && showForm.idDeliveryAddress){
                        return [...prev.filter(item => item.id !== showForm.idDeliveryAddress), data]
                    }else if(prev && !showForm.isUpdate){
                        return [...prev, data]
                    }
                    return [data]
                })
                setShowForm({show: false})
                setMessage(null)
            }
        } catch (error) {
            if(axiosOriginal.isAxiosError(error)){
                if(error.response?.data.cod === 42 || error.response?.data.cod === 51 || error.response?.data.cod === 61){
                    setZipCodeIsValid(false)
                    inputsRef.current.zipCode?.focus()
                }else if(error.response?.data.cod === 43 || error.response?.data.cod === 52 || error.response?.data.cod === 57 || error.response?.data.cod === 62){
                    setMessage({
                        title: INVALID_ADDRESS_ERROR.title,
                        text: INVALID_ADDRESS_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 44 || error.response?.data.cod === 53 || error.response?.data.cod === 58 || error.response?.data.cod === 63){
                    setMessage({
                        title: RECAPTCHA_ERROR.title,
                        text: RECAPTCHA_ERROR.text,
                        isError: true
                    })
                }else if(error.response?.data.cod === 50){
                    setMessage({
                        title: MAXIMUM_NUMBER_OF_DELIVERY_ADDRESSES_REACHED_ERROR.title,
                        text: MAXIMUM_NUMBER_OF_DELIVERY_ADDRESSES_REACHED_ERROR.text,
                        isError: true
                    })
                    setShowForm({ show: false })
                }else if(error.response?.data.cod === 49 || error.response?.data.cod === 65){
                    setMessage({
                        title: INVALID_DELIVERY_ADDRESS_NAME_FIELD.title,
                        text: INVALID_DELIVERY_ADDRESS_NAME_FIELD.text,
                        isError: true
                    })
                    inputsRef.current.name?.focus()
                }else if(error.response?.data.cod === 66 || error.response?.data.cod === 67 || error.response?.data.cod === 68 || error.response?.data.cod === 69){
                    setMessage({
                        title: INVALID_DELIVERY_ADDRESS_COMPLEMENT_FIELD.title,
                        text: INVALID_DELIVERY_ADDRESS_COMPLEMENT_FIELD.text,
                        isError: true
                    })
                    setShowForm({ show: false })
                    inputsRef.current.complement?.focus()
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
    }, [showForm.idAddress, showForm.idDeliveryAddress, showForm.isUpdate, country.value, address, name, street, number, 
        district, complement, city, state, uf, zipCode, axiosPrivate, setAddress, setLocalIsLoading, setZipCodeContextData])

    const getDeliveryAddresses = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/addresses/delivery/')
            if(response?.status === 200){
                const data: DeliveryAddressType[] = response.data
                setDeliveryAddresses(data)
            }
        } catch (error) {
            setDeliveryAddresses(null)
        }
        setIsLoading(false)
    }, [axiosPrivate, setDeliveryAddresses, setIsLoading])

    const deleteDeliveryAddress = useCallback(async (id: number) => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.delete(`/addresses/delivery/delete/${id}`)
            if(response?.status === 204) {
                setDeliveryAddresses(prev => prev ? prev.filter(item => item.id !== id) : null)
            }
        } catch (error) {
            if(axiosOriginal.isAxiosError(error)){
                if(error.response?.data.cod === 55){
                    setMessage({
                        title: DELIVERY_ADDRESS_NOT_FOUND.title,
                        text: DELIVERY_ADDRESS_NOT_FOUND.text,
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
    }, [axiosPrivate, setDeliveryAddresses, setIsLoading])

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value.length > 0 && value.length <= 20){
            setNameIsValid(true)
        }else{
            setNameIsValid(false)
        }
        setName(value)
    }

    const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numberRegex = new RegExp(onlyNumbersRegex)
        const value = e.target.value
        if(numberRegex.test(value) && value.length > 1 && value.length <= 10){
            setNumberIsValid(true)
        }else{
            setNumberIsValid(false)
        }
        setNumber(value)
    }

    const handleComplement = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value.length > 0 && value.length <= 50){
            setComplementIsValid(true)
        }else{
            setComplementIsValid(false)
        }
        setComplement(value)
    }
    
    const handleZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(everythingExceptNumbersRegex, "")
        if(value.length >= 8){
            setZipCode(value.slice(0, 8).replace(/^(\d{5})(\d{3})$/, '$1-$2'))
            setZipCodeIsValid(true)
            getCep(value.slice(0, 8))
            inputsRef.current.number?.focus()
        }else{
            setZipCode(value)
            setZipCodeIsValid(false)
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setIsFirstRender(false)
        if(nameIsValid){
            if(streetIsValid){
                if(numberIsValid){
                    if(districtIsValid){
                        if(complementIsValid){
                            if(cityIsValid){
                                if(stateIsValid){
                                    if(ufIsValid){
                                        if(zipCodeIsValid){
                                            if(countryIsValid){
                                                getCaptchaToken(addAddress)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        if(areTokensUpdated && isAuthenticated && isFirstRenderFirst){
            getUserAddress({ setIsLoading, setData: setAddress })
            getDeliveryAddresses()
            setIsFirstRenderFirst(false)
        }
    }, [areTokensUpdated, isAuthenticated, isFirstRenderFirst, getUserAddress, getDeliveryAddresses, setIsLoading])

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Addresses`)
    }, [updateTitle])

    useEffect(() => {
        initializeRecaptchaScript()
    }, [initializeRecaptchaScript])

    useEffect(() => {
        if(showForm.show && showForm.isUpdate){
            if(showForm.idAddress && address){
                setZipCode(address.zip_code.replace(/^(\d{5})(\d{3})$/, '$1-$2'))
                setStreet(address.street)
                setNumber(address.number || '')
                setDistrict(address.district)
                setComplement(address.complement || '')
                setCity(address.city)
                setState(address.state)
                setUf(address.uf)
            }else if(showForm.idDeliveryAddress){
                const dAddr = deliveryAddresses?.find(item => item.id === showForm.idDeliveryAddress)
                setName(dAddr?.name || '')
                setZipCode(dAddr?.zip_code.replace(/^(\d{5})(\d{3})$/, '$1-$2') || '')
                setStreet(dAddr?.street || '')
                setNumber(dAddr?.number || '')
                setDistrict(dAddr?.district || '')
                setComplement(dAddr?.complement || '')
                setCity(dAddr?.city || '')
                setState(dAddr?.state || '')
                setUf(dAddr?.uf || '')
            }
            setNameIsValid(true)
            setZipCodeIsValid(true)
            setStreetIsValid(true)
            setNumberIsValid(true)
            setDistrictIsValid(true)
            setComplementIsValid(true)
            setCityIsValid(true)
            setStateIsValid(true)
            setUfIsValid(true)
        }
    }, [showForm, address, deliveryAddresses])

    useEffect(() => {
        if(!showForm.show){
            setName('')
            setZipCode('')
            setStreet('')
            setNumber('')
            setDistrict('')
            setComplement('')
            setCity('')
            setState('')
            setUf('')
            setNameIsValid(false)
            setZipCodeIsValid(false)
            setNumberIsValid(false)
            setComplementIsValid(true)
            setIsFirstRender(true)
        }
    }, [showForm.show])

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Seus endereços' text='Informações relacionadas ao seu endereço pessoal e endereços de entrega.'>
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        {message && <SimpleErrorResponseMessage title={message.title} text={message.text} isError={message.isError} />}
                        {showForm.show ? (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <SimpleSelect 
                                    invalid={(!countryIsValid && !isFirstRender) ? true : false}
                                    data={countries} 
                                    value={country} 
                                    onChange={setCountry} 
                                    className={styles.formSelect}
                                    disabled={localIsLoading}
                                />
                                {((address && !showForm.isUpdate) || (showForm.isUpdate && showForm.idDeliveryAddress)) &&
                                    <div className={styles.formItem}>
                                        <LabelInput 
                                            invalid={(!nameIsValid && !isFirstRender) ? true : false}
                                            ref={element => inputsRef.current['name'] = element}
                                            type="text" 
                                            name="name" 
                                            id="name"
                                            minLength={1}
                                            maxLength={20}
                                            onChange={handleName}
                                            value={name}
                                            labelText='Name'
                                            placeholder='Apelido para o endereço'
                                            disabled={localIsLoading}
                                        />
                                    </div>
                                }
                                <div className={styles.formItem}>
                                    <LabelInput 
                                        invalid={(!zipCodeIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['zipCode'] = element}
                                        type="text" 
                                        name="zipCode" 
                                        id="zipCode"
                                        minLength={1}
                                        maxLength={50}
                                        onChange={handleZipCode}
                                        value={zipCode}
                                        labelText='CEP'
                                        placeholder='0000-000'
                                        disabled={localIsLoading}
                                    />
                                    <LabelInput 
                                        invalid={(!streetIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['street'] = element}
                                        type="text" 
                                        name="street" 
                                        id="street"
                                        minLength={1}
                                        maxLength={50}
                                        value={street}
                                        labelText='Rua'
                                        placeholder='Nome da rua'
                                        disabled
                                    />
                                </div>
                                <div className={styles.formItem}>
                                    <LabelInput 
                                        invalid={(!numberIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['number'] = element}
                                        type="text" 
                                        name="number" 
                                        id="number"
                                        minLength={2}
                                        maxLength={10}
                                        onChange={handleNumber}
                                        value={number}
                                        labelText='Número'
                                        placeholder='Número da residencia'
                                        disabled={localIsLoading}
                                    />
                                    <LabelInput 
                                        invalid={(!districtIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['district'] = element}
                                        type="text" 
                                        name="district" 
                                        id="district"
                                        minLength={1}
                                        maxLength={50}
                                        value={district}
                                        labelText='Bairro'
                                        placeholder='Nome do bairro'
                                        disabled
                                    />
                                </div>
                                <div className={styles.formItem}>
                                    <LabelInput 
                                        invalid={(!complementIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['complement'] = element}
                                        type="text" 
                                        name="complement" 
                                        id="complement"
                                        minLength={1}
                                        maxLength={50}
                                        onChange={handleComplement}
                                        value={complement}
                                        labelText='Complemento'
                                        placeholder='Complemento'
                                        disabled={localIsLoading}
                                    />
                                    <LabelInput 
                                        invalid={(!cityIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['city'] = element}
                                        type="text" 
                                        name="city" 
                                        id="city"
                                        minLength={1}
                                        maxLength={50}
                                        value={city}
                                        labelText='Cidade'
                                        placeholder='Nome da cidade'
                                        disabled
                                    />
                                </div>
                                <div className={styles.formItem}>
                                    <LabelInput 
                                        invalid={(!stateIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['state'] = element}
                                        type="text" 
                                        name="state" 
                                        id="state"
                                        minLength={1}
                                        maxLength={50}
                                        value={state}
                                        labelText='Estado'
                                        placeholder='Nome do estado'
                                        disabled
                                    />
                                    <LabelInput 
                                        invalid={(!ufIsValid && !isFirstRender) ? true : false}
                                        ref={element => inputsRef.current['uf'] = element}
                                        type="text" 
                                        name="uf" 
                                        id="uf"
                                        minLength={2}
                                        maxLength={2}
                                        value={uf}
                                        labelText='UF'
                                        placeholder='Sigla do estado'
                                        disabled
                                    />
                                    
                                </div>
                                <div className={styles.formItem}>
                                    <BtnB01 autoWidth isLoading={localIsLoading} disabled={localIsLoading}>
                                        Salvar
                                    </BtnB01>
                                </div>
                            </form>
                        ):(
                            <>
                                <div className={styles.addCard} onClick={() => setShowForm({show: true})}>
                                    <div className={styles.addCardContainer}>
                                        <PiPlusLight className={styles.addCardIcon} />
                                        <span className={styles.addCardText}>Adicionar um novo endereço</span>
                                    </div>
                                </div>
                                {address &&
                                    <div className={styles.card}>
                                        <div className={styles.cardContainer}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.cardHeaderLeft}>
                                                    <PiHouseLight className={styles.cardHeaderIcon} />
                                                    <span className={styles.cardHeaderTitle}>My Home</span>
                                                </div>
                                                <div className={styles.cardHeaderRight}>
                                                    <PiPushPin className={styles.cardHeaderPinIcon} />
                                                </div>
                                            </div>
                                            <div className={styles.cardBody}>
                                                <span className={styles.cardBodyText}>{address.street}, {address.number}</span>
                                                <span className={styles.cardBodyText}>{address.district}</span>
                                                <span className={styles.cardBodyText}>{address.city}</span>
                                                <span className={styles.cardBodyText}>{address.zip_code.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</span>
                                            </div>
                                            <div className={styles.cardFooter}>
                                                <div 
                                                    title='Editar'
                                                    className={styles.cardFooterItem} 
                                                    onClick={() => setShowForm({ show: true, isUpdate: true, idAddress: address.id })}
                                                >
                                                    <PiPencilSimpleLight className={styles.cardFooterItemIcon} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {deliveryAddresses?.slice().sort((a, b) => b.id - a.id).map((item) => (
                                    <div className={styles.card} key={item.id}>
                                        <div className={styles.cardContainer}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.cardHeaderLeft}>
                                                    <PiHouseLight className={styles.cardHeaderIcon} />
                                                    <span className={styles.cardHeaderTitle}>{item.name}</span>
                                                </div>
                                            </div>
                                            <div className={styles.cardBody}>
                                                <span className={styles.cardBodyText}>{item.street}, {item.number}</span>
                                                <span className={styles.cardBodyText}>{item.district}</span>
                                                <span className={styles.cardBodyText}>{item.city}</span>
                                                <span className={styles.cardBodyText}>{item.zip_code.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</span>
                                            </div>
                                            <div className={styles.cardFooter}>
                                                <div 
                                                    title='Editar'
                                                    className={styles.cardFooterItem} 
                                                    onClick={() => setShowForm({ show: true, isUpdate: true, idDeliveryAddress: item.id })}
                                                >
                                                    <PiPencilSimpleLight className={styles.cardFooterItemIcon} />
                                                </div>
                                                <div 
                                                    title='Excluir'
                                                    className={styles.cardFooterItem} 
                                                    onClick={() => deleteDeliveryAddress(item.id)}
                                                >
                                                    <PiTrashLight className={styles.cardFooterItemIcon} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default AddressesPage