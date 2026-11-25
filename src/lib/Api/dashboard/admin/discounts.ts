import api from '@/lib/interceptor/api'
import { text, type Raw } from '@/lib/Api/shared'
import { getBookingHouse } from './houses'
import { fetchAllPages } from './pagination'

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
