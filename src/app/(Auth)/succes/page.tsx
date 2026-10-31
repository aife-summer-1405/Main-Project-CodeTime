'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function GoogleSuccessPage() {
    const router = useRouter()
    const handled = useRef(false)

    useEffect(() => {
        if (handled.current) return
        handled.current = true

        const query = new URLSearchParams(window.location.search)
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        const get = (...keys: string[]) => {
            for (const k of keys) {
                const v = query.get(k) ?? hash.get(k)
                if (v) return v
            }
            return null
        }

        const accessToken = get('accessToken', 'access_token')
        const refreshToken = get('refreshToken', 'refresh_token')

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken)
            localStorage.setItem('refresh_token', refreshToken)
            toast.success('با موفقیت وارد شدید')
            router.replace('/')
        } else {
            toast.error('ورود با گوگل ناموفق بود')
            router.replace('/login')
        }
    }, [router])

    return (
        <div className="w-full min-h-dvh flex justify-center items-center bg-white-1 dark:bg-[#121212]">
            <p className="text-[#060425] dark:text-white-1 font-medium text-[14px]">در حال ورود...</p>
        </div>
    )
}