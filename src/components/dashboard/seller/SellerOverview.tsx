'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa } from '@/lib/format'
import { getDashboardSummary, getErrorMessage, type DashboardSummary } from '@/lib/dashboard/dashboardApi'
import { getSellerHouses, transactionLabel, type SellerHouse } from '@/lib/dashboard/sellerHousesApi'
import { initialProperties } from '@/lib/dashboard/seller-data'
import { OverviewSkeleton } from '@/components/skeletons/DashboardSkeletons'
import PageTitle from '../common/PageTitle'
import DataList, { type Column } from '../common/DataList'
import RowMenu from '../common/RowMenu'
import ProfileCard from '../buyer/ProfileCard'
import SellerStatCards from './SellerStatCards'
import IncomeChart from './IncomeChart'
import { emptyPropertyFilters } from './properties/PropertyFilterModal'

const PREVIEW_COUNT = 4

const columns: Column<SellerHouse>[] = [
    {
        key: 'title',
        header: 'نام اقامتگاه',
        width: '2fr',
        render: (h) => (
            <div className='flex min-w-0 items-center gap-2'>
                <SafeImage src={h.photo} className='h-8 w-10 shrink-0 rounded-md object-cover' />
                <div className='flex min-w-0 flex-col'>
                    <span title={h.title} className='truncate'>
                        {h.title}
                    </span>
                    {h.category && <span className='truncate text-[11px] opacity-60'>{h.category}</span>}
                </div>
            </div>
        ),
    },
    {
        key: 'price',
        header: 'قیمت',
        width: '1.4fr',
        render: (h) =>
            h.discountedPrice != null ? (
                <div className='flex flex-col leading-tight'>
                    <span className='font-bold text-[#0087CA]'>{fa(h.discountedPrice)} تومان</span>
                    <span className='text-[11px] text-red-600 line-through '>{fa(h.price)} تومان</span>
                </div>
            ) : (
                <span className='font-bold text-[#0087CA]'>{fa(h.price)} تومان</span>
            ),
    },
    {
        key: 'rate',
        header: 'امتیازات',
        width: '0.8fr',
        render: (h) => (
            <span className='flex items-center gap-1'>
                <Star size={14} color='#060425' />
                {h.rate.toLocaleString('fa-IR')}
            </span>
        ),
    },
    {
        key: 'transaction',
        header: 'نوع معامله',
        width: '0.9fr',
        render: (h) => <span>{transactionLabel(h.transactionType)}</span>,
    },
]

export default function SellerOverview() {
    const router = useRouter()
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [houses, setHouses] = useState<SellerHouse[]>([])
    const [housesLoading, setHousesLoading] = useState(true)

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch(() => toast.error('دریافت آمار داشبورد با خطا مواجه شد'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        let active = true

        getSellerHouses({
            transactionType: emptyPropertyFilters.transaction,
            search: '',
            minPrice: emptyPropertyFilters.low,
            maxPrice: emptyPropertyFilters.high ?? undefined,
        })
            .then((res) => active && setHouses(res.houses.slice(0, PREVIEW_COUNT)))
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست املاک')))
            .finally(() => active && setHousesLoading(false))

        return () => {
            active = false
        }
    }, [])

    if (loading) return <OverviewSkeleton />

    const goToProperties = () => router.push('/dashboard/properties')

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>داشبورد</PageTitle>

            <div className='grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_230px]'>
                <div className='flex min-w-0 flex-col gap-4'>
                    <SellerStatCards
                        properties={summary?.houses ?? 0}
                        active={summary?.bookings.conformedBookings ?? 0}
                        pending={summary?.bookings.pendingBookings ?? 0}
                        views={initialProperties.reduce((sum, p) => sum + p.views, 0)}
                        total={summary?.bookings.bookingCount ?? 0}
                    />

                    <section className='flex min-w-0 flex-col'>
                        <div className='mx-1.5 flex items-center justify-between'>
                            <h3 className='text-xs font-bold text-[#060425] dark:text-white'>مدیریت املاک</h3>
                            <Link href='/dashboard/properties' className='text-[11px] text-[#0087CA] transition hover:opacity-80'>
                                مشاهده همه
                            </Link>
                        </div>

                        <DataList
                            columns={columns}
                            rows={houses}
                            rowKey={(h) => h.id}
                            loading={housesLoading}
                            emptyText='هنوز ملکی ثبت نکرده‌اید'
                            actions={() => (
                                <RowMenu
                                    items={[
                                        { label: 'مشاهده ملک', icon: <ExternalLink size={16} />, variant: 'primary', onClick: goToProperties },
                                        { label: 'ویرایش', icon: <Pencil size={16} />, onClick: goToProperties },
                                        { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: goToProperties },
                                    ]}
                                />
                            )}
                        />
                    </section>
                </div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1 xl:content-start'>
                    <ProfileCard />
                    <IncomeChart />
                </div>
            </div>
        </div>
    )
}