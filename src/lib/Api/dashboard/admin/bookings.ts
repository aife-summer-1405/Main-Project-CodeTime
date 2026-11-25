import api from '@/lib/interceptor/api'
import { text, type Raw } from '@/lib/Api/shared'

export type BookingStatus = 'pending' | 'confirmed' | 'canceled'

export type AdminTraveler = {
    firstName: string
    lastName: string
    gender: string
    nationalId: string
    birthDate: string
}

export type AdminBooking = {
    id: string
    userId: string
    houseId: string
    reservedDates: string[]
    travelers: AdminTraveler[]
    status: BookingStatus
    sharedEmail: string
    sharedMobile: string
    createdAt: string | null
    updatedAt: string | null
}

export type AdminBookingBody = {
    houseId: string
    reservedDates: string[]
    traveler_details: AdminTraveler[]
    status: BookingStatus
    sharedEmail: string
    sharedMobile: string
}

export type AdminBookingsQuery = {
    page: number
    limit: number
    status?: BookingStatus | ''
    userId?: string
    houseId?: string
}

const bookingStatus = (value: unknown): BookingStatus => {
    const status = text(value).toLowerCase()
    if (status === 'confirmed') return 'confirmed'
    return status === 'canceled' || status === 'cancelled' ? 'canceled' : 'pending'
}

const toTraveler = (value: unknown): AdminTraveler => {
    const raw = (value && typeof value === 'object' ? value : {}) as Raw
    return {
        firstName: text(raw.firstName),
        lastName: text(raw.lastName),
        gender: text(raw.gender),
        nationalId: text(raw.nationalId),
        birthDate: text(raw.birthDate),
    }
}

const toAdminBooking = (raw: Raw): AdminBooking => ({
    id: text(raw.id),
    userId: text(raw.user_id),
    houseId: text(raw.houseId),
    reservedDates: Array.isArray(raw.reservedDates) ? raw.reservedDates.map(text) : [],
    travelers: Array.isArray(raw.traveler_details) ? raw.traveler_details.map(toTraveler) : [],
    status: bookingStatus(raw.status),
    sharedEmail: text(raw.sharedEmail),
    sharedMobile: text(raw.sharedMobile),
    createdAt: text(raw.createdAt) || null,
    updatedAt: text(raw.updatedAt) || null,
})

export const getAdminBookings = async ({ page, limit, status, userId, houseId }: AdminBookingsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/bookings', {
        params: {
            page,
            limit,
            sort: 'createdAt',
            order: 'DESC',
            ...(status ? { status } : {}),
            ...(userId ? { user_id: userId } : {}),
            ...(houseId ? { house_id: houseId } : {}),
        },
    })
    const bookings = (data.data ?? []).map(toAdminBooking)
    return { bookings, totalCount: data.totalCount ?? bookings.length }
}

export const getAdminBooking = async (id: string): Promise<AdminBooking> => {
    const { data } = await api.get<Raw>(`/api/admin/bookings/${encodeURIComponent(id)}`)
    const raw = data.booking ?? data.data ?? data
    return toAdminBooking((raw && typeof raw === 'object' ? raw : {}) as Raw)
}

export const updateAdminBooking = async (id: string, body: AdminBookingBody) => {
    const { data } = await api.put(`/api/admin/bookings/${encodeURIComponent(id)}`, {
        ...body,
        houseId: Number.isFinite(Number(body.houseId)) ? Number(body.houseId) : body.houseId,
    })
    return data
}

export const deleteAdminBooking = async (id: string) => {
    const { data } = await api.delete(`/api/admin/bookings/${encodeURIComponent(id)}`)
    return data
}
