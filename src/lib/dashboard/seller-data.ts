import type { Payment } from '@/lib/Api/dashboard/buyer/payments'

export type PropertyStatus = 'active' | 'pending' | 'inactive'
export type SellerBookingStatus = 'confirmed' | 'pending' | 'canceled'
export type PaymentState = 'paid' | 'unpaid'
export type TransactionType = 'wallet' | 'booking'

export type SellerProperty = {
    id: string
    title: string
    image: string
    price: number
    rating: number
    views: number
    bookings: number
    status: PropertyStatus
    type: string
    dealType: string
    subType: string
    capacity: number
    address: string
    description: string
    rooms: string
    bathrooms: string
    parking: string
    yard: string
    tags: string[]
}

export type SellerTraveler = { name: string; gender: 'male' | 'female'; phone: string }
export type SellerPayment = { id: string; date: string; trackingCode: string; amount: number }
export type SellerChange = { id: string; date: string; type: string }

export type SellerBooking = {
    id: string
    propertyId: string
    title: string
    image: string
    address: string
    description: string
    rating: number
    propertyPrice: number
    features: string[]
    tags: string[]
    checkIn: string
    checkOut: string
    createdAt: string
    amount: number
    status: SellerBookingStatus
    payment: PaymentState
    travelers: SellerTraveler[]
    payments: SellerPayment[]
    changes: SellerChange[]
}

export type SellerTransaction = {
    id: string
    date: string
    trackingCode: string
    amount: number
    status: 'paid' | 'pending' | 'failed'
    type: TransactionType
}

export type SellerComment = {
    id: string
    author: string
    property: string
    rating: number
    text: string
    date: string
    isNew: boolean
}

export const propertyTypeOptions = ['آپارتمان', 'ویلا', 'سوئیت', 'کلبه', 'خانه'].map((v) => ({ label: v, value: v }))
export const dealTypeOptions = ['اجاره کوتاه مدت', 'رهن و اجاره', 'فروش'].map((v) => ({ label: v, value: v }))
export const subTypeOptions = ['مسکونی', 'تجاری', 'اداری'].map((v) => ({ label: v, value: v }))
export const yardOptions = ['حیاط دار', 'بالکن دار', 'بدون حیاط'].map((v) => ({ label: v, value: v }))
export const countOptions = [1, 2, 3, 4, 5, 6].map((n) => ({ label: n.toLocaleString('fa-IR'), value: String(n) }))
export const tagOptions = ['مدرن', 'آپارتمان', 'آسانسوردار', 'بالکن', 'استخر', 'نزدیک دریا', 'ویو جنگل', 'مبله'].map((v) => ({
    label: v,
    value: v,
}))

export const propertyStatusOptions = [
    { label: 'فعال', value: 'active' },
    { label: 'در انتظار تایید', value: 'pending' },
    { label: 'غیرفعال', value: 'inactive' },
]

export const bookingStatusOptions = [
    { label: 'تایید شده', value: 'confirmed' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'لغو شده', value: 'canceled' },
]

export const MAX_PRICE = 80_000_000

const houseImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=480&h=320&fit=crop'
const hotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&h=320&fit=crop'

const names = ['هتل سراوان رشت', 'ویلای ساحلی چمخاله', 'سوئیت مدرن لاهیجان', 'آپارتمان مبله ساری', 'کلبه جنگلی ماسال']
const propertyStatuses: PropertyStatus[] = ['active', 'pending', 'active', 'inactive']
const descriptionText =
    'آپارتمانی دنج و آرام در قلب شهر، جایی که زندگی روزمره راحت و سبک‌تر است. فضایی مدرن با طراحی منحصربه‌فرد، یادآور خانه‌های دنج و دل‌نشین. محلی برای لحظه‌های خوش، آرامش و شروعی نو در زندگی روزمره‌تان.'

export const initialProperties: SellerProperty[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    title: names[i % names.length],
    image: i % 2 ? hotelImage : houseImage,
    price: 1_800_000 + (i % 4) * 450_000,
    rating: 4.5,
    views: 5 + (i % 3) * 4,
    bookings: 8 - (i % 5),
    status: propertyStatuses[i % propertyStatuses.length],
    type: propertyTypeOptions[i % propertyTypeOptions.length].value,
    dealType: dealTypeOptions[i % dealTypeOptions.length].value,
    subType: 'مسکونی',
    capacity: 4,
    address: 'گیلان ، رشت ، میدان آزادی ، جنب چهار راه عظیمی',
    description: descriptionText,
    rooms: '2',
    bathrooms: '2',
    parking: '1',
    yard: 'حیاط دار',
    tags: ['مسکونی', 'آپارتمان', 'بالکن'],
}))

