import { Check, MoreVertical, Minus, X } from 'lucide-react'
import { reservations, type ReservationStatus } from '@/lib/dashboard/buyer-data'

const columns = 'grid grid-cols-[2.2fr_1.3fr_0.9fr_1.6fr_0.7fr_30px] items-center gap-2 px-3'

const statusIcon: Record<ReservationStatus, { src: string }> = {
    success: { src: '/images/success.png' },
    pending: { src: '/images/Frame 24.png' },
    cancel: { src: '/images/Frame 25.png' },
}

export default function ReservationsTable() {
    return (
        <div className='overflow-x-auto'>
            <div className='flex min-w-[620px] flex-col gap-2 mx-1.5 pb-2'>
                <div className={`${columns} h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[10px] text-[#8A8997]`}>
                    <span>نام اقامتگاه</span>
                    <span>تاریخ رزرو</span>
                    <span>زمان رزرو</span>
                    <span>قیمت</span>
                    <span>وضعیت</span>
                    <span />
                </div>

                {reservations.map(({ id, hotel, date, time, price, status, image }) => {
                    const { src } = statusIcon[status]

                    return (
                        <div
                            key={id}
                            className={`${columns} h-[52px] rounded-xl bg-[#F5F5F5] text-[11px] text-[#343343] shadow-[0px_0px_4px_0px_#005EA433] dark:border-[#2A2A2A] dark:bg-[#121212] dark:text-[#D4D4D8]`}
                        >
                            <div className='flex min-w-0 items-center gap-2'>
                                <img
                                    src={image}
                                    alt=''
                                    className='h-8 w-8 shrink-0 rounded-md object-cover'
                                />
                                <span className='truncate'>{hotel}</span>
                            </div>

                            <span>{date}</span>

                            <span>{time}</span>

                            <span className='font-bold text-[#0087CA]'>
                                {price} تومان
                            </span>

                            <span className='flex items-center '>
                                <img
                                    src={src}
                                    alt={status}
                                    className='h-5 w-5 shrink-0 object-contain'
                                />
                            </span>

                            <button
                                type='button'
                                aria-label='گزینه ها'
                                className='rounded-md p-1 text-[#55536D] hover:bg-[#EAF6FA] dark:text-[#D4D4D8] dark:hover:bg-[#1C1C1C]'
                            >
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
