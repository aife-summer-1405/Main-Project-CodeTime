import api from '@/lib/interceptor/api'
import { text, type Raw } from '@/lib/Api/shared'

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
