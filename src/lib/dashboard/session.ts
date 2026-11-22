import { logoutUser } from '@/lib/Api/authApi'
import { ACCESS_KEY, ROLE_KEY } from './role'

const sessionKeys = [ACCESS_KEY, 'refresh_token', 'userId', ROLE_KEY]

export const clearSession = () => sessionKeys.forEach((key) => localStorage.removeItem(key))

export const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    try {
        if (refreshToken) await logoutUser({ refreshToken })
    } catch {
    } finally {
        clearSession()
    }
}
