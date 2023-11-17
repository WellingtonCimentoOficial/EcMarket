type Props = {
    currencyDisplay?: boolean
}

export const useCurrencyFormatter = ({ currencyDisplay } : Props = { currencyDisplay: true }) => {
    const CurrencyFormatter = (value: number): string => {
        const formatted: string = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
        return formatted
    }

    return {
        CurrencyFormatter
    }
}