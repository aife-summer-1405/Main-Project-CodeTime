import api from "../interceptor/api"

export type Hotel = {
    id: string
    title: string
    address: string
    photos: string[]
    rate: number
    price: number
    discounted_price: number | null
    discount_percentage: number
    tags: string[]
    last_updated: string
    capacity: number
    location: { lat: number; lng: number; }
    categories: { name: string }
    bathrooms: number
    parking: number
    rooms: number
    yard_type: string
    num_comments: number
    discount_id: string | null
    transaction_type: string
    sellerId: string
    sellerName: string
    caption: string
    bookings: number
    favoriteId: string | null
    isFavorite: boolean
}

export type DiscountCode = {
    id: string
    house_id: string
    code: string
    discount_percentage: string
    valid_until: string
}

export type HotelQuery = {
    query: string
    destination: string
    sort: string
    minPrice: string
    maxPrice: string
}

export type CountFilters = {
    rooms: number
    bathrooms: number
    toilets: number
    parking: number
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const SORTS: Record<string, { sort: string; order: string }> = {
    newest: { sort: 'last_updated', order: 'DESC' },
    cheapest: { sort: 'price', order: 'ASC' },
    expensive: { sort: 'price', order: 'DESC' },
}

type ApiHotel = Omit<
    Hotel,
    'rate' | 'price' | 'discounted_price' | 'discount_percentage' | 'photos' | 'tags' | 'rooms' | 'bathrooms' | 'parking'
> & {
    rate: string
    price: string
    discounted_price: string | null
    photos: string[] | null
    tags: string[] | null
    rooms: number | null
    bathrooms: number | null
    parking: number | null
}

const discountCache = new Map<string, Promise<number>>()

export function getDiscountPercentage(id: string | null): Promise<number> {
    if (!id) return Promise.resolve(0)

    const cached = discountCache.get(id)
    if (cached) return cached

    const request = api
        .get<DiscountCode>(`/api/discount-codes/${id}`)
        .then(({ data }) => {
            const expired = data.valid_until && new Date(data.valid_until) < new Date()
            return expired ? 0 : Math.round(Number(data.discount_percentage)) || 0
        })
        .catch(() => {
            discountCache.delete(id)
            return 0
        })

    discountCache.set(id, request)
    return request
}

const normalize = (h: ApiHotel): Hotel => {
    const discounted = h.discounted_price == null ? null : Number(h.discounted_price)

    return {
        ...h,
        rate: Number(h.rate) || 0,
        price: Number(h.price) || 0,
        discounted_price: discounted !== null && Number.isFinite(discounted) && discounted > 0 ? discounted : null,
        discount_percentage: 0,
        photos: h.photos ?? [],
        tags: h.tags ?? [],
        rooms: h.rooms ?? 0,
        bathrooms: h.bathrooms ?? 0,
        parking: h.parking ?? 0,
    }
}

const withDiscount = async (h: Hotel): Promise<Hotel> => ({
    ...h,
    discount_percentage: await getDiscountPercentage(h.discount_id),
})

export async function getHotels(q: HotelQuery, signal?: AbortSignal): Promise<Hotel[]> {
    const params = new URLSearchParams({ page: '1', limit: '50', transactionType: 'reservation' })

    if (q.query) params.set('search', q.query)
    if (q.destination) params.set('location', q.destination)
    if (q.minPrice) params.set('minPrice', q.minPrice)
    if (q.maxPrice) params.set('maxPrice', q.maxPrice)
    if (q.sort && SORTS[q.sort]) {
        params.set('sort', SORTS[q.sort].sort)
        params.set('order', SORTS[q.sort].order)
    }

    const res = await fetch(`${BASE_URL}/api/houses?${params.toString()}`, { signal })
    if (!res.ok) throw new Error('request failed')

    const json = await res.json()
    const houses: ApiHotel[] = json.houses ?? json.data?.houses ?? []
    return Promise.all(houses.map((h) => withDiscount(normalize(h))))
}

export async function getHotelById(id: string): Promise<Hotel> {
    const { data } = await api.get(`/api/houses/${id}`)

    return withDiscount(normalize(data.house ?? data.data ?? data))
}

export const filterByCounts = (hotels: Hotel[], c: CountFilters): Hotel[] =>
    hotels.filter(
        (h) =>
            h.rooms >= c.rooms &&
            h.bathrooms >= c.bathrooms &&
            h.bathrooms >= c.toilets &&
            h.parking >= c.parking
    )