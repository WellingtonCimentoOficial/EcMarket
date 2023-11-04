import { Store } from "./StoreType"

export type TechnicalInformation = {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
}

export type Images = {
    principal_image: string
    image_2: string | null
    image_3: string | null
    image_4: string | null
    image_5: string | null
}

export type InstallmentDetails = {
    installments: number
    installment_price: number
}

export type Rating = {
    average: number
    count: number
}

export type Presentation = {
    image1: string
    image2: string
    image3: string
    image4: string
    image5: string
}

export type Children = {
    id: number
    default_price: number
    discount_price: number | null
    discount_percentage: number | null
    installment_details: InstallmentDetails
    images: Images
    sku: string
    quantity: number
}

export interface Product {
    id: number
    name: string
    description: string | null
    rating: Rating
    children: Children[]
    presentation: Presentation | null
    store: Store
    technical_informations: TechnicalInformation[]
}