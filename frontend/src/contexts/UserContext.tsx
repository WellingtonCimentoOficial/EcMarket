import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { UserProfileType } from "../types/UserType";
import { AuthContext } from "./AuthContext";

type UserContextProviderProps = {
    children: React.ReactNode
}

type userContextType = {
    user: UserProfileType,
    setUser: React.Dispatch<React.SetStateAction<UserProfileType>>
}

const userContextInitial: userContextType = {
    user: {
        first_name: '',
        last_name: '',
        email: '',
        id_number: '',
        is_verified: false
    },
    setUser: () => {}
}

export const UserContext = createContext<userContextType>(userContextInitial)

export const UserContextProvider = ({ children } : UserContextProviderProps) => {
    const [user, setUser] = useState<UserProfileType>(userContextInitial.user)

    const axiosPrivate = useAxiosPrivate()

    const { tokens } = useContext(AuthContext)

    const get_user_profile = useCallback(async () => {
        const response = await axiosPrivate.get('/accounts/profile/')
        if(response?.status === 200){
            const data: UserProfileType = response.data
            setUser(data)
        }
    }, [axiosPrivate])

    useEffect(() => {
        if(tokens.refresh){
            get_user_profile()
        }
    }, [tokens.refresh, get_user_profile])
    
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}