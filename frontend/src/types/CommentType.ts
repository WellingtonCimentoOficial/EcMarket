type Owner = {
    id: number
    first_name: string
    last_name: string
}

export interface Comment {
    id: number
    rating: number
    owner: Owner
    comment: string
    created_at: string
    updated_at: string
}   