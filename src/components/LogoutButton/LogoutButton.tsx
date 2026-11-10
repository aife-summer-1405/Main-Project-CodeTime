'use client'
import { useState } from 'react'
import { logoutUser } from '@/lib/Api/authApi'

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        if (isLoading) return
        setIsLoading(true)

        try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) await logoutUser({ refreshToken })
        } catch {
        } finally {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.assign('/')
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