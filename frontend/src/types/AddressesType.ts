export interface AddressType {
    id: number
    street: string
    number: string | null
    district: string
    complement: string | null
    city: string
    state: string
    uf: string
    zip_code: string
    country: string | null
}
export interface DeliveryAddressType extends AddressType {
    name: string
}