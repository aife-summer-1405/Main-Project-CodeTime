import Link from 'next/link'
import { ArrowUpLeft, CalendarCheck, Home, Star, Users } from 'lucide-react'
import { fa } from '@/lib/format'

const card = 'flex h-[100px] flex-col items-center justify-center gap-1.5 rounded-xl text-center'

type Props = { users: number; houses: number; bookings: number; rating: number }

export default function AdminStatCards({ users, houses, bookings, rating }: Props) {
    const stats = [
        { label: 'کل کاربران', value: fa(users), icon: Users },
        { label: 'کل املاک', value: fa(houses), icon: Home },
        { label: 'کل رزروها', value: fa(bookings), icon: CalendarCheck },
        { label: 'میانگین امتیاز', value: fa(rating), icon: Star },
    ]

    return (
        <div className='mx-1.5 grid grid-cols-2 gap-3 sm:grid-cols-5'>
            {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className={`${card} bg-[#F5F5F5] shadow-[0px_0px_4px_0px_#005EA433] dark:bg-[#121212]`}>
                    <Icon size={18} className='text-[#10088F] dark:text-[#38A9E0]' />
                    <span className='text-sm leading-none text-[#10088F] dark:text-[#38A9E0]'>{label}</span>
                    <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]'>{value}</strong>
                </div>
            ))}

            <Link
                href='/dashboard/users'
                className={`${card} col-span-2 border-2 border-[#0887CA80] transition dark:bg-[#0B2230] dark:hover:bg-[#0F2D40] sm:col-span-1`}
            >
                <ArrowUpLeft size={16} className='text-[#0087CA]' />
                <span className='text-sm text-[#55536D] dark:text-[#A1A1AA]'>مدیریت کاربران</span>
                <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]' dir='ltr'>
                    +{fa(users)}
                </strong>
            </Link>
        </div>
    )
}
