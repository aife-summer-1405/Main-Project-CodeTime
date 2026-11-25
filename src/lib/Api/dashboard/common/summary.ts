import api from '@/lib/interceptor/api'

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
