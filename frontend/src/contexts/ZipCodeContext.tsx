import { createContext, useState } from 'react'
import AddressLookup from '../components/Screens/AddressLookup/AddressLookup'
import ShadowFullScreen from '../components/UI/FullScreens/ShadowFullScreen/ShadowFullScreen'

type ZipCodeType = {
    address: string
    cep: string
    city: string
    neighborhood: string
    uf: string
}

type ZipCodeContextType = {
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    zipCode: ZipCodeType | null
    setZipCode: React.Dispatch<React.SetStateAction<ZipCodeType | null>>
}

type ZipCodeProviderProps = {
    children: React.ReactNode
}

const initialZipCodeContext: ZipCodeContextType = {
    show: false,
    setShow: () => {},
    zipCode: null,
    setZipCode: () => {}
}

export const ZipCodeContext = createContext<ZipCodeContextType>(initialZipCodeContext)

export const ZipCodeProvider = ({children}: ZipCodeProviderProps) => {
    const [zipCode, setZipCode] = useState<ZipCodeType | null>(null)
    const [show, setShow] = useState<boolean>(false)
    

    return (
        <ZipCodeContext.Provider value={{zipCode, setZipCode, show, setShow}}>
            {show && 
                <ShadowFullScreen>
                    <AddressLookup />
                </ShadowFullScreen>
            }
            {children}
        </ZipCodeContext.Provider>
    )
}