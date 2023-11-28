import { useCallback } from "react"

export const useCpfValidator = () => {
    const calculate_first_verifying_digit = (cpf: string) => {
        const first_nine_digits = Array.from(cpf.slice(0, 9), Number)
        const first_nine_digits_decreasing_range = Array.from({ length: 9 }, (_, index) => 10 - index)
        const calc = first_nine_digits.map((num, index) => num * first_nine_digits_decreasing_range[index])
        const sum = calc.reduce((total, numero) => total + numero, 0)
        const rest_of_division = sum % 11
        const digit = rest_of_division < 2 ? 0 : 11 - rest_of_division
        return digit
    }

    const calculate_second_verifying_digit = (cpf: string) => {
        const first_ten_digits = Array.from(cpf.slice(0, 10), Number)
        const first_ten_digits_decreasing_range = Array.from({ length: 10 }, (_, index) => 11 - index)
        const calc = first_ten_digits.map((num, index) => num * first_ten_digits_decreasing_range[index])
        const sum = calc.reduce((total, numero) => total + numero, 0)
        const rest_of_division = sum % 11
        const digit = rest_of_division < 2 ? 0 : 11 - rest_of_division
        return digit
    }

    const validate_cpf_algorithm = useCallback((cpf: string) => {
        const first_digit = calculate_first_verifying_digit(cpf)
        const second_digit = calculate_second_verifying_digit(cpf + first_digit)
        if(cpf.slice(-2) === (String(first_digit) + String(second_digit))){
            return true
        }
        return false
    }, [])
    
    return { validate_cpf_algorithm }
}