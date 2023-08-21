export type FilterData = {
    id: number
    name: string
    count: number
}

export interface Filter {
    id: string
    name: string
    param: string
    data: FilterData[]
}