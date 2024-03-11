import { Product } from "./ProductType"



export type Category = {
    id: number
    name: string
    products: Product[]
}

export type CategoryName = {
    id: number,
    name: string
    sub_categories: {
        id: number,
        name: string
    }[] | null
}