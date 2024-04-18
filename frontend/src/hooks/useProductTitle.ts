import React, { useCallback } from 'react'
import { Children } from '../types/ProductType'

type Props = {
    productName: string
    child: Children | null
    length: number
}

export const useProductTitle = () => {
    const titleHandler = useCallback(({ productName, child, length } : Props) => {
        const variantDescriptionsFormatted = child?.product_variant.map(
            (variant, index) => (index + 1) !== child?.product_variant.length ? 
            `${variant.description} ` : 
            `(${variant.description})`
        )
        const formattedName = child ? `${productName} - ${variantDescriptionsFormatted}` : productName
        const shortenedName = formattedName.length > length ? `${formattedName.slice(0, length)}...` : formattedName
        return shortenedName
    }, [])
    return {titleHandler}
}