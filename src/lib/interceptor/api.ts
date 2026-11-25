import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL
const isBrowser = typeof window !== 'undefined'

const api = axios.create({ baseURL, timeout: 15000 })

let refreshing: Promise<string> | null = null

const refreshAccessToken = () => {
    refreshing ??= (async () => {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('no refresh token')

        const { data } = await axios.post('/api/auth/refresh', { token: refresh }, { baseURL })

        localStorage.setItem('access_token', data.accessToken)
        if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken)
        return data.accessToken as string
    })().finally(() => {
        refreshing = null
    })
    return refreshing
}

api.interceptors.request.use((config) => {
    if (isBrowser) {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (!isBrowser) return Promise.reject(error)

        const original = error.config
        const isAuthRequest = original?.url?.includes('auth/')

        if (error.response?.status === 401 && original && !isAuthRequest && !original._retry) {
            original._retry = true
            try {
                const token = await refreshAccessToken()
                original.headers.Authorization = `Bearer ${token}`
                return api(original)
            } catch {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
