type GoogleButtonType = {
    type: 'standard' | 'icon',
    theme?: 'outline' | 'filled_blue' | 'filled_black',
    size?: 'large' | 'medium' | 'small',
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin',
    shape?: 'rectangular' | 'pill' | 'circle' | 'square',
    logo_alignment?: 'left' | 'center',
    width?: string,
    locale?: string,
    click_listener?: () => void,
}

export type CredentialResponseType = {
    credential: string
    client_id: string
}


type InitializeType = {
    client_id: string, 
    callback: (response: CredentialResponseType) => void,
    login_uri?: string
}

export interface GoogleInterface {
    accounts: {
        id: {
            initialize: ({client_id, callback}: InitializeType) => void
            renderButton: (element: HTMLElement, {
                type, theme, size, text, shape, 
                logo_alignment, width, locale, 
                click_listener
            }: GoogleButtonType) =>  void
            prompt: () => void
            disableAutoSelect: () => void
        }
    }
}
