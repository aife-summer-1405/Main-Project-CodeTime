'use client'
import { Suspense, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import { googleLoginCallback, SocialProvider } from '@/lib/Api/authApi'

const PROVIDERS: SocialProvider[] = ['google', 'github']
const LABELS: Record<SocialProvider, string> = { google: 'گوگل', github: 'گیت‌هاب' }

function SocialCallback() {
    const router = useRouter()
    const search = useSearchParams()
    const { provider } = useParams<{ provider: string }>()
    const called = useRef(false) // code فقط یک‌بار معتبر است؛ جلوگیری از اجرای دوباره در Strict Mode

    useEffect(() => {
        if (called.current) return
        called.current = true

        if (!PROVIDERS.includes(provider as SocialProvider)) {
            router.replace('/login')
            return
        }
        const p = provider as SocialProvider

        const code = search.get('code')
        const state = search.get('state')

        if (search.get('error') || !code || !state) {
            toast.error(`ورود با ${LABELS[p]} لغو شد یا ناموفق بود`)
            router.replace('/login')
            return
        }

        ; (async () => {
            try {
                const { data } = await googleLoginCallback(p, { code, state })
                localStorage.setItem('access_token', data.accessToken)
                localStorage.setItem('refresh_token', data.refreshToken)
                toast.success('با موفقیت وارد شدید')
                router.replace('/')
            } catch (err) {
                const message = isAxiosError(err) ? err.response?.data?.message : undefined
                toast.error(typeof message === 'string' ? message : `ورود با ${LABELS[p]} ناموفق بود`)
                router.replace('/login')
            }
        })()
    }, [provider, search, router])

    return (
        <div className="min-h-dvh flex items-center justify-center dark:bg-[#121212]">
            <p className="text-[#060425] dark:text-white-1 font-medium">در حال ورود...</p>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense>
            <SocialCallback />
        </Suspense>
    )
}