'use client'
import { useEffect, useMemo, useState } from 'react'
import { filterByCounts, getHotels, type Hotel } from '@/lib/Api/house'
import type { Filters } from '@/components/reserve/filters/FilterDrawer'

export function useHotels(filters: Filters, query: string) {
    const [all, setAll] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const destination = filters.destination[0] ?? ''
    const sort = filters.sort[0] ?? ''
    const minPrice = filters.minPrice[0] ?? ''
    const maxPrice = filters.maxPrice[0] ?? ''

    const rooms = Number(filters.rooms[0] ?? 0)
    const bathrooms = Number(filters.bathrooms[0] ?? 0)
    const toilets = Number(filters.toilets[0] ?? 0)
    const parking = Number(filters.parking[0] ?? 0)

    useEffect(() => {
        const ctrl = new AbortController()
        setLoading(true)
        setError(null)

        getHotels({ query, destination, sort, minPrice, maxPrice }, ctrl.signal)
            .then(setAll)
            .catch((e) => {
                if (e?.name === 'AbortError') return
                setAll([])
                setError('خطا در دریافت اطلاعات، دوباره تلاش کنید.')
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false)
            })

        return () => ctrl.abort()
    }, [query, destination, sort, minPrice, maxPrice])

    const hotels = useMemo(
        () => filterByCounts(all, { rooms, bathrooms, toilets, parking }),
        [all, rooms, bathrooms, toilets, parking]
    )

    return { hotels, loading, error }
}