import api from '@/lib/interceptor/api'
import type { Raw } from '@/lib/Api/shared'

export type AdminSummary = {
    totalUsers: number
    totalHouses: number
    totalBookings: number
    averageRating: number
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
