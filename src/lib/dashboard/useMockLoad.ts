import { useEffect, useState } from 'react'

export default function useMockLoad(delay = 600) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), delay)
        return () => clearTimeout(timer)
    }, [delay])

    return loading
}
