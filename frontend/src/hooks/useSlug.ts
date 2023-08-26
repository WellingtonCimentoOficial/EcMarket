import React from 'react'

export const useSlug = () => {
    const createSlug = (string: String): string => {
        const string_formatted = string.trim().replace(/[^\w\s-]/g, '').toLowerCase().replace(/[\s]+/g, '-')
        return string_formatted
    }

    return { createSlug }
}