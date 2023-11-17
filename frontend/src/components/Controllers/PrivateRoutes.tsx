import { useContext, useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const PrivateRoutes = () => {
    const { tokens, getClientToken  } = useContext(AuthContext)

    const navigate = useNavigate()
    
    useEffect(() => {
        const refreshToken = getClientToken()
        if(!refreshToken && !tokens.refresh){
            navigate('/accounts/sign-in')
        }
    }, [tokens.refresh])

    return <Outlet />
}

export default PrivateRoutes