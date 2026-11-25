import api from '@/lib/interceptor/api'
import type { Raw } from '@/lib/Api/shared'

const LIMIT = 100

export const fetchAllPages = async (path: string, params: Record<string, string | number> = {}) => {
    const read = async (page: number) => {
        const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>(path, { params: { page, limit: LIMIT, ...params } })
        return { rows: data.data ?? [], total: data.totalCount ?? 0 }
    }
    const first = await read(1)
    const pages = Math.ceil(first.total / LIMIT)
    if (pages <= 1) return first.rows
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => read(i + 2)))
    return [...first.rows, ...rest.flatMap((r) => r.rows)]
}
