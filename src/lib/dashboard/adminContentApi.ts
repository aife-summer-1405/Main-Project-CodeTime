import api from '../interceptor/api'
import { getBookingHouse } from './adminApi'

type Raw = Record<string, unknown>

const LIMIT = 100

const text = (value: unknown) => (value === undefined || value === null ? '' : String(value))

const fetchAllPages = async (path: string, params: Record<string, string | number> = {}) => {
    const read = async (page: number) => {
        const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>(path, { params: { page, limit: LIMIT, ...params } })
        return { rows: data.data ?? [], total: data.totalCount ?? 0 }
    }
    const first = await read(1)
    const pages = Math.ceil(first.total / LIMIT)
    if (pages <= 1) return first.rows
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => read(i + 2)))
    return [...first.rows, ...rest.flatMap((r) => r.rows)]
}

export type AdminNotification = {
    id: string
    userId: string
    title: string
    message: string
    type: string
    isRead: boolean
    offerId: string | null
    createdAt: string | null
}

const toAdminNotification = (raw: Raw): AdminNotification => {
    const data = (raw.data && typeof raw.data === 'object' ? raw.data : {}) as Raw
    const offerId = Number(data.offerId)
    return {
        id: text(raw.id),
        userId: text(raw.userId),
        title: text(raw.title),
        message: text(raw.message),
        type: text(raw.type),
        isRead: Boolean(raw.isRead),
        offerId: Number.isFinite(offerId) ? String(offerId) : null,
        createdAt: text(raw.createdAt) || text(raw.created_at) || null,
    }
}

export const getAllAdminNotifications = async () => {
    const rows = await fetchAllPages('/api/notifications')
    return rows
        .map(toAdminNotification)
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
}

export type AdminDiscount = {
    id: string
    houseId: string
    code: string
    percentage: number
    validUntil: string | null
}

export type AdminDiscountBody = {
    code: string
    house_id: number
    discount_percentage: number
    valid_until: string
}

const toAdminDiscount = (raw: Raw): AdminDiscount => ({
    id: text(raw.id),
    houseId: text(raw.house_id),
    code: text(raw.code),
    percentage: Number(raw.discount_percentage) || 0,
    validUntil: text(raw.valid_until) || null,
})

export const getAllAdminDiscounts = async () => {
    const rows = await fetchAllPages('/api/discount-codes', { sort: 'id', order: 'DESC' })
    return rows.map(toAdminDiscount)
}

export const createAdminDiscount = async (body: AdminDiscountBody) => {
    const { data } = await api.post('/api/discount-codes', body)
    return data
}

export const updateAdminDiscount = async (id: string, body: AdminDiscountBody) => {
    const { data } = await api.put(`/api/discount-codes/${encodeURIComponent(id)}`, body)
    return data
}

export const deleteAdminDiscount = async (id: string) => {
    const { data } = await api.delete(`/api/discount-codes/${encodeURIComponent(id)}`)
    return data
}

export const getHouseTitle = async (id: string) => {
    const house = await getBookingHouse(id)
    return house.title
}
