import { useContext, useCallback } from 'react' 
import { AuthContext } from "../contexts/AuthContext"
import { TokenType } from '../types/TokenType'
import { jwtDecode } from 'jwt-decode'

export const useJwtData = () => {
    const { tokens } = useContext(AuthContext)

    const getJwtData = useCallback(() => {
        if(tokens.refresh){
            const tokenData: TokenType = jwtDecode(tokens.refresh)
            return tokenData
        }
        return null
    }, [tokens.refresh])

    return { getJwtData }
}