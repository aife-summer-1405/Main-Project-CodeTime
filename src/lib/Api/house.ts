export type Hotel = {
    id: number
    title: string
    location: string
    rating: number
    price: number
    oldPrice: number
    discount: number
    photos: string
    image: string
    lat: number
    lng: number
    rooms: number
    bathrooms: number
    parking: number
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

type ApiHouse = {
    id: string
    title: string
    address: string
    photos: string[] | null
    rate: string
    price: string
    discounted_price: string | null
    location: { lat: number; lng: number } | null
    rooms: number | null
    bathrooms: number | null
    parking: number | null
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const SORTS: Record<string, { sort: string; order: string }> = {
    newest: { sort: 'last_updated', order: 'DESC' },
    cheapest: { sort: 'price', order: 'ASC' },
    expensive: { sort: 'price', order: 'DESC' },
}

const toHotel = (h: ApiHouse): Hotel => {
    const base = Number(h.price)
    const sale = h.discounted_price ? Number(h.discounted_price) : 0
    const hasDiscount = sale > 0 && sale < base
    const photo = h.photos?.[0] ?? ''

    return {
        id: Number(h.id),
        title: h.title,
        location: h.address,
        rating: Number(h.rate) || 0,
        price: hasDiscount ? sale : base,
        oldPrice: hasDiscount ? base : 0,
        discount: hasDiscount ? Math.round((1 - sale / base) * 100) : 0,
        photos: photo,
        image: photo,
        lat: h.location?.lat ?? 0,
        lng: h.location?.lng ?? 0,
        rooms: h.rooms ?? 0,
        bathrooms: h.bathrooms ?? 0,
        parking: h.parking ?? 0,
    }
}

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
    const houses: ApiHouse[] = json.houses ?? json.data?.houses ?? []
    return houses.map(toHotel)
}

export const filterByCounts = (hotels: Hotel[], c: CountFilters): Hotel[] =>
    hotels.filter(
        (h) =>
            h.rooms >= c.rooms &&
            h.bathrooms >= c.bathrooms &&
            h.bathrooms >= c.toilets &&
            h.parking >= c.parking
    )