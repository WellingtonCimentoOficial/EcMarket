export type UserTokenType = {
    user_id: number
    user_first_name: string
    user_last_name: string
    user_email: string
    is_verified: boolean
}

export interface TokenType extends UserTokenType {
    exp: number
    iat: number
    jti: string
    token_type: string
}