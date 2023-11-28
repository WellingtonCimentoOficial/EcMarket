export interface TokenType {
    exp: number
    iat: number
    jti: string
    token_type: string
    user_id: number
    user_first_name: string
    user_last_name: string
    user_email: string
    is_verified: boolean
}