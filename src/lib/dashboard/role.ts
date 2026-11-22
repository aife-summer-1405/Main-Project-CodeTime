import type { Role } from './config'

export const ACCESS_KEY = 'access_token'
export const ROLE_KEY = 'user_role'
export const DEV_ROLE_KEY = 'dev_role'

const aliases: Record<string, Role> = {
    buyer: 'buyer',
    seller: 'seller',
}

export const normalizeRole = (value: unknown): Role | null => {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first !== 'string') return null
    return aliases[first.trim().toLowerCase()] ?? null
}

const decodePayload = (token: string): Record<string, unknown> | null => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const bytes = atob(base64)
            .split('')
            .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
            .join('')
        return JSON.parse(decodeURIComponent(bytes))
    } catch {
        return null
    }
}

export const isLoggedIn = () => !!localStorage.getItem(ACCESS_KEY)

export const readRole = (): Role | null => {
    if (process.env.NODE_ENV !== 'production') {
        const dev = normalizeRole(localStorage.getItem(DEV_ROLE_KEY))
        if (dev) return dev
    }

    const token = localStorage.getItem(ACCESS_KEY)
    const payload = token ? decodePayload(token) : null

    const fromToken = payload
        ? (normalizeRole(payload.role) ??
          normalizeRole(payload.roles) ??
          normalizeRole(payload.userRole) ??
          normalizeRole(payload.user_type) ??
          normalizeRole(payload.type))
        : null

    return fromToken ?? normalizeRole(localStorage.getItem(ROLE_KEY))
}

export const saveRole = (value: unknown): Role | null => {
    const role = normalizeRole(value)
    if (role) localStorage.setItem(ROLE_KEY, role)
    return role
}
