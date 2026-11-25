import api from '@/lib/interceptor/api'
import { first, number, obj, text } from '@/lib/Api/shared'

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
