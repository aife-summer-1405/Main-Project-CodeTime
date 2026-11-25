import api from '@/lib/interceptor/api'
import { number, obj, text, type Raw } from '@/lib/Api/shared'

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
    const user = obj(raw.user)
    const house = obj(raw.house)
    return {
        id: text(raw.id),
        houseId: text(raw.house_id) || text(house.id),
        caption: text(raw.caption),
        rating: number(raw.rating),
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
