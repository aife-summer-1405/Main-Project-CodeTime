import api from '@/lib/interceptor/api'
import { text, type Raw } from '@/lib/Api/shared'

export type AdminCategory = {
    id: string
    name: string
}

export type AdminCategoriesQuery = {
    page: number
    limit: number
    name?: string
}

const toAdminCategory = (raw: Raw): AdminCategory => ({ id: text(raw.id), name: text(raw.name) })

export const getAdminCategories = async ({ page, limit, name }: AdminCategoriesQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/categories', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(name?.trim() ? { name: name.trim() } : {}) },
    })
    const categories = (data.data ?? []).map(toAdminCategory)
    return { categories, totalCount: data.totalCount ?? categories.length }
}

export const createAdminCategory = async (name: string) => {
    const { data } = await api.post('/api/categories', { name })
    return data
}

export const updateAdminCategory = async (id: string, name: string) => {
    const { data } = await api.put(`/api/categories/${encodeURIComponent(id)}`, { name })
    return data
}

export const deleteAdminCategory = async (id: string) => {
    const { data } = await api.delete(`/api/categories/${encodeURIComponent(id)}`)
    return data
}
