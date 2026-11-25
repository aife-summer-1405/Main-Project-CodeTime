import api from '@/lib/interceptor/api'
import { number, obj, strings, text, type Raw } from '@/lib/Api/shared'
import { transactionKey } from '../common/transactions'

export type AdminHouse = {
    id: string
    title: string
    address: string
    caption: string
    photos: string[]
    rate: number
    price: number
    discountedPrice: number | null
    tags: string[]
    lastUpdated: string | null
    capacity: number
    location: { lat: number; lng: number } | null
    category: string
    bathrooms: number
    parking: number
    rooms: number
    yardType: string
    comments: number
    transactionType: string
    sellerId: string
    sellerName: string
}

export type AdminHouseBody = {
    title: string
    address: string
    caption: string | null
    rate: number
    price: number
    discounted_price: number | null
    photos: string[]
    tags: string[]
    last_updated: string
    capacity: number
    location?: { lat: number; lng: number }
    categories: { name: string }
    bathrooms: number
    parking: number
    rooms: number
    yard_type: string
    num_comments: number
    transaction_type: string
}

export type AdminHousesQuery = {
    page: number
    limit: number
    sellerId?: string
    price?: string
}

const toLocation = (value: unknown) => {
    const raw = obj(value)
    const lat = Number(raw.lat)
    const lng = Number(raw.lng)
    return raw.lat != null && raw.lng != null && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
}

const toAdminHouse = (raw: Raw): AdminHouse => ({
    id: text(raw.id),
    title: text(raw.title),
    address: text(raw.address),
    caption: text(raw.caption),
    photos: strings(raw.photos),
    rate: number(raw.rate),
    price: number(raw.price),
    discountedPrice: raw.discounted_price == null ? null : number(raw.discounted_price),
    tags: strings(raw.tags),
    lastUpdated: text(raw.last_updated) || null,
    capacity: number(raw.capacity),
    location: toLocation(raw.location),
    category: text(obj(raw.categories).name),
    bathrooms: number(raw.bathrooms),
    parking: number(raw.parking),
    rooms: number(raw.rooms),
    yardType: text(raw.yard_type),
    comments: number(raw.num_comments),
    transactionType: transactionKey(text(raw.transaction_type)),
    sellerId: text(raw.sellerId),
    sellerName: text(raw.sellerName),
})

export const getAdminHouses = async ({ page, limit, sellerId, price }: AdminHousesQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/houses', {
        params: {
            page,
            limit,
            sort: 'created_at',
            order: 'DESC',
            ...(sellerId ? { sellerId } : {}),
            ...(price ? { price } : {}),
        },
    })
    const houses = (data.data ?? []).map(toAdminHouse)
    return { houses, totalCount: data.totalCount ?? houses.length }
}

export const updateAdminHouse = async (id: string, body: AdminHouseBody) => {
    const { data } = await api.put(`/api/admin/houses/${encodeURIComponent(id)}`, {
        ...body,
        transaction_type: transactionKey(body.transaction_type),
    })
    return data
}

export const deleteAdminHouse = async (id: string) => {
    const { data } = await api.delete(`/api/admin/houses/${encodeURIComponent(id)}`)
    return data
}

export type BookingHouse = Pick<
    AdminHouse,
    'id' | 'title' | 'address' | 'caption' | 'photos' | 'rate' | 'price' | 'discountedPrice' | 'tags' | 'capacity' | 'category' | 'bathrooms' | 'parking' | 'rooms' | 'transactionType'
>

export const getBookingHouse = async (id: string): Promise<BookingHouse> => {
    const { data } = await api.get<Raw>(`/api/houses/${encodeURIComponent(id)}`)
    const house = toAdminHouse(obj(data.house ?? data.data ?? data))
    return {
        id: house.id || id,
        title: house.title,
        address: house.address,
        caption: house.caption,
        photos: house.photos,
        rate: house.rate,
        price: house.price,
        discountedPrice: house.discountedPrice,
        tags: house.tags,
        capacity: house.capacity,
        category: house.category,
        bathrooms: house.bathrooms,
        parking: house.parking,
        rooms: house.rooms,
        transactionType: house.transactionType,
    }
}
