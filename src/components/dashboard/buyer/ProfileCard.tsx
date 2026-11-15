
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserById, UserProfileResponse } from '@/lib/Api/user'

export default function ProfileCard() {
    const [profile, setProfile] = useState<UserProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem('userId')

                if (!userId) return

                const data = await getUserById(userId)
                setProfile(data)
            } catch (error) {
                console.error('Profile Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const completion = profile?.additionalPercentage ?? 0

    const updatedAt = profile?.user.updatedAt
        ? new Date(profile.user.updatedAt).toLocaleDateString('fa-IR')
        : '---'

    return (
        <section className='rounded-2xl bg-[#F5F5F5] p-4 shadow-[0px_0px_4px_0px_#005EA433] dark:border-[#2A2A2A] dark:bg-[#121212]'>
            <div className='relative flex justify-center'>
                <p className='absolute right-0 top-0 text-[8px] text-[#8A8997] [writing-mode:vertical-rl]'>
                    آخرین تغییرات: {updatedAt}
                </p>

                <div
                    className='flex h-20 w-20 items-center justify-center rounded-full p-3 transition-all duration-700'
                    style={{
                        background: `conic-gradient(#0087CA 0 ${completion}%, #BFC0C8 ${completion}% 100%)`
                    }}
                >
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-[#F5F5F5] text-base font-bold text-[#0087CA] dark:bg-[#121212]'>
                        {loading ? '...' : `${completion.toLocaleString('fa-IR')}٪`}
                    </span>
                </div>
            </div>

            <div className='mt-4 text-center'>
                <h3 className='text-xs font-bold'>
                    وضعیت پروفایل شما
                </h3>

                <p className='mt-2 text-[9px] leading-5 text-[#777] dark:text-[#A1A1AA]'>
                    برای اینکه بتوانید خرید خوبی داشته باشید، پروفایل شما باید حداقل ۷۰٪ تکمیل شده باشد.
                </p>

                <Link
                    href='/dashboard/account'
                    className='mt-3 inline-flex h-7 items-center rounded-lg border border-[#0087CA] px-6 text-[10px] text-[#0087CA] transition hover:bg-[#0087CA] hover:text-white'
                >
                    ویرایش پروفایل
                </Link>
            </div>
        </section>
    )
}
