import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

const api = axios.create({ baseURL, timeout: 15000 })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config
        const isAuthRequest = original?.url?.includes('auth/')

        if (error.response?.status === 401 && !isAuthRequest && !original._retry) {
            original._retry = true
            try {
                const refresh = localStorage.getItem('refresh_token')
                if (!refresh) throw new Error('no refresh token')

                const { data } = await axios.post(`${baseURL}api/auth/refresh`, {
                    token: refresh,
                })

                localStorage.setItem('access_token', data.accessToken)
                original.headers.Authorization = `Bearer ${data.accessToken}`
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