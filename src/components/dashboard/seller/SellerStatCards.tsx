import Link from 'next/link'
import { ArrowUpLeft } from 'lucide-react'
import { fa } from '@/lib/format'

const card = 'flex h-[100px] flex-col items-center justify-center gap-1.5 rounded-xl text-center'

type Props = { properties: number; active: number; pending: number; views: number; total: number }

export default function SellerStatCards({ properties, active, pending, views, total }: Props) {
    const stats = [
        { label: 'کل املاک', value: properties, icon: '/images/seller/allHouses.svg' },
        { label: 'رزرو های فعال', value: active, icon: '/images/seller/activeReserve.svg' },
        { label: 'رزرو های انتظار', value: pending, icon: '/images/seller/pendingReserve.svg' },
        { label: 'بازدیدها', value: views, icon: '/images/seller/view.svg' },
    ]

    return (
        <div className='mx-1.5 grid grid-cols-2 gap-3 sm:grid-cols-5'>
            {stats.map(({ label, value, icon }) => (
                <div key={label} className={`${card} bg-[#F5F5F5] shadow-[0px_0px_4px_0px_#005EA433] dark:bg-[#121212]`}>
                    <img src={icon} alt='' className='h-[18px] w-[18px]' />
                    <span className='text-sm leading-none text-[#10088F] dark:text-[#38A9E0]'>{label}</span>
                    <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]'>{fa(value)}</strong>
                </div>
            ))}

            <Link
                href='/dashboard/reservations'
                className={`${card} col-span-2 border-2 border-[#0887CA80] transition dark:bg-[#0B2230] dark:hover:bg-[#0F2D40] sm:col-span-1`}
            >
                <ArrowUpLeft size={16} className='text-[#0087CA]' />
                <span className='text-sm text-[#55536D] dark:text-[#A1A1AA]'>مشاهده همه</span>
                <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]' dir='ltr'>
                    +{fa(total)}
                </strong>
            </Link>
        </div>
    )
}