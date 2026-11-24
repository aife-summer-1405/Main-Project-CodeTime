import Link from 'next/link'
import { Bath, Bed, Car, MapPin, Star, TreeDeciduous } from 'lucide-react'
import { fa } from '@/lib/format'
import SafeImage from '@/functions/safeImage'
import type { RentHouse } from '@/lib/Api/rent'

type Props = { house: RentHouse }

const hasYard = (value: string) => {
    const v = value.trim().toLowerCase()
    return v !== '' && v !== 'none' && v !== 'no' && v !== 'ندارد'
}

export default function RentCard({ house }: Props) {
    const isMortgage = house.transaction_type?.toLowerCase().includes('mortgage')
    const price = house.discounted_price && house.discounted_price < house.price ? house.discounted_price : house.price
    const href = `/mortgage/${house.id}`

    return (
        <article className='flex w-full flex-col gap-3 rounded-[32px] bg-white-1 p-2 shadow-[0px_0px_6px_0px_#0887CA40] transition hover:shadow-[0px_0px_10px_0px_#0887CA66] dark:bg-black-1 dark:shadow-none dark:ring-1 dark:ring-white-1/10 sm:flex-row'>
            <div className='relative h-48 w-full shrink-0 overflow-hidden rounded-[24px] sm:h-auto sm:min-h-40 sm:w-44 md:w-48'>
                <SafeImage src={house.photos[0]} alt={house.title} loading='lazy' className='absolute inset-0 size-full object-cover' />
                {/* <div className='absolute inset-x-0 top-0 h-1/2 bg-linear-[180deg,rgba(6,4,37,0.5)_0%,rgba(6,4,37,0)_100%]' /> */}
                <span className='absolute right-3 top-3 flex items-center gap-1 text-xs font-bold text-white-1'>
                    {fa(house.rate)}
                    <Star size={16} />
                </span>
            </div>

            <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 p-2'>
                <div className='flex flex-col gap-1.5'>
                    <h2 className='truncate text-base font-bold text-black-2 dark:text-white-1' title={house.title}>
                        {house.title}
                    </h2>
                    <p className='flex items-center gap-1 text-xs text-black-2/70 dark:text-white-1/70'>
                        <MapPin size={16} className='shrink-0' />
                        <span className='truncate' title={house.address}>
                            {house.address}
                        </span>
                    </p>
                </div>

                <i className='w-full border-t border-black-2/20 dark:border-white-1/20' />

                <div className='flex flex-col gap-3'>
                    <ul className='flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-black-2 dark:text-white-1'>
                        <li className='flex items-center gap-1'>
                            <Bed size={16} />
                            {fa(house.rooms)} خواب
                        </li>
                        <li className='flex items-center gap-1'>
                            <Bath size={16} />
                            {fa(house.bathrooms)} حمام
                        </li>
                        <li className='flex items-center gap-1'>
                            <Car size={16} />
                            {house.parking > 0 ? `${fa(house.parking)} پارکینگ` : 'بدون پارکینگ'}
                        </li>
                        {hasYard(house.yard_type) && (
                            <li className='flex items-center gap-1'>
                                <TreeDeciduous size={16} />
                                حیاط
                            </li>
                        )}
                    </ul>

                    <div className='flex flex-wrap items-end justify-between gap-x-3 gap-y-2'>
                        <div className='flex flex-col'>
                            <span className='text-sm font-bold text-blue-3 dark:text-blue-4'>
                                {price > 0 ? `${fa(Math.round(price))} تومان` : '—'}
                            </span>
                            <span className='text-[11px] text-black-2/60 dark:text-white-1/60'>
                                {isMortgage ? 'مبلغ رهن' : 'اجاره ماهانه'}
                                {isMortgage && house.rent_price ? ` · اجاره ${fa(Math.round(house.rent_price))} تومان` : ''}
                            </span>
                        </div>

                        <Link
                            href={href}
                            className='flex h-9 items-center rounded-[8px] border border-blue-3/50 px-4 text-xs font-medium text-blue-3/70 transition hover:border-blue-3 hover:bg-blue-3 hover:text-white-1 active:scale-[0.97] dark:border-blue-4/60 dark:text-blue-4 dark:hover:bg-blue-4 dark:hover:text-black-1'
                        >
                            مشاهده ملک
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
