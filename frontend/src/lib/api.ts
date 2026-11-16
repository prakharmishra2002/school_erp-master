import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api

// API helper types
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface PaginatedResponse<T> {
    success: boolean
    data: {
        items: T[]
        total: number
        page: number
        per_page: number
        last_page: number
    }
    error?: string
}
