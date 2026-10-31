'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { logoutUser } from '@/lib/Api/authApi'

export default function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        if (isLoading) return
        setIsLoading(true)

        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                await logoutUser({ refreshToken })
            }
            toast.success('با موفقیت خارج شدید')
        } catch {
            toast.error('خطا در ارتباط با سرور، از حساب خارج شدید')
        } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setIsLoading(false)
            router.push('/login')
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="h-12 px-6 flex justify-center items-center rounded-[16px] bg-red-1 active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <p className="text-white font-medium text-[14px]">
                {isLoading ? 'در حال خروج...' : 'خروج از حساب'}
            </p>
        </button>
    )
}