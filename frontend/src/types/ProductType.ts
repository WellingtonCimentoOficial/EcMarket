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

export type Children = {
    id: number
    default_price: number
    discount_price: number | null
    discount_percentage: number | null
    installment_details: InstallmentDetails
    images: Images
}

export interface Product {
    id: number
    name: string
    description: string | null
    rating: Rating
    children: Children[]
}