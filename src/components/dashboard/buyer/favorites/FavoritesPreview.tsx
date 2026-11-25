'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { getFavorites, type Favorite } from '@/lib/Api/dashboard/buyer/favorites'
import { favoriteColumns } from './FavoritesList'
import DataList from '../../common/DataList'


export default function FavoritesPreview() {
    const [items, setItems] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        getFavorites(userId, 1, 4)
            .then((res) => setItems(res.data))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت علاقه‌مندی‌ها')))
            .finally(() => setLoading(false))
    }, [])

    return (
        <section className='flex min-w-0 flex-col'>
            <div className='mx-1.5 flex items-center justify-between'>
                <h3 className='text-xs font-bold text-[#060425] dark:text-white'>علاقه مندی ها</h3>
                <Link href='/dashboard/favorites' className='text-[11px] text-[#0087CA] transition hover:opacity-80'>
                    مشاهده همه
                </Link>
            </div>
            <DataList columns={favoriteColumns} rows={items} rowKey={(r) => r.id} loading={loading} emptyText='هنوز ملکی به علاقه‌مندی‌ها اضافه نکرده‌اید' />
        </section>
    )
}