const travelerNames = ['امیر علی رضایی', 'مریم احمدی', 'حسین کریمی', 'سارا محمدی']
const bookingStatuses: SellerBookingStatus[] = ['confirmed', 'pending', 'confirmed', 'canceled']
const payments: PaymentState[] = ['paid', 'unpaid', 'paid', 'unpaid']

export const initialBookings: SellerBooking[] = Array.from({ length: 12 }, (_, i) => {
    const property = initialProperties[i % initialProperties.length]
    const day = 12 + i
    return {
        id: String(i + 1),
        propertyId: property.id,
        title: property.title,
        image: property.image,
        address: property.address,
        description: property.description,
        rating: 3.5,
        propertyPrice: 250_000_000,
        features: ['۱ پارکینگ', '۲ حیاط دار', '۲ خواب', '۲ حمام'],
        tags: ['مسکونی', 'آپارتمان', 'بالکن'],
        checkIn: `2025-08-${String(day).padStart(2, '0')}T12:33:00`,
        checkOut: `2025-08-${String(day + 3).padStart(2, '0')}T12:33:00`,
        createdAt: `2025-08-${String(day - 5 > 0 ? day - 5 : 1).padStart(2, '0')}T12:33:00`,
        amount: 1_800_000 + (i % 3) * 600_000,
        status: bookingStatuses[i % bookingStatuses.length],
        payment: payments[i % payments.length],
        travelers: [
            { name: travelerNames[i % travelerNames.length], gender: 'male', phone: '09115526598' },
            { name: travelerNames[(i + 1) % travelerNames.length], gender: i % 2 ? 'female' : 'male', phone: '09115526598' },
            { name: travelerNames[(i + 2) % travelerNames.length], gender: 'female', phone: '09115526598' },
        ],
        payments: Array.from({ length: 3 }, (_, n) => ({
            id: String(i * 10 + n + 1),
            date: `2025-08-${String(day).padStart(2, '0')}T12:33:00`,
            trackingCode: '123456789123456',
            amount: 125_000_000,
        })),
        changes: [
            { id: `${i}-1`, date: `2025-08-${String(day).padStart(2, '0')}T12:33:00`, type: 'اسامی مسافران' },
            { id: `${i}-2`, date: `2025-08-${String(day).padStart(2, '0')}T12:33:00`, type: 'تاریخ رزرو' },
            { id: `${i}-3`, date: `2025-08-${String(day).padStart(2, '0')}T12:33:00`, type: 'تاریخ رزرو' },
        ],
    }
})

const transactionStatuses: SellerTransaction['status'][] = ['paid', 'failed', 'paid', 'pending']

export const initialTransactions: SellerTransaction[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    date: `2025-08-${String(12 + i).padStart(2, '0')}T12:33:00`,
    trackingCode: '12345678912345' + String(i % 10),
    amount: 1_800_000,
    status: transactionStatuses[i % transactionStatuses.length],
    type: i % 3 === 1 ? 'booking' : 'wallet',
}))

export const initialComments: SellerComment[] = Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    author: travelerNames[i % travelerNames.length],
    property: names[i % names.length],
    rating: 3 + (i % 3),
    text: 'اقامتگاه تمیز و مرتب بود و برخورد میزبان بسیار مناسب بود. حتما دوباره رزرو می‌کنم.',
    date: `2025-08-${String(10 + i).padStart(2, '0')}T12:33:00`,
    isNew: i < 5,
}))

export const financeSummary = {
    withdrawable: 1_500_000,
    currentMonth: 1_500_000,
    previousMonth: 1_500_000,
    total: 1_500_000,
}

export const incomeMonths = ['خرداد ۱۴۰۴', 'تیر ۱۴۰۴', 'مرداد ۱۴۰۴']

export const incomeByMonth: Record<string, number[]> = {
    'خرداد ۱۴۰۴': [12, 18, 15, 30, 22, 35, 28, 40, 33, 45].map((n) => n * 1_000_000),
    'تیر ۱۴۰۴': [20, 14, 26, 18, 32, 25, 38, 30, 42, 36].map((n) => n * 1_000_000),
    'مرداد ۱۴۰۴': [8, 22, 17, 28, 36, 24, 30, 44, 38, 50].map((n) => n * 1_000_000),
}

export const toReceiptPayment = (
    p: { id: string; trackingCode: string; amount: number; date: string },
    description: string
): Payment => ({
    id: p.id,
    userId: '',
    bookingId: null,
    amount: String(p.amount),
    description,
    status: 'completed',
    paymentUrl: '',
    transactionId: p.trackingCode,
    createdAt: p.date,
    updatedAt: p.date,
})
