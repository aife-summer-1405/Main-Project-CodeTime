import { useEffect, useMemo, useState } from 'react'
import { categoryLabel, getCategories, type BlogCategory } from '@/lib/Api/blog'

export default function useBlogCategories() {
    const [categories, setCategories] = useState<BlogCategory[]>([])

    useEffect(() => {
        let active = true
        getCategories()
            .then((list) => active && setCategories(list))
            .catch(() => active && setCategories([]))
        return () => {
            active = false
        }
    }, [])

    const options = useMemo(() => categories.map((c) => ({ label: categoryLabel(c.name) || c.name, value: c.id })), [categories])
    const labels = useMemo(() => Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<string, string>, [options])

    return { options, labels }
}
