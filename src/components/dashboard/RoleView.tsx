'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Role } from '@/lib/dashboard/config'
import { useRole } from './RoleProvider'

export function NoAccess() {
    return (
        <div className='flex min-h-[320px] flex-col items-center justify-center gap-4 text-center'>
            <p className='text-sm font-bold text-[#060425] dark:text-white'>این بخش برای حساب شما در دسترس نیست.</p>
            <Link
                href='/dashboard'
                className='rounded-xl bg-[#10088F] px-6 py-2.5 text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
            >
                بازگشت به داشبورد
            </Link>
        </div>
    )
}

export default function RoleView({ views }: { views: Partial<Record<Role, ReactNode>> }) {
    const role = useRole()
    return <>{views[role] ?? <NoAccess />}</>
}

export function RoleGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
    const role = useRole()
    return allow.includes(role) ? <>{children}</> : <NoAccess />
}
