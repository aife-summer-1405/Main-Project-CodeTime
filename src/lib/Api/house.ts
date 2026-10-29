const BASE = process.env.NEXT_PUBLIC_API_URL

export type ApiHouse = {
    id: string
    title: string
    address: string
    photos: string[]
    rate: string
    price: string
    discounted_price: string | null
    tags: string[]
    rooms: number
    bathrooms: number
    parking: number
    location: { lat: number; lng: number }
    transaction_type: 'reservation' | 'rental' | 'mortgage' | 'direct_purchase'
}

type ApiResponse = { houses: ApiHouse[]; totalCount: number }

export type City = 'rasht' | 'anzali' | 'tehran' | 'shiraz' | 'isfahan' | 'mashhad' | 'other'

export type Hotel = {
    id: number
    title: string
    city: City
    location: string
    nights: number
    oldPrice: number
    price: number
    rating: number
    discount: number
    image: string
    facilities: string[]
    beds: number
    baths: number
    toilets: number
    parking: number
    lat: number
    lng: number
}

const CITY_KEYWORDS: [City, string[]][] = [
    ['rasht', ['رشت']],
    ['anzali', ['انزلی']],
    ['tehran', ['تهران']],
    ['shiraz', ['شیراز']],
    ['isfahan', ['اصفهان']],
    ['mashhad', ['مشهد']],
]

const FACILITY_KEYWORDS: [string, string[]][] = [
    ['wifi', ['وای‌فای', 'وایفای', 'اینترنت']],
    ['parking', ['پارکینگ']],
    ['pool', ['استخر']],
    ['breakfast', ['صبحانه']],
    ['elevator', ['آسانسور']],
    ['heating', ['شوفاژ', 'گرمایش', 'بخاری']],
]

const detectCity = (address: string): City =>
    CITY_KEYWORDS.find(([, words]) => words.some((w) => address.includes(w)))?.[0] ?? 'other'

const detectFacilities = (tags: string[], parking: number): string[] => {
    const text = tags.join(' ')
    const found = FACILITY_KEYWORDS.filter(([, words]) => words.some((w) => text.includes(w))).map(([key]) => key)
    if (parking > 0 && !found.includes('parking')) found.push('parking')
    return found
}

export function mapHouse(h: ApiHouse): Hotel {
    const base = Number(h.price)
    const discounted = h.discounted_price ? Number(h.discounted_price) : null
    const hasDiscount = discounted !== null && discounted < base

    return {
        id: Number(h.id),
        title: h.title,
        city: detectCity(h.address),
        location: h.address,
        nights: 1, 
        oldPrice: base,
        price: hasDiscount ? discounted! : base,
        rating: Number(h.rate),
        discount: hasDiscount ? Math.round(((base - discounted!) / base) * 100) : 0,
        image: h.photos?.[0] ?? '',
        facilities: detectFacilities(h.tags ?? [], h.parking),
        beds: h.rooms,
        baths: h.bathrooms,
        toilets: h.bathrooms, 
        parking: h.parking,
        lat: h.location.lat,
        lng: h.location.lng,
    }
}

const LIMIT = 10
const MAX_PAGES = 20

export async function fetchAllHotels(signal?: AbortSignal): Promise<Hotel[]> {
    const all: ApiHouse[] = []
    let total = Infinity

    for (let page = 1; page <= MAX_PAGES && all.length < total; page++) {
        const res = await fetch(`${BASE}/api/houses?page=${page}&limit=${LIMIT}`, { signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data: ApiResponse = await res.json()
        total = data.totalCount
        if (!data.houses.length) break
        all.push(...data.houses)
    }

    return all.filter((h) => h.transaction_type === 'reservation').map(mapHouse)
}