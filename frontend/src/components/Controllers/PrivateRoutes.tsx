import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const PrivateRoutes = () => {
    const { tokens, getClientToken  } = useContext(AuthContext)

    const navigate = useNavigate()
    
    useEffect(() => {
        const refreshToken = getClientToken()
        if(!refreshToken && !tokens.refresh){
            navigate('/account/sign-in')
        }
    }, [tokens.refresh, navigate, getClientToken])

    return <Outlet />
}

export default PrivateRoutes