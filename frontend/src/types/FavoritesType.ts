import { Children, Product } from "./ProductType"

export interface FavoriteType {
    id: number
    product_fathers: Product[]
    product_childs: Children[]
    created_at: string
    updated_at: string
}