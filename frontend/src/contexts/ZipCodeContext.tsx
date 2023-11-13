import { createContext, useEffect, useState, useCallback } from 'react'
import AddressLookup from '../components/Screens/AddressLookup/AddressLookup'
import ShadowFullScreen from '../components/UI/FullScreens/ShadowFullScreen/ShadowFullScreen'
import { axios } from '../services/api'

type ZipCodeType = {
    address: string
    zip_code: string
    city: string
    neighborhood: string
    uf: string
}

type ZipCodeContextType = {
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    zipCode: ZipCodeType | null
    setZipCode: React.Dispatch<React.SetStateAction<ZipCodeType | null>>
    removeZipCode: () => void
}

type ZipCodeProviderProps = {
    children: React.ReactNode
}

const initialZipCodeContext: ZipCodeContextType = {
    show: false,
    setShow: () => {},
    zipCode: null,
    setZipCode: () => {},
    removeZipCode: () => {}
}

export const ZipCodeContext = createContext<ZipCodeContextType>(initialZipCodeContext)

export const ZipCodeProvider = ({children}: ZipCodeProviderProps) => {
    const [zipCode, setZipCode] = useState<ZipCodeType | null>(null)
    const [show, setShow] = useState<boolean>(false)
    
    const get_address = useCallback(async (zipCodeText: string) => {
        try {
            const response = await axios.get(`/addresses/cep/${zipCodeText.replaceAll(/\D/g, "")}`)
            if(response.status === 200){
                setZipCode(response.data)
            }
        } catch (error) {
            setZipCode(null)
        }
    }, [])

    const removeZipCode = () => {
        try {
            localStorage.removeItem('zip_code')
            setZipCode(null)
            setShow(false)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        const zip_code_storage = localStorage.getItem('zip_code')?.replaceAll(/\D/g, "")
        if(zip_code_storage && zip_code_storage.length === 8){
            get_address(zip_code_storage)
        }
    }, [get_address])

    return (
        <ZipCodeContext.Provider value={{zipCode, setZipCode, show, setShow, removeZipCode}}>
            {show && 
                <ShadowFullScreen>
                    <AddressLookup />
                </ShadowFullScreen>
            }
            {children}
        </ZipCodeContext.Provider>
    )
}