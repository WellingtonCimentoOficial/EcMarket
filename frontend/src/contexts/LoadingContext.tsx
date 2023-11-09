import { createContext, useState } from "react";
import SprintLoader from "../components/UI/Loaders/SprintLoader/SprintLoader";
import ShadowFullScreen from "../components/UI/FullScreens/ShadowFullScreen/ShadowFullScreen";

type LoadingContextType = {
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type LoadingContextProviderProps = {
    children: React.ReactNode
}

const initialLoadingContext: LoadingContextType = {
    isLoading: false,
    setIsLoading: () => {},
}

export const LoadingContext = createContext<LoadingContextType>(initialLoadingContext)

export const LoadingContextProvider = ({ children }: LoadingContextProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading}}>
            {isLoading && 
                <ShadowFullScreen>
                    <SprintLoader />
                </ShadowFullScreen>
            }
            {children}
        </LoadingContext.Provider>
    )
}