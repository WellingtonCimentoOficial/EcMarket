import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { SIGN_IN_PATH } from '../../routes'

const PrivateRoutes = () => {
    const { isAuthenticated, getClientToken  } = useContext(AuthContext)

    const navigate = useNavigate()
    
    useEffect(() => {
        const refreshToken = getClientToken()
        if(!refreshToken && !isAuthenticated){
            navigate(SIGN_IN_PATH)
        }
    }, [isAuthenticated, navigate, getClientToken])

    return <Outlet />
}

export default PrivateRoutes