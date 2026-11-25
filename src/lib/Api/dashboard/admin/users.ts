import api from '@/lib/interceptor/api'
import { normalizeRole } from '@/lib/dashboard/role'
import type { Role } from '@/lib/dashboard/config'
import { obj, text, type Raw } from '@/lib/Api/shared'

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

export const getAdminUserById = async (id: string): Promise<AdminUser> => {
    const path = encodeURIComponent(id)
    const read = ({ data }: { data: Raw }) => toAdminUser(obj(data.user ?? data.data ?? data))
    try {
        return read(await api.get<Raw>(`/api/admin/users/${path}`))
    } catch {
        return read(await api.get<Raw>(`/api/users/${path}`))
    }
}
