import api from '@/lib/interceptor/api'
import { transactionKey } from '../common/transactions'
import { number, obj, text } from '@/lib/Api/shared'

export type SellerHouse = {
    id: string
    title: string
    address: string
    caption: string
    photo: string | null
    rate: number
    price: number
    discountedPrice: number | null
    tags: string[]
    lastUpdated: string | null
    capacity: number
    category: string
    transactionType: string
    comments: number
}

const firstPhoto = (photos: unknown): string | null => {
    if (!Array.isArray(photos) || photos.length === 0) return null
    const first = photos[0]
    if (typeof first === 'string') return first
    const url = obj(first).url ?? obj(first).path
    return typeof url === 'string' ? url : null
}

export const toSellerHouse = (input: unknown): SellerHouse => {
    const house = obj(input)
    return {
        id: text(house.id),
        title: text(house.title),
        address: text(house.address),
        caption: text(house.caption),
        photo: firstPhoto(house.photos),
        rate: number(house.rate),
        price: number(house.price),
        discountedPrice: house.discounted_price == null ? null : number(house.discounted_price),
        tags: Array.isArray(house.tags) ? house.tags.map(text) : [],
        lastUpdated: text(house.last_updated) || null,
        capacity: number(house.capacity),
        category: text(obj(house.categories).name),
        transactionType: transactionKey(text(house.transaction_type)),
        comments: number(house.num_comments),
    }
}

const PAGE_SIZE = 50
const MAX_PAGES = 20

export type SellerHouseFilters = {
    transactionType?: string
    search?: string
    minPrice?: number
    maxPrice?: number
}

export const getSellerHouses = async (
    filters: SellerHouseFilters = {}
): Promise<{ houses: SellerHouse[]; totalCount: number }> => {
    const { transactionType, search, minPrice, maxPrice } = filters
    const houses: SellerHouse[] = []
    let total = 0

    for (let page = 1; page <= MAX_PAGES; page++) {
        const { data } = await api.get<{ houses?: unknown[]; totalCount?: number }>('/api/houses/seller/user', {
            params: {
                page,
                limit: PAGE_SIZE,
                sort: 'last_updated',
                order: 'DESC',
                ...(transactionType ? { transaction_type: transactionKey(transactionType) } : {}),
                ...(search?.trim() ? { search: search.trim() } : {}),
                ...(minPrice && minPrice > 0 ? { minPrice } : {}),
                ...(maxPrice && maxPrice > 0 ? { maxPrice } : {}),
            },
        })

        const batch = (data.houses ?? []).map(toSellerHouse)
        houses.push(...batch)
        total = data.totalCount ?? houses.length

        if (batch.length === 0 || houses.length >= total) break
    }

    return { houses, totalCount: total }
}

export const deleteSellerHouse = async (id: string): Promise<string> => {
    const { data } = await api.delete<{ message?: string }>(`/api/houses/${encodeURIComponent(id)}`)
    return data?.message ?? ''
}

export type CreateHousePayload = {
    title: string
    caption: string
    address: string
    price: string
    discounted_price: string | null
    capacity: number
    tags: string[]
    categories: { name: string }
    rooms: number
    bathrooms: number
    parking: number
    transaction_type: string
    yard_type?: string
    rate?: string
    location?: { lat: number; lng: number }
}

export type UpdateHousePayload = CreateHousePayload & { photos: string[] }

export type HouseDetail = {
    title: string
    caption: string | null
    address: string
    price: string
    discounted_price: string | null
    rate: string | null
    capacity: number | null
    tags: string[] | null
    photos: string[] | null
    categories: { name: string } | null
    rooms: number | null
    bathrooms: number | null
    parking: number | null
    yard_type: string | null
    transaction_type: string
    location: { lat: number; lng: number } | null
}

export const getSellerHouse = async (id: string): Promise<HouseDetail> => {
    const { data } = await api.get(`/api/houses/${encodeURIComponent(id)}`)
    return data.house ?? data.data ?? data
}

export const updateSellerHouse = async (id: string, payload: UpdateHousePayload) => {
    await api.put(`/api/houses/${encodeURIComponent(id)}`, {
        ...payload,
        discounted_price: payload.discounted_price || null,
        transaction_type: transactionKey(payload.transaction_type),
    })
}

export const createSellerHouse = async (payload: CreateHousePayload): Promise<string> => {
    const { data } = await api.post<unknown>('/api/houses', {
        ...payload,
        discounted_price: payload.discounted_price || null,
        transaction_type: transactionKey(payload.transaction_type),
    })
    const house = obj(data)
    const id = text(house.id || obj(house.house).id)
    if (!id) throw new Error('شناسهٔ ملک از سرور دریافت نشد')
    return id
}

export const uploadHousePhotos = async (id: string, files: File[]) => {
    const body = new FormData()
    files.forEach((file) => body.append('photos', file))
    await api.post(`/api/houses/upload/photos/${encodeURIComponent(id)}`, body)
}