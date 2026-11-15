import { DateObject } from 'react-multi-date-picker'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { isAxiosError } from 'axios'
import api from '../interceptor/api'
import { toEnDigits } from '@/lib/utils/reserve'

export type Gender = 'male' | 'female'

export interface TravelerDetail {
    firstName: string
    lastName: string
    gender: Gender
    birthDate: string
    nationalId: string
}

export interface CreateBookingBody {
    houseId: number
    reservedDates: [string, string]
    traveler_details: TravelerDetail[]
    sharedEmail: string
    sharedMobile: string
}

export interface Booking extends CreateBookingBody {
    id: number
    user_id: number
    status: 'pending' | (string & {})
    created_at: string
    updated_at: string
    createdAt: string
    updatedAt: string
}

export interface BookingInput {
    houseId: string
    checkIn: string
    checkOut: string
    passengers: { fullName: string; gender: Gender; birthDate: string; nationalId: string }[]
    email: string
    phone: string
}

export const toApiDate = (d: DateObject) => new DateObject(d).convert(gregorian, gregorian_en).format('YYYY-MM-DD')

const splitName = (fullName: string) => {
    const [firstName, ...rest] = fullName.trim().split(/\s+/)
    return { firstName, lastName: rest.join(' ') }
}

const birthToApi = (value: string) =>
    toApiDate(new DateObject({ date: toEnDigits(value), format: 'YYYY/MM/DD', calendar: persian, locale: persian_fa }))

export const buildBookingBody = ({ houseId, checkIn, checkOut, passengers, email, phone }: BookingInput): CreateBookingBody => ({
    houseId: Number(houseId),
    reservedDates: [checkIn, checkOut],
    traveler_details: passengers.map(({ fullName, gender, birthDate, nationalId }) => ({
        ...splitName(fullName),
        gender,
        birthDate: birthToApi(birthDate),
        nationalId,
    })),
    sharedEmail: email,
    sharedMobile: toEnDigits(phone),
})

export async function createBooking(body: CreateBookingBody, signal?: AbortSignal): Promise<Booking> {
    try {
        const { data } = await api.post<Booking>('/api/bookings', body, { signal })
        return data
    } catch (e) {
        let message = 'ثبت رزرو انجام نشد، دوباره تلاش کن'

        if (isAxiosError(e)) {
            if (e.response?.status === 401) message = 'برای رزرو باید وارد حساب کاربری شوی'
            else if (typeof e.response?.data?.message === 'string') message = e.response.data.message
        }

        throw new Error(message)
    }
}