import api from '../interceptor/api'

export type Blog = {
    id: string
    title: string
    caption: string
    estimated_reading_time: string
    author_id: string
    created_at: string
    category_id: string
}

export type BlogCategory = {
    id: string
    name: string
}

export type BlogQuery = {
    page: number
    limit: number
    title: string
    categoryId: string
    sort: string
}

type ListResponse<T> = {
    data: T[]
    totalCount: number
}

export const SORT_OPTIONS = [
    { value: 'newest', label: 'جدیدترین', sort: 'created_at', order: 'DESC' },
    { value: 'oldest', label: 'قدیمی‌ترین', sort: 'created_at', order: 'ASC' },
] as const

const CATEGORY_LABELS: Record<string, string> = {
    apartment: 'آپارتمان',
    suite: 'سوئیت',
    villa: 'ویلا',
    'garden-villa': 'ویلا باغ',
    'villa-house': 'ویلا خانه',
    house: 'خانه',
    'traditional-house': 'خانه سنتی',
    cottage: 'کلبه',
    'eco-lodge': 'بوم‌گردی',
}

export const categoryLabel = (name?: string | null) => (name ? CATEGORY_LABELS[name] ?? name : '')

export async function getBlogs(q: BlogQuery, signal?: AbortSignal) {
    const option = SORT_OPTIONS.find((o) => o.value === q.sort) ?? SORT_OPTIONS[0]

    const params: Record<string, string | number> = {
        page: q.page,
        limit: q.limit,
        sort: option.sort,
        order: option.order,
    }
    if (q.title) params.title = q.title
    if (q.categoryId) params.category_id = q.categoryId

    const { data } = await api.get<ListResponse<Blog>>('/api/blogs', { params, signal })

    return { blogs: data.data ?? [], total: data.totalCount ?? 0 }
}

export async function getBlogById(id: string) {
    const { data } = await api.get<Blog>(`/api/blogs/${id}`)
    return data
}

export async function getCategories(signal?: AbortSignal) {
    const { data } = await api.get<ListResponse<BlogCategory>>('/api/categories', {
        params: { page: 1, limit: 50 },
        signal,
    })
    return data.data ?? []
}

export async function getCategoryById(id: string) {
    try {
        const { data } = await api.get<BlogCategory>(`/api/categories/${id}`)
        return data
    } catch {
        return null
    }
}

export async function getRelatedBlogs(blog: Blog, count = 3) {
    try {
        const [same, latest] = await Promise.all([
            getBlogs({ page: 1, limit: count + 1, title: '', categoryId: blog.category_id, sort: 'newest' }),
            getBlogs({ page: 1, limit: count + 3, title: '', categoryId: '', sort: 'newest' }),
        ])
        const seen = new Set([blog.id])
        return [...same.blogs, ...latest.blogs].filter((b) => !seen.has(b.id) && seen.add(b.id)).slice(0, count)
    } catch {
        return []
    }
}
