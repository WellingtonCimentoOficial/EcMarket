import ax from 'axios'

export const axiosAuth = ax.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
    }
})

export const axios = ax.create({
    baseURL: 'http://127.0.0.1:8000',
})

