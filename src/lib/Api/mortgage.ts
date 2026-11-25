import { getHotelById, normalizeHotel, type ApiHotel, type Hotel } from './house'
import { getUserById, type UserProfile } from './user'

export type MortgageHouse = Hotel & {
    rent_price?: number | null
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export async function getMortgageById(id: string): Promise<MortgageHouse> {
    return getHotelById(id) as Promise<MortgageHouse>
}

export async function getMortgageHouses(signal?: AbortSignal): Promise<Hotel[]> {
    const params = new URLSearchParams({ page: '1', limit: '50', transactionType: 'mortgage' })
    const res = await fetch(`${BASE_URL}/api/houses?${params.toString()}`, { signal })
    if (!res.ok) throw new Error('request failed')
    const json = await res.json()
    const houses: ApiHotel[] = json.houses ?? json.data?.houses ?? []
    return houses.map(normalizeHotel)
}

export async function getSeller(sellerId: string | number): Promise<UserProfile> {
    const { user } = await getUserById(sellerId)
    return user
}

export const maskPhone = (phone?: string | null) =>
    phone && phone.length >= 8 ? `${phone.slice(0, 4)}***${phone.slice(-4)}` : '—'
