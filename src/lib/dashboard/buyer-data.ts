export type ReservationStatus = 'success' | 'pending' | 'cancel'

export const profile = { completion: 30, updatedAt: 'دیروز' }

const image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&fit=crop'

export const reservations: {
    id: number
    hotel: string
    date: string
    time: string
    price: string
    status: ReservationStatus
    image: string
}[] = [
    { id: 1, hotel: 'هتل سراوان رشت', date: '۱۲ مرداد ۱۴۰۴', time: '۱۲:۳۳', price: '۱,۸۰۰,۰۰۰', status: 'success', image },
    { id: 2, hotel: 'هتل سراوان رشت', date: '۱۲ مرداد ۱۴۰۴', time: '۱۲:۳۳', price: '۱,۸۰۰,۰۰۰', status: 'pending', image },
    { id: 3, hotel: 'هتل سراوان رشت', date: '۱۲ مرداد ۱۴۰۴', time: '۱۲:۳۳', price: '۱,۸۰۰,۰۰۰', status: 'cancel', image },
    { id: 4, hotel: 'هتل سراوان رشت', date: '۱۲ مرداد ۱۴۰۴', time: '۱۲:۳۳', price: '۱,۸۰۰,۰۰۰', status: 'cancel', image },
]
