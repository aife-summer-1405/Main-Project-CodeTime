export type ReserveStepName = 'step1' | 'step2' | 'payment' | 'step3'

export interface ReserveHotel {
    id: string
    title: string
    address: string
    rating: number
    image: string
    capacity: number
    price: number
    discounted_price: number | null
}

export interface Passenger {
    id: string
    nationalId: string
    fullName: string
    gender: 'male' | 'female'
    birthDate: string
}

export interface ReservationConfirmation {
    bookingId: number
    hotelId: string
    hotelTitle: string
    amount: number
    checkIn?: string
    checkOut?: string
    passengers: Passenger[]
}
