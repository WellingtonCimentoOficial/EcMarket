import React, { useEffect, useState, useCallback, useContext } from 'react'
import styles from './AddressesPage.module.css'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { PiHouseLight, PiPlusLight, PiPushPin, PiUserLight } from 'react-icons/pi'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { AddressType, DeliveryAddressType } from '../../types/AddressesType'
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate'
import { AuthContext } from '../../contexts/AuthContext'
import { LoadingContext } from '../../contexts/LoadingContext'

type Props = {}

const AddressesPage = (props: Props) => {
    const [address, setAddress] = useState<AddressType | null>(null)
    const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddressType[] | null>(null)
    const { updateTitle } = usePageTitleChanger()
    const axiosPrivate = useAxiosPrivate()
    const { tokens } = useContext(AuthContext)
    const { setIsLoading } = useContext(LoadingContext)

    const get_address = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/addresses/address/')
            const data: AddressType = response.data
            if(response?.status === 200){
                setAddress(data)
            }
        } catch (error) {
            
        }
        setIsLoading(false)
    }, [axiosPrivate, setAddress])

    const get_delivery_addresses = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/addresses/delivery/')
            const data: DeliveryAddressType[] = response.data
            if(response?.status === 200){
                setDeliveryAddresses(data)
            }
        } catch (error) {
            
        }
        setIsLoading(false)
    }, [axiosPrivate, setAddress])

    useEffect(() => {
        if(tokens.refresh){
            get_address()
            get_delivery_addresses()
        }
    }, [get_address, get_delivery_addresses])

    useEffect(() => {
        updateTitle(`${process.env.REACT_APP_PROJECT_NAME} | Addresses`)
    }, [updateTitle])

    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Seus endereços' text='Informações relacionadas ao seu endereço pessoal e endereços de entrega.'>
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <div className={styles.addCard}>
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
                                        <span className={styles.cardBodyText}>{address.zip_code}</span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardFooterText}>Editar</span>
                                        <span className={styles.cardFooterText}>Excluir</span>
                                    </div>
                                </div>
                            </div>
                        }
                        {deliveryAddresses?.map((item) => (
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
                                        <span className={styles.cardBodyText}>{item.zip_code}</span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardFooterText}>Editar</span>
                                        <span className={styles.cardFooterText}>Excluir</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default AddressesPage