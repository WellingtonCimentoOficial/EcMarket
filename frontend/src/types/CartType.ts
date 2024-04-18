import { Children, Product } from "./ProductType"

export interface CartDetailsType {
    products_quantity: number
    total_price: number
    shipping_price: number
    tax_price: number
    coupon_discount_price: number
    total_discount_price: number
    final_price: number
}

export interface CartType {
    id: number
    product_father: Product
    product_child: Children | null
    quantity: number
    created_at: string
    updated_at: string
}