'use client'
import { useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getBlogs, getCategories, type Blog, type BlogCategory, type BlogQuery } from '@/lib/Api/blog'

export function useBlogs({ page, limit, title, categoryId, sort }: BlogQuery) {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const ctrl = new AbortController()
        setLoading(true)
        setError(null)

        getBlogs({ page, limit, title, categoryId, sort }, ctrl.signal)
            .then((res) => {
                setBlogs(res.blogs)
                setTotal(res.total)
            })
            .catch((e) => {
                if (isCancel(e)) return
                setBlogs([])
                setTotal(0)
                setError('خطا در دریافت مقالات، دوباره تلاش کنید.')
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false)
            })

        return () => ctrl.abort()
    }, [page, limit, title, categoryId, sort])

    return { blogs, total, loading, error }
}

export function useBlogCategories() {
    const [categories, setCategories] = useState<BlogCategory[]>([])

    useEffect(() => {
        const ctrl = new AbortController()
        getCategories(ctrl.signal)
            .then(setCategories)
            .catch(() => {})
        return () => ctrl.abort()
    }, [])

    return categories
}
