import api from '@/lib/interceptor/api'
import { text, type Raw } from '@/lib/Api/shared'

export type AdminLocation = {
    id: string
    areaName: string
    lat: number
    lng: number
}

export type AdminLocationBody = {
    area_name: string
    lat: number
    lng: number
}

export type AdminLocationsQuery = {
    page: number
    limit: number
    areaName?: string
}

const toAdminLocation = (raw: Raw): AdminLocation => ({
    id: text(raw.id),
    areaName: text(raw.areaName) || text(raw.area_name),
    lat: Number(raw.lat) || 0,
    lng: Number(raw.lng) || 0,
})

export const getAdminLocations = async ({ page, limit, areaName }: AdminLocationsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/locations', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(areaName?.trim() ? { area_name: areaName.trim() } : {}) },
    })
    const locations = (data.data ?? []).map(toAdminLocation)
    return { locations, totalCount: data.totalCount ?? locations.length }
}

export const createAdminLocation = async (body: AdminLocationBody) => {
    const { data } = await api.post('/api/locations', body)
    return data
}

export const updateAdminLocation = async (id: string, body: AdminLocationBody) => {
    const { data } = await api.put(`/api/locations/${encodeURIComponent(id)}`, body)
    return data
}

export const deleteAdminLocation = async (id: string) => {
    const { data } = await api.delete(`/api/locations/${encodeURIComponent(id)}`)
    return data
}
