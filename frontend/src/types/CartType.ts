import { Product } from "./ProductType"

export interface CartType {
    id: number
    products: Product[]
    created_at: string
    updated_at: string
}