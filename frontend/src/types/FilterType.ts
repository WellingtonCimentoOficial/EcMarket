type FilterData = {
    id: number
    name: string
    count: number
}

export interface Filter {
    name: string,
    data: FilterData[]
}