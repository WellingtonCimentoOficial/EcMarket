export interface AddressType {
    id: number
    street: string
    number: string
    district: string
    complement: string
    city: string
    state: string
    uf: string
    zip_code: string
    country: string
}
export interface DeliveryAddressType {
    id: number
    name: string
    street: string
    number: string
    district: string
    complement: string
    city: string
    state: string
    uf: string
    zip_code: string
    country: string
}
export interface CepInfoType {
    address: string
    zip_code: string
    neighborhood: string
    city: string
    state: string
    uf: string
}