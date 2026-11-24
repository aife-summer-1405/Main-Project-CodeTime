import { useEffect, useMemo, useRef, useState } from 'react'
import { getAdminUserById, type AdminUser } from '@/lib/dashboard/adminApi'

export type UserMap = Record<string, AdminUser | null>

export default function useUsers(ids: string[]) {
    const [users, setUsers] = useState<UserMap>({})
    const requested = useRef(new Set<string>())
    const key = Array.from(new Set(ids.filter(Boolean))).join(',')
    const list = useMemo(() => (key ? key.split(',') : []), [key])

    useEffect(() => {
        let active = true

        list
            .filter((id) => !requested.current.has(id))
            .forEach((id) => {
                requested.current.add(id)
                getAdminUserById(id)
                    .catch(() => null)
                    .then((user) => active && setUsers((prev) => ({ ...prev, [id]: user })))
            })

        return () => {
            active = false
        }
    }, [list])

    return users
}
