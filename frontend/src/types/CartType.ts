export type CartProductType = {
    id: number,
    child: number | null,
    quantity: number
}

export interface CartType {
    id: number
    products: CartProductType[]
    created_at: string
    updated_at: string
}