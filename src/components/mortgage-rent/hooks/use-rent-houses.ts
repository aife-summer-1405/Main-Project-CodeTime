'use client'
import { useEffect, useState } from 'react'
import { isCancel } from 'axios'
import {
    getRentCategories,
    getRentHouses,
    getRentLocations,
    type RentCategory,
    type RentHouse,
    type RentLocation,
    type RentQuery,
} from '@/lib/Api/rent'

export function useRentHouses(query: RentQuery) {
    const key = JSON.stringify(query)
    const [houses, setHouses] = useState<RentHouse[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const ctrl = new AbortController()
        setLoading(true)
        setError(null)

        getRentHouses(JSON.parse(key) as RentQuery, ctrl.signal)
            .then((res) => {
                setHouses(res.houses)
                setTotal(res.total)
            })
            .catch((e) => {
                if (isCancel(e)) return
                setHouses([])
                setTotal(0)
                setError('خطا در دریافت اطلاعات، دوباره تلاش کنید.')
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false)
            })

        return () => ctrl.abort()
    }, [key, attempt])

    return { houses, total, loading, error, retry: () => setAttempt((n) => n + 1) }
}

export function useRentCategories() {
    const [categories, setCategories] = useState<RentCategory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ctrl = new AbortController()
        getRentCategories(ctrl.signal)
            .then(setCategories)
            .catch(() => {})
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false)
            })
        return () => ctrl.abort()
    }, [])

    return { categories, loading }
}

export function useRentLocations() {
    const [locations, setLocations] = useState<RentLocation[]>([])

    useEffect(() => {
        const ctrl = new AbortController()
        getRentLocations(ctrl.signal)
            .then(setLocations)
            .catch(() => {})
        return () => ctrl.abort()
    }, [])

    return locations
}
