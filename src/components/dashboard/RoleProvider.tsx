'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/lib/dashboard/config'
import { getUser, getUserId } from '@/lib/Api/dashboard/common/user'
import { isLoggedIn, readRole, saveRole } from '@/lib/dashboard/role'
import { DashboardShellSkeleton } from '../skeletons/DashboardSkeletons'

const RoleContext = createContext<Role | null>(null)

export const useRole = () => {
    const role = useContext(RoleContext)
    if (!role) throw new Error('useRole باید داخل RoleProvider استفاده شود')
    return role
}

export default function RoleProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [role, setRole] = useState<Role | null>(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            const back = encodeURIComponent(window.location.pathname + window.location.search)
            router.replace(`/login?callbackUrl=${back}`)
            return
        }

        const known = readRole()
        if (known) {
            setRole(known)
            return
        }

        let active = true
        const id = getUserId()
        const lookup = id ? getUser(id).then((user) => saveRole(user.role)) : Promise.resolve(null)

        lookup
            .catch(() => null)
            .then((found) => {
                if (active) setRole(found ?? 'buyer')
            })

        return () => {
            active = false
        }
    }, [router])

    if (!role) return <DashboardShellSkeleton />

    return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>
}
