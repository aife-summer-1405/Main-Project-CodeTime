import api from "../interceptor/api"

export type BookingsSummary = {
    bookingCount: number
    conformedBookings: number
    canceledBookings: number
    pendingBookings: number
}

export type DashboardSummary = {
    houses: number
    bookings: BookingsSummary
    comments: number
    averageRating: string
}

export type User = {
    id: string
    email: string
    fullName: string
    firstName: string
    lastName: string
    phoneNumber: string
    profilePicture: string | null
    role?: string
}

export type FinanceDashboard = {
    totalAmount: number
    totalBookings: number
    totalPayments: number
    totalPerviousMonthAmount: number
    totalCurrentMonthAmount: number
}
export type UpdateUserBody = Pick<User, 'email' | 'firstName' | 'lastName' | 'phoneNumber'>

export const getUserId = () => {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(payload)).id as string
    } catch {
        return null
    }
}

export async function getFinanceDashboard(): Promise<FinanceDashboard> {
    const res = await api.get('/api/seller/finance/dashboard')
    return res.data
}
export const getErrorMessage = (error: unknown, fallback: string) =>
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback

export const getUser = async (id: string) => {
    const { data } = await api.get(`/api/users/${id}`)
    return (data.user ?? data) as User
}

export const updateUser = async (id: string, body: UpdateUserBody) => {
    const { data } = await api.put(`/api/users/${id}`, { ...body, fullName: `${body.firstName} ${body.lastName}` })
    return data
}

export const uploadPicture = async (file: File) => {
    const body = new FormData()
    body.append('picture', file)
    const { data } = await api.put('/api/users/upload/picture', body)
    return data
}

export const changePassword = async (body: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.put('/api/users/change-password', body)
    return data
}
let summaryRequest: Promise<DashboardSummary> | null = null

export const getDashboardSummary = () => {
    summaryRequest ??= api
        .get<DashboardSummary>('/api/dashboard/summary')
        .then(({ data }) => data)
        .finally(() => {
            setTimeout(() => {
                summaryRequest = null
            }, 2000)
        })
    return summaryRequest
}