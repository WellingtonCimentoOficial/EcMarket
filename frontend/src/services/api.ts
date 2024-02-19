import ax from 'axios'

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

export const axiosAuth = ax.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const axios = ax.create({
    baseURL: BASE_URL,
})

