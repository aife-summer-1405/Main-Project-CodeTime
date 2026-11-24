import api from '../interceptor/api'
import type { Role } from './config'
import { ACCESS_KEY, normalizeRole } from './role'
import { transactionKey } from './sellerHousesApi'

export type AdminSummary = {
    totalUsers: number
    totalHouses: number
    totalBookings: number
    averageRating: number
}

export type AdminUser = {
    id: string
    role: Role
    email: string
    phoneNumber: string
    emailVerified: boolean
    fullName: string
    firstName: string
    lastName: string
    profilePicture: string | null
    membershipDate: string | null
    createdAt: string | null
}

export type AdminUserBody = {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    emailVerified: boolean
}

export type AdminUsersQuery = {
    page: number
    limit: number
    email?: string
    role?: Role | ''
}

type Raw = Record<string, unknown>

const text = (value: unknown) => (value === undefined || value === null ? '' : String(value))

const toAdminUser = (raw: Raw): AdminUser => {
    const firstName = text(raw.firstName)
    const lastName = text(raw.lastName)
    return {
        id: text(raw.id),
        role: normalizeRole(raw.role) ?? 'buyer',
        email: text(raw.email),
        phoneNumber: text(raw.phoneNumber),
        emailVerified: Boolean(raw.emailVerified),
        fullName: text(raw.fullName) || `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        profilePicture: text(raw.profilePicture) || null,
        membershipDate: text(raw.membershipDate) || null,
        createdAt: text(raw.createdAt) || null,
    }
}

export const getAdminDashboard = async (): Promise<AdminSummary> => {
    const { data } = await api.get<Raw>('/api/admin/dashboard')
    return {
        totalUsers: Number(data.totalUsers) || 0,
        totalHouses: Number(data.totalHouses) || 0,
        totalBookings: Number(data.totalBookings) || 0,
        averageRating: Number(data.averageRating) || 0,
    }
}

export const getAdminUsers = async ({ page, limit, email, role }: AdminUsersQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/users', {
        params: {
            page,
            limit,
            sort: 'createdAt',
            order: 'DESC',
            ...(email ? { email } : {}),
            ...(role ? { role } : {}),
        },
    })
    const users = (data.data ?? []).map(toAdminUser)
    return { users, totalCount: data.totalCount ?? users.length }
}

export const updateUserRole = async (id: string, role: Role) => {
    const { data } = await api.put(`/api/admin/users/${encodeURIComponent(id)}/role`, { role })
    return data
}

export const deleteUser = async (id: string) => {
    const { data } = await api.delete(`/api/admin/users/${encodeURIComponent(id)}`)
    return data
}

export const updateAdminUser = async (user: AdminUser, body: AdminUserBody) => {
    const { data } = await api.put(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        ...body,
        fullName: `${body.firstName} ${body.lastName}`.trim(),
        ...(user.membershipDate ? { membershipDate: user.membershipDate } : {}),
        ...(user.profilePicture ? { profilePicture: user.profilePicture } : {}),
    })
    return data
}

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

const amount = (value: unknown) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

const record = (value: unknown): Raw => (value && typeof value === 'object' ? (value as Raw) : {})

const strings = (value: unknown) => (Array.isArray(value) ? value.map(text) : [])

export type AdminHouse = {
    id: string
    title: string
    address: string
    caption: string
    photos: string[]
    rate: number
    price: number
    discountedPrice: number | null
    tags: string[]
    lastUpdated: string | null
    capacity: number
    location: { lat: number; lng: number } | null
    category: string
    bathrooms: number
    parking: number
    rooms: number
    yardType: string
    comments: number
    transactionType: string
    sellerId: string
    sellerName: string
}

export type AdminHouseBody = {
    title: string
    address: string
    caption: string | null
    rate: number
    price: number
    discounted_price: number | null
    photos: string[]
    tags: string[]
    last_updated: string
    capacity: number
    location?: { lat: number; lng: number }
    categories: { name: string }
    bathrooms: number
    parking: number
    rooms: number
    yard_type: string
    num_comments: number
    transaction_type: string
}

export type AdminHousesQuery = {
    page: number
    limit: number
    sellerId?: string
    price?: string
}

const toLocation = (value: unknown) => {
    const raw = record(value)
    const lat = Number(raw.lat)
    const lng = Number(raw.lng)
    return raw.lat != null && raw.lng != null && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
}

const toAdminHouse = (raw: Raw): AdminHouse => ({
    id: text(raw.id),
    title: text(raw.title),
    address: text(raw.address),
    caption: text(raw.caption),
    photos: strings(raw.photos),
    rate: amount(raw.rate),
    price: amount(raw.price),
    discountedPrice: raw.discounted_price == null ? null : amount(raw.discounted_price),
    tags: strings(raw.tags),
    lastUpdated: text(raw.last_updated) || null,
    capacity: amount(raw.capacity),
    location: toLocation(raw.location),
    category: text(record(raw.categories).name),
    bathrooms: amount(raw.bathrooms),
    parking: amount(raw.parking),
    rooms: amount(raw.rooms),
    yardType: text(raw.yard_type),
    comments: amount(raw.num_comments),
    transactionType: transactionKey(text(raw.transaction_type)),
    sellerId: text(raw.sellerId),
    sellerName: text(raw.sellerName),
})

export const getAdminHouses = async ({ page, limit, sellerId, price }: AdminHousesQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/houses', {
        params: {
            page,
            limit,
            sort: 'created_at',
            order: 'DESC',
            ...(sellerId ? { sellerId } : {}),
            ...(price ? { price } : {}),
        },
    })
    const houses = (data.data ?? []).map(toAdminHouse)
    return { houses, totalCount: data.totalCount ?? houses.length }
}

export const updateAdminHouse = async (id: string, body: AdminHouseBody) => {
    const { data } = await api.put(`/api/admin/houses/${encodeURIComponent(id)}`, {
        ...body,
        transaction_type: transactionKey(body.transaction_type),
    })
    return data
}

export const deleteAdminHouse = async (id: string) => {
    const { data } = await api.delete(`/api/admin/houses/${encodeURIComponent(id)}`)
    return data
}

export type BookingHouse = Pick<
    AdminHouse,
    'id' | 'title' | 'address' | 'caption' | 'photos' | 'rate' | 'price' | 'discountedPrice' | 'tags' | 'capacity' | 'category' | 'bathrooms' | 'parking' | 'rooms' | 'transactionType'
>

export const getBookingHouse = async (id: string): Promise<BookingHouse> => {
    const { data } = await api.get<Raw>(`/api/houses/${encodeURIComponent(id)}`)
    const house = toAdminHouse(record(data.house ?? data.data ?? data))
    return {
        id: house.id || id,
        title: house.title,
        address: house.address,
        caption: house.caption,
        photos: house.photos,
        rate: house.rate,
        price: house.price,
        discountedPrice: house.discountedPrice,
        tags: house.tags,
        capacity: house.capacity,
        category: house.category,
        bathrooms: house.bathrooms,
        parking: house.parking,
        rooms: house.rooms,
        transactionType: house.transactionType,
    }
}

export type AdminComment = {
    id: string
    houseId: string
    caption: string
    rating: number
    createdAt: string | null
    isReply: boolean
    userName: string
    userPicture: string | null
    houseTitle: string
    houseAddress: string
}

export type AdminCommentsQuery = {
    page: number
    limit: number
    userId?: string
    houseId?: string
    rating?: string
}

const toAdminComment = (raw: Raw): AdminComment => {
    const user = record(raw.user)
    const house = record(raw.house)
    return {
        id: text(raw.id),
        houseId: text(raw.house_id) || text(house.id),
        caption: text(raw.caption),
        rating: amount(raw.rating),
        createdAt: text(raw.created_at) || null,
        isReply: raw.parent_comment_id != null,
        userName: `${text(user.firstName)} ${text(user.lastName)}`.trim(),
        userPicture: text(user.profilePicture) || null,
        houseTitle: text(house.title),
        houseAddress: text(house.address),
    }
}

export const getAdminComments = async ({ page, limit, userId, houseId, rating }: AdminCommentsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/comments', {
        params: {
            page,
            limit,
            sort: 'created_at',
            order: 'DESC',
            ...(userId ? { user_id: userId } : {}),
            ...(houseId ? { house_id: houseId } : {}),
            ...(rating ? { rating } : {}),
        },
    })
    const comments = (data.data ?? []).map(toAdminComment)
    return { comments, totalCount: data.totalCount ?? comments.length }
}

export const updateAdminComment = async (id: string, caption: string) => {
    const { data } = await api.put(`/api/admin/comments/${encodeURIComponent(id)}`, { caption })
    return data
}

export const deleteAdminComment = async (id: string) => {
    const { data } = await api.delete(`/api/admin/comments/${encodeURIComponent(id)}`)
    return data
}

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export type AdminPayment = {
    id: string
    userId: string
    bookingId: string | null
    amount: number
    description: string
    status: PaymentStatus
    transactionId: string
    createdAt: string | null
    updatedAt: string | null
}

export type AdminPaymentBody = {
    amount: number
    status: PaymentStatus
    description: string
    transactionId: string
}

export type AdminPaymentsQuery = {
    page: number
    limit: number
    status?: PaymentStatus | ''
    userId?: string
    amount?: string
}

export const paymentStatusOptions: { label: string; value: PaymentStatus }[] = [
    { label: 'تایید شده', value: 'completed' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'ناموفق', value: 'failed' },
]

const paymentStatus = (value: unknown): PaymentStatus => {
    const status = text(value).toLowerCase()
    if (['completed', 'success', 'paid'].includes(status)) return 'completed'
    return ['failed', 'canceled', 'cancelled'].includes(status) ? 'failed' : 'pending'
}

const toAdminPayment = (raw: Raw): AdminPayment => ({
    id: text(raw.id),
    userId: text(raw.userId),
    bookingId: text(raw.bookingId) || null,
    amount: Number(raw.amount) || 0,
    description: text(raw.description),
    status: paymentStatus(raw.status),
    transactionId: text(raw.transactionId),
    createdAt: text(raw.createdAt) || null,
    updatedAt: text(raw.updatedAt) || null,
})

export const getAdminPayments = async ({ page, limit, status, userId, amount }: AdminPaymentsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/payments', {
        params: {
            page,
            limit,
            sort: 'createdAt',
            order: 'DESC',
            ...(status ? { status } : {}),
            ...(userId ? { userId } : {}),
            ...(amount ? { amount } : {}),
        },
    })
    const payments = (data.data ?? []).map(toAdminPayment)
    return { payments, totalCount: data.totalCount ?? payments.length }
}

export const getAdminPayment = async (id: string): Promise<AdminPayment> => {
    const { data } = await api.get<Raw>(`/api/admin/payments/${encodeURIComponent(id)}`)
    return toAdminPayment(record(data.payment ?? data.data ?? data))
}

export const updateAdminPayment = async (id: string, body: AdminPaymentBody) => {
    const { data } = await api.put(`/api/admin/payments/${encodeURIComponent(id)}`, body)
    return data
}

export const verifyAdminPayment = async (id: string) => {
    const token = typeof window === 'undefined' ? '' : (localStorage.getItem(ACCESS_KEY) ?? '')
    const { data } = await api.post(`/api/payments/${encodeURIComponent(id)}/verify`, { token })
    return data
}

export const deleteAdminPayment = async (id: string) => {
    const { data } = await api.delete(`/api/admin/payments/${encodeURIComponent(id)}`)
    return data
}

export const getAdminUserById = async (id: string): Promise<AdminUser> => {
    const path = encodeURIComponent(id)
    const read = ({ data }: { data: Raw }) => toAdminUser(record(data.user ?? data.data ?? data))
    try {
        return read(await api.get<Raw>(`/api/admin/users/${path}`))
    } catch {
        return read(await api.get<Raw>(`/api/users/${path}`))
    }
}

export type AdminContactMessage = {
    id: string
    title: string
    message: string
    senderName: string
    senderEmail: string
}

export type AdminContactQuery = {
    page: number
    limit: number
    title?: string
}

const SENDER_PATTERN = /^\s*Message From\s*:\s*(.*?)\s*\(([^()]*)\)\s*$/i

const toAdminContactMessage = (raw: Raw): AdminContactMessage => {
    const title = text(raw.title)
    const match = SENDER_PATTERN.exec(title)
    return {
        id: text(raw.id),
        title,
        message: text(raw.message),
        senderName: match ? match[1] : '',
        senderEmail: match ? match[2] : '',
    }
}

export const getAdminContactMessages = async ({ page, limit, title }: AdminContactQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/contact-us', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(title?.trim() ? { title: title.trim() } : {}) },
    })
    const messages = (data.data ?? []).map(toAdminContactMessage)
    return { messages, totalCount: data.totalCount ?? messages.length }
}

export const getAdminContactMessage = async (id: string): Promise<AdminContactMessage> => {
    const { data } = await api.get<Raw>(`/api/contact-us/${encodeURIComponent(id)}`)
    return toAdminContactMessage(record(data.data ?? data))
}

export const deleteAdminContactMessage = async (id: string) => {
    const { data } = await api.delete(`/api/contact-us/${encodeURIComponent(id)}`)
    return data
}

export type AdminLocation = {
    id: string
    areaName: string
    lat: number
    lng: number
}

export type AdminLocationBody = {
    area_name: string
    lat: number
    lng: number
}

export type AdminLocationsQuery = {
    page: number
    limit: number
    areaName?: string
}

const toAdminLocation = (raw: Raw): AdminLocation => ({
    id: text(raw.id),
    areaName: text(raw.areaName) || text(raw.area_name),
    lat: Number(raw.lat) || 0,
    lng: Number(raw.lng) || 0,
})

export const getAdminLocations = async ({ page, limit, areaName }: AdminLocationsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/locations', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(areaName?.trim() ? { area_name: areaName.trim() } : {}) },
    })
    const locations = (data.data ?? []).map(toAdminLocation)
    return { locations, totalCount: data.totalCount ?? locations.length }
}

export const createAdminLocation = async (body: AdminLocationBody) => {
    const { data } = await api.post('/api/locations', body)
    return data
}

export const updateAdminLocation = async (id: string, body: AdminLocationBody) => {
    const { data } = await api.put(`/api/locations/${encodeURIComponent(id)}`, body)
    return data
}

export const deleteAdminLocation = async (id: string) => {
    const { data } = await api.delete(`/api/locations/${encodeURIComponent(id)}`)
    return data
}

export type AdminCategory = {
    id: string
    name: string
}

export type AdminCategoriesQuery = {
    page: number
    limit: number
    name?: string
}

const toAdminCategory = (raw: Raw): AdminCategory => ({ id: text(raw.id), name: text(raw.name) })

export const getAdminCategories = async ({ page, limit, name }: AdminCategoriesQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/categories', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(name?.trim() ? { name: name.trim() } : {}) },
    })
    const categories = (data.data ?? []).map(toAdminCategory)
    return { categories, totalCount: data.totalCount ?? categories.length }
}

export const createAdminCategory = async (name: string) => {
    const { data } = await api.post('/api/categories', { name })
    return data
}

export const updateAdminCategory = async (id: string, name: string) => {
    const { data } = await api.put(`/api/categories/${encodeURIComponent(id)}`, { name })
    return data
}

export const deleteAdminCategory = async (id: string) => {
    const { data } = await api.delete(`/api/categories/${encodeURIComponent(id)}`)
    return data
}

export type AdminBlog = {
    id: string
    title: string
    caption: string
    readingTime: string
    authorId: string
    categoryId: string
    createdAt: string | null
}

export type AdminBlogBody = {
    title: string
    caption: string
    estimated_reading_time: string
    author_id: number
    category_id: number
}

export type AdminBlogsQuery = {
    page: number
    limit: number
    title?: string
    authorId?: string
    categoryId?: string
}

const toAdminBlog = (raw: Raw): AdminBlog => ({
    id: text(raw.id),
    title: text(raw.title),
    caption: text(raw.caption),
    readingTime: text(raw.estimated_reading_time),
    authorId: text(raw.author_id),
    categoryId: text(raw.category_id),
    createdAt: text(raw.created_at) || null,
})

export const getAdminBlogs = async ({ page, limit, title, authorId, categoryId }: AdminBlogsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/blogs', {
        params: {
            page,
            limit,
            sort: 'created_at',
            order: 'DESC',
            ...(title?.trim() ? { title: title.trim() } : {}),
            ...(authorId ? { author_id: authorId } : {}),
            ...(categoryId ? { category_id: categoryId } : {}),
        },
    })
    const blogs = (data.data ?? []).map(toAdminBlog)
    return { blogs, totalCount: data.totalCount ?? blogs.length }
}

export const createAdminBlog = async (body: AdminBlogBody) => {
    const { data } = await api.post('/api/blogs', body)
    return data
}

export const updateAdminBlog = async (id: string, body: AdminBlogBody) => {
    const { data } = await api.put(`/api/blogs/${encodeURIComponent(id)}`, body)
    return data
}

export const deleteAdminBlog = async (id: string) => {
    const { data } = await api.delete(`/api/blogs/${encodeURIComponent(id)}`)
    return data
}
