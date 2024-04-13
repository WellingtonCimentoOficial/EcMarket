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
    image6: string
    image7: string
    image8: string
    image9: string
    image10: string
}

export type Attribute = {
    id: number,
    name: string
    is_image_field: boolean
}

export type Variant = {
    id: number,
    attribute: Attribute
    description: string
    is_primary: boolean
}

type ProductInfo = {
    default_price: number
    discount_price: number | null
    discount_percentage: number | null
    installment_details: InstallmentDetails | null
    images: Images
    sku: string
    quantity: number
}

export type Children = ProductInfo & {
    id: number
    is_favorite: boolean
    product_father_id: number
    product_variant: Variant[]
    created_at: string
    updated_at: string
}

export type Sales = {
    count: number
}

export interface Product extends ProductInfo {
    id: number
    name: string
    description: string | null
    rating: Rating
    presentation: Presentation | null
    store: Store
    technical_informations: TechnicalInformation[]
    sales: Sales
    has_variations: boolean
}