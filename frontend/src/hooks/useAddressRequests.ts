import React, { useCallback } from 'react'
import { useAxiosPrivate } from './useAxiosPrivate'
import { AddressType } from '../types/AddressesType'
import * as axiosOriginal from 'axios'

type GetUserAddressProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>> | null
    setData: React.Dispatch<React.SetStateAction<AddressType | null>> | null
}

export const useAddressRequests = () => {

    const axiosPrivate = useAxiosPrivate()

    const getUserAddress = useCallback(async({ setIsLoading = () => {}, setData = () => {}} : Partial<GetUserAddressProps> = {}) => {
        setIsLoading && setIsLoading(true)
        try {
            const response = await axiosPrivate.get('/addresses/address/')
            if(response?.status === 200){
                const data: AddressType = response.data
                setData && setData(data)
                return data
            }
        } catch (error) {
            if(axiosOriginal.isAxiosError(error)){
                
            }
        }
        setIsLoading && setIsLoading(false)
    }, [axiosPrivate])

    return {
        getUserAddress
    }
}