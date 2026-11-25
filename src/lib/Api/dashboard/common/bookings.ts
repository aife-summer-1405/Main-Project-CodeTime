import api from '@/lib/interceptor/api'
import type { SellerBooking } from '@/lib/dashboard/seller-data'

export type DetailedBooking = SellerBooking & { photos?: string[] }

export type BookingDetail = {
    id: number
    houseId?: string | number
    reservedDates?: string[]
    traveler_details?: {
        firstName?: string
        lastName?: string
        gender?: string
        birthDate?: string
        nationalId?: string
    }[]
    status?: string
    sharedEmail?: string | null
    sharedMobile?: string | null
    createdAt?: string
}

export type HouseDetail = {
    id: string
    title?: string
    address?: string
    photos?: string[]
    rate?: string | number
    discounted_price?: string | number | null
    price?: string | number
    tags?: string[]
    caption?: string
    capacity?: number
    bathrooms?: number
    parking?: number
    rooms?: number
    yard_type?: string
}

const faNum = (n: number) => n.toLocaleString('fa-IR')

export const cancelBooking = async (id: string) => {
    await api.post(`/api/bookings/${encodeURIComponent(id)}/cancel`)
}

export const continueBooking = async (id: string) => {
    await api.post(`/api/bookings/${encodeURIComponent(id)}/continue`)
}

export async function getBookingById(id: string | number): Promise<BookingDetail> {
    const res = await api.get(`/api/bookings/${id}`)
    return res.data.booking
}

export async function getHouseById(id: string | number): Promise<HouseDetail> {
    const res = await api.get(`/api/houses/${id}`)
    return res.data
}

export function mergeBookingDetail(base: DetailedBooking, d: BookingDetail): DetailedBooking {
    const dates = [...(d.reservedDates ?? [])].sort()
    return {
        ...base,
        checkIn: dates[0] ?? base.checkIn,
        checkOut: dates[dates.length - 1] ?? base.checkOut,
        travelers: d.traveler_details
            ? d.traveler_details.map((t) => ({
                name: `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim(),
                gender: t.gender === 'female' ? ('female' as const) : ('male' as const),
                phone: d.sharedMobile ?? '',
            }))
            : base.travelers,
    }
}

export function mergeHouseDetail(base: DetailedBooking, h: HouseDetail): DetailedBooking {
    const features = [
        h.parking ? `${faNum(h.parking)} پارکینگ` : '',
        h.rooms ? `${faNum(h.rooms)} خواب` : '',
        h.yard_type ?? '',
        h.bathrooms ? `${faNum(h.bathrooms)} حمام` : '',
        h.capacity ? `ظرفیت ${faNum(h.capacity)} نفر` : '',
    ].filter(Boolean)

    const photos = h.photos ?? []

    return {
        ...base,
        title: h.title || base.title,
        address: h.address || base.address,
        rating: Number(h.rate) || base.rating,
        propertyPrice: Number(h.price) || base.propertyPrice,
        description: h.caption || base.description,
        tags: h.tags?.length ? h.tags : base.tags,
        features: features.length ? features : base.features,
        photos,
        image: photos[0] ?? base.image,
    }
}

export async function getFullBookingDetail(base: DetailedBooking): Promise<DetailedBooking> {
    const booking = await getBookingById(base.id)
    let result = mergeBookingDetail(base, booking)

    if (booking.houseId !== undefined && booking.houseId !== null && booking.houseId !== '') {
        try {
            const house = await getHouseById(booking.houseId)
            result = mergeHouseDetail(result, house)
        } catch {
            return result
        }
    }

    return result
}
