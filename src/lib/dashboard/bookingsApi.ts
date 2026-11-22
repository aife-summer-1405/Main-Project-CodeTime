import api from '../interceptor/api'
import type { SellerBooking } from './seller-data'

export type BookingGroup = 'success' | 'pending' | 'cancel'

export type Traveler = { name: string; gender: string; nationalId: string }

export type Reservation = {
    id: string
    houseId: string | null
    title: string
    address: string
    image: string | null
    checkIn: string | null
    checkOut: string | null
    createdAt: string | null
    price: number
    status: string
    group: BookingGroup
    travelers: Traveler[]
    email: string
    mobile: string
}

export type ReservationsResponse = { reservations: Reservation[]; totalCount: number }

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

type Raw = Record<string, unknown>

export const obj = (value: unknown): Raw => (value && typeof value === 'object' ? (value as Raw) : {})
export const text = (value: unknown) => (value === undefined || value === null ? '' : String(value))
export const first = (...values: unknown[]) => values.find((v) => v !== undefined && v !== null && v !== '')
export const number = (value: unknown) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

const faNum = (n: number) => n.toLocaleString('fa-IR')

const successStatuses = ['confirmed', 'conformed', 'approved', 'completed', 'paid', 'success', 'active']
const cancelStatuses = ['canceled', 'cancelled', 'rejected', 'failed', 'expired']

export const groupOf = (status: string): BookingGroup => {
    const value = status.toLowerCase()
    if (successStatuses.includes(value)) return 'success'
    if (cancelStatuses.includes(value)) return 'cancel'
    return 'pending'
}

export const normalizeBooking = (input: unknown): Reservation => {
    const booking = obj(input)
    const house = obj(first(booking.house, booking.House, booking.property))
    const dates = Array.isArray(booking.reservedDates) ? booking.reservedDates : []
    const photos = first(house.photos, booking.photos)
    const rawTravelers = first(booking.traveler_details, booking.travelerDetails, booking.travelers)
    const status = text(booking.status) || 'pending'
    const houseId = first(booking.houseId, booking.house_id, house.id)

    return {
        id: text(booking.id),
        houseId: houseId === undefined ? null : text(houseId),
        title: text(first(house.title, booking.houseTitle, booking.title)) || (houseId ? `ملک شماره ${text(houseId)}` : 'اقامتگاه'),
        address: text(first(house.address, booking.address)),
        image: Array.isArray(photos) && typeof photos[0] === 'string' ? photos[0] : null,
        checkIn: dates[0] ? text(dates[0]) : null,
        checkOut: dates[1] ? text(dates[1]) : null,
        createdAt: text(first(booking.createdAt, booking.created_at)) || null,
        price: number(first(booking.totalPrice, booking.total_price, booking.amount, booking.price, house.price)),
        status,
        group: groupOf(status),
        travelers: (Array.isArray(rawTravelers) ? rawTravelers : []).map((t) => {
            const traveler = obj(t)
            return {
                name: `${text(traveler.firstName)} ${text(traveler.lastName)}`.trim(),
                gender: text(traveler.gender),
                nationalId: text(traveler.nationalId),
            }
        }),
        email: text(first(booking.sharedEmail, booking.email)),
        mobile: text(first(booking.sharedMobile, booking.mobile)),
    }
}

export const getCustomerBookings = async (userId: string, page = 1, limit = 100): Promise<ReservationsResponse> => {
    const { data } = await api.get<{ bookings?: unknown[]; totalCount?: number }>(`/api/bookings/${userId}/customers`, {
        params: { page, limit, sort: 'created_at', order: 'DESC' },
    })

    return {
        reservations: (data.bookings ?? []).map(normalizeBooking),
        totalCount: data.totalCount ?? 0,
    }
}

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