import ax from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

export const axiosAuth = ax.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json',},
})

export const axios = ax.create({
    baseURL: BASE_URL,
})

