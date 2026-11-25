import api from '@/lib/interceptor/api'

export type SellerComment = {
    id: string
    houseId: string
    author: string
    property: string
    rating: number
    title: string
    text: string
    date: string
    isReply: boolean
}

export type CommentUpdate = {
    title: string
    caption: string
    rating: number
}

type CommentAction = 'update' | 'delete'

type RawComment = {
    id?: string | number
    house_id?: string | number
    title?: string
    caption?: string
    rating?: string | number
    created_at?: string
    parent_comment_id?: string | number | null
    user?: { firstName?: string; lastName?: string }
    house?: { id?: string | number; title?: string }
}

type RawError = {
    response?: { status?: number; data?: { message?: string } }
    request?: unknown
}

const normalize = (raw: RawComment): SellerComment => ({
    id: String(raw.id ?? ''),
    houseId: String(raw.house_id ?? raw.house?.id ?? ''),
    author: `${raw.user?.firstName ?? ''} ${raw.user?.lastName ?? ''}`.trim(),
    property: raw.house?.title ?? '',
    rating: Number(raw.rating) || 0,
    title: raw.title ?? '',
    text: raw.caption ?? '',
    date: raw.created_at ?? '',
    isReply: raw.parent_comment_id !== null && raw.parent_comment_id !== undefined,
})

export const getSellerComments = async (sellerId: string, page = 1, limit = 100) => {
    const { data } = await api.get<{ comments?: RawComment[]; totalCount?: number }>(`/api/comments/seller/${sellerId}`, {
        params: { page, limit, sort: 'created_at', order: 'DESC' },
    })

    return {
        items: (data.comments ?? []).map(normalize),
        totalCount: data.totalCount ?? 0,
    }
}

export const updateComment = async (id: string, payload: CommentUpdate) => {
    await api.put(`/api/comments/${encodeURIComponent(id)}`, payload)
}

export const deleteComment = async (id: string) => {
    await api.delete(`/api/comments/${encodeURIComponent(id)}`)
}

const knownMessages: Record<string, string> = {
    'You can only update your own comments': 'فقط می‌توانید نظرهای خودتان را ویرایش کنید',
    'You can only delete your own comments': 'فقط می‌توانید نظرهای خودتان را حذف کنید',
    'Comment not found': 'نظر مورد نظر پیدا نشد',
}

export const errorStatus = (e: unknown) => (e as RawError)?.response?.status

export const isFinalCommentError = (e: unknown) => {
    const status = errorStatus(e)
    return status === 403 || status === 404
}

export const commentErrorMessage = (e: unknown, action: CommentAction) => {
    const err = e as RawError
    const status = err?.response?.status
    const serverMessage = err?.response?.data?.message

    if (serverMessage && knownMessages[serverMessage]) return knownMessages[serverMessage]

    if (!err?.response) {
        return err?.request ? 'ارتباط با سرور برقرار نشد، اینترنت خود را بررسی کنید' : 'خطای ناشناخته رخ داد'
    }

    if (status === 401) return 'توکن شما منقضی شده است، دوباره وارد شوید'
    if (status === 403) {
        return action === 'delete'
            ? 'فقط می‌توانید نظرهای خودتان را حذف کنید'
            : 'فقط می‌توانید نظرهای خودتان را ویرایش کنید'
    }
    if (status === 404) return 'نظر مورد نظر پیدا نشد'
    if (status === 400 || status === 422) return 'اطلاعات واردشده معتبر نیست'
    if (status === 429) return 'تعداد درخواست‌ها زیاد است، کمی بعد دوباره تلاش کنید'
    if (status && status >= 500) return 'خطایی در سرور رخ داد، کمی بعد دوباره تلاش کنید'

    return action === 'delete' ? 'حذف نظر انجام نشد' : 'ویرایش نظر انجام نشد'
}

export const loadCommentsErrorMessage = (e: unknown) => {
    const err = e as RawError
    if (!err?.response) return 'ارتباط با سرور برقرار نشد، اینترنت خود را بررسی کنید'
    if (err.response.status === 401) return 'توکن شما منقضی شده است، دوباره وارد شوید'
    if (err.response.status && err.response.status >= 500) return 'خطایی در سرور رخ داد، کمی بعد دوباره تلاش کنید'
    return 'خطا در دریافت نظرات'
}