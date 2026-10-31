export type Hotel = {
    id: string
    title: string
    address: string
    photos: string[]
    rate: number
    price: number
    // still is not clear what is the type :|
    discounted_price: string | number | null
    tags: string[]
    last_updated: string
    capacity: number
    location: { lat: number; lng: number }
    categories: { name: string }
    bathrooms: number
    parking: number
    rooms: number
    yard_type: string
    num_comments: number
    discount_id: string
    transaction_type: string
    sellerId: string
    sellerName: string
    caption: string
    bookings: number
    favoriteId: string
    isFavorite: boolean
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

type ApiHotel = Omit<Hotel, 'rate' | 'price' | 'discounted_price' | 'photos' | 'tags' | 'rooms' | 'bathrooms' | 'parking'> & {
    rate: string
    price: string
    discounted_price: string | null
    photos: string[] | null
    tags: string[] | null
    rooms: number | null
    bathrooms: number | null
    parking: number | null
}

const normalize = (h: ApiHotel): Hotel => ({
    ...h,
    rate: Number(h.rate) || 0,
    price: Number(h.price) || 0,
    discounted_price: h.discounted_price ? Number(h.discounted_price) : null,
    photos: h.photos ?? [],
    tags: h.tags ?? [],
    rooms: h.rooms ?? 0,
    bathrooms: h.bathrooms ?? 0,
    parking: h.parking ?? 0,
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
    return houses.map(normalize)
}

export const filterByCounts = (hotels: Hotel[], c: CountFilters): Hotel[] =>
    hotels.filter(
        (h) =>
            h.rooms >= c.rooms &&
            h.bathrooms >= c.bathrooms &&
            h.bathrooms >= c.toilets &&
            h.parking >= c.parking
    )