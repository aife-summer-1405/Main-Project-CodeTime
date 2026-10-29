import { useEffect, useState } from 'react'
import { fetchAllHotels, type Hotel } from '@/lib/Api/house'

export function useHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        fetchAllHotels(controller.signal)
            .then(setHotels)
            .catch((e) => {
                if (e.name !== 'AbortError') setError('خطا در دریافت اطلاعات')
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [])

    return { hotels, loading, error }
}