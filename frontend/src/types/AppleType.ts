type InitType = {
    clientId: string,
    scope: string,
    redirectURI : string,
    state: string,
    nonce: string,
    usePopup: boolean
}

type SuccessDataType = {
    authorization: {
        code: string,
        id_token: string
        state: string
    },
    user: {
        email: string,
        name: {
            firstName: string,
            lastName: string
        }
    }
}

type FailureDataType = {
    error: string
}

export type EventType = {
    detail: {
        data: SuccessDataType | FailureDataType
    }
}

export interface AppleInterface {
    auth: {
        init: ({ clientId, scope, redirectURI, state, nonce, usePopup }: InitType) => void
    }
}