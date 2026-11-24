import api from '../interceptor/api'
import type { Hotel } from './house'

export type RentHouse = Hotel & {
    rent_price: number | null
    area: number | null
}

export type RentCategory = { id: string; name: string }
export type RentLocation = { id: string; name: string }

export type RentQuery = {
    page: number
    limit: number
    search: string
    transactionType: string
    sort: string
    location: string
    category: string
    minArea: string
    maxArea: string
    minPrice: string
    maxPrice: string
    minRent: string
    maxRent: string
}

type Raw = Record<string, unknown>

const SORTS: Record<string, { sort: string; order: string }> = {
    newest: { sort: 'last_updated', order: 'DESC' },
    oldest: { sort: 'last_updated', order: 'ASC' },
    cheapest: { sort: 'price', order: 'ASC' },
    expensive: { sort: 'price', order: 'DESC' },
}

const FILTER_PARAMS = [
    ['search', 'search'],
    ['location', 'location'],
    ['category', 'category'],
    ['minArea', 'minArea'],
    ['maxArea', 'maxArea'],
    ['minPrice', 'minPrice'],
    ['maxPrice', 'maxPrice'],
    ['minRent', 'minRent'],
    ['maxRent', 'maxRent'],
] as const

const num = (value: unknown) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

const positive = (value: unknown) => {
    if (value === null || value === undefined || value === '') return null
    const n = Number(value)
    return Number.isFinite(n) && n > 0 ? n : null
}

const strings = (value: unknown) => (Array.isArray(value) ? value.map(String) : [])

const record = (value: unknown): Raw =>
    value && typeof value === 'object' && !Array.isArray(value) ? (value as Raw) : {}

const toRentHouse = (raw: Raw): RentHouse => ({
    ...(raw as unknown as Hotel),
    rate: num(raw.rate),
    price: num(raw.price),
    discounted_price: positive(raw.discounted_price),
    discount_percentage: 0,
    photos: strings(raw.photos),
    tags: strings(raw.tags),
    rooms: num(raw.rooms),
    bathrooms: num(raw.bathrooms),
    parking: num(raw.parking),
    yard_type: typeof raw.yard_type === 'string' ? raw.yard_type : '',
    rent_price: positive(raw.rent_price ?? raw.rent),
    area: positive(raw.area ?? raw.metrage),
})

export async function getRentHouses(q: RentQuery, signal?: AbortSignal) {
    const sort = SORTS[q.sort] ?? SORTS.newest
    const params: Record<string, string | number> = {
        page: q.page,
        limit: q.limit,
        transactionType: q.transactionType,
        sort: sort.sort,
        order: sort.order,
    }

    FILTER_PARAMS.forEach(([field, param]) => {
        const value = q[field]
        if (value) params[param] = value
    })

    const { data } = await api.get<Raw>('/api/houses', { params, signal })
    const inner = record(data.data)
    const list = (data.houses ?? inner.houses ?? (Array.isArray(data.data) ? data.data : [])) as Raw[]
    const total = num(data.totalCount ?? inner.totalCount ?? data.total ?? inner.total) || list.length

    return { houses: list.map(toRentHouse), total }
}

export async function getRentCategories(signal?: AbortSignal): Promise<RentCategory[]> {
    const { data } = await api.get<{ data?: Raw[] }>('/api/categories', {
        params: { page: 1, limit: 50 },
        signal,
    })
    return (data.data ?? []).map((item) => ({ id: String(item.id), name: String(item.name ?? '') })).filter((c) => c.name)
}

export async function getRentLocations(signal?: AbortSignal): Promise<RentLocation[]> {
    const { data } = await api.get<{ data?: Raw[] }>('/api/locations', {
        params: { page: 1, limit: 100 },
        signal,
    })
    const seen = new Set<string>()
    const result: RentLocation[] = []
    ;(data.data ?? []).forEach((item) => {
        const name = String(item.area_name ?? item.areaName ?? '').trim()
        if (!name || seen.has(name)) return
        seen.add(name)
        result.push({ id: String(item.id), name })
    })
    return result
}
