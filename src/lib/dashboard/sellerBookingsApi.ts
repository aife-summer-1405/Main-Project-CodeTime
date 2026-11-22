import api from '../interceptor/api'
import { first, normalizeBooking, number, obj, text } from './bookingsApi'
import type { SellerBooking } from './seller-data'

const statusOf = { success: 'confirmed', pending: 'pending', cancel: 'canceled' } as const

const genderOf = (value: string) => (/^(female|f|woman|زن|خانم)$/i.test(value.trim()) ? 'female' : 'male')

export const toSellerBooking = (input: unknown): SellerBooking => {
    const base = normalizeBooking(input)
    const house = obj(first(obj(input).house, obj(input).House, obj(input).property))
    const features = [
        number(house.parking) ? `${number(house.parking)} پارکینگ` : '',
        number(house.rooms) ? `${number(house.rooms)} خواب` : '',
        number(house.bathrooms) ? `${number(house.bathrooms)} حمام` : '',
        text(house.yard_type),
    ].filter(Boolean)

    return {
        id: base.id,
        propertyId: base.houseId ?? '',
        title: base.title,
        image: base.image ?? '',
        address: base.address,
        description: text(house.caption),
        rating: number(house.rate),
        propertyPrice: number(house.price),
        features,
        tags: Array.isArray(house.tags) ? house.tags.map(text) : [],
        checkIn: base.checkIn ?? '',
        checkOut: base.checkOut ?? '',
        createdAt: base.createdAt ?? '',
        amount: base.price,
        status: statusOf[base.group],
        payment: base.group === 'success' ? 'paid' : 'unpaid',
        travelers: base.travelers.map((t) => ({ name: t.name, gender: genderOf(t.gender), phone: base.mobile })),
        payments: [],
        changes: [],
    }
}

export const getSellerBookings = async (userId: string): Promise<SellerBooking[]> => {
    const { data } = await api.get<{ bookings?: unknown[] }>(`/api/bookings/${userId}/customers`, {
        params: { page: 1, limit: 100, sort: 'created_at', order: 'DESC' },
    })
    return (data.bookings ?? []).map(toSellerBooking)
}