import { useEffect, useMemo, useRef, useState } from 'react'
import { getHouseTitle } from '@/lib/dashboard/adminContentApi'

export type HouseTitleMap = Record<string, string | null>

export default function useHouseTitles(ids: string[]) {
    const [titles, setTitles] = useState<HouseTitleMap>({})
    const requested = useRef(new Set<string>())
    const key = Array.from(new Set(ids.filter(Boolean))).join(',')
    const list = useMemo(() => (key ? key.split(',') : []), [key])

    useEffect(() => {
        let active = true

        list
            .filter((id) => !requested.current.has(id))
            .forEach((id) => {
                requested.current.add(id)
                getHouseTitle(id)
                    .catch(() => null)
                    .then((title) => active && setTitles((prev) => ({ ...prev, [id]: title })))
            })

        return () => {
            active = false
        }
    }, [list])

    return titles
}
