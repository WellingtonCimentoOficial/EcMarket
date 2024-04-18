import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const PrivateRoutes = () => {
    const { isAuthenticated, getClientToken  } = useContext(AuthContext)

    const navigate = useNavigate()
    
    useEffect(() => {
        const refreshToken = getClientToken()
        if(!refreshToken && !isAuthenticated){
            navigate('/account/sign-in')
        }
    }, [isAuthenticated, navigate, getClientToken])

    return <Outlet />
}

export default PrivateRoutes