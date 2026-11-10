'use client'
import { useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import type { Hotel } from '@/lib/Api/house'

interface IProps {
    hotel: Hotel
}

const faNum = (n: number) => n.toLocaleString('fa-IR')

const Chevron = ({ open }: { open: boolean }) => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='#060425'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'rotate-180' : ''}`}
    >
        <path d='M6 9l6 6 6-6' />
    </svg>
)

const GuestSelect = ({ max, value, onChange }: { max: number; value: number | null; onChange: (v: number) => void }) => (
    <Listbox value={value} onChange={onChange}>
        <div className='relative'>
            <ListboxButton className='w-full flex flex-col gap-3 text-right cursor-pointer'>
                {({ open }) => (
                    <>
                        <span className='flex items-center justify-between w-full text-[14px] font-medium text-[#060425]'>
                            تعداد مسافران هتل
                            <Chevron open={open} />
                        </span>
                        <span className={`text-[14px] ${value ? 'text-[#060425] font-medium' : 'text-[#9A9A9A]'}`}>
                            {value ? `${faNum(value)} نفر` : 'انتخاب کن چند نفرین'}
                        </span>
                    </>
                )}
            </ListboxButton>

            <ListboxOptions
                transition
                className='absolute right-0 left-0 top-full mt-3 z-20 max-h-56 overflow-y-auto rounded-[12px] bg-white p-1.5 shadow-[0_8px_24px_0_#005EA426] border border-[#EEF0F4] origin-top outline-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[closed]:opacity-0 data-[closed]:-translate-y-2 data-[closed]:scale-95'
            >
                {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                    <ListboxOption
                        key={n}
                        value={n}
                        className='group flex items-center justify-between rounded-[8px] px-3 py-2.5 text-[14px] text-[#060425] cursor-pointer transition-colors duration-200 data-[focus]:bg-[#F5F5F5] data-[selected]:bg-[#009B77]/10 data-[selected]:text-[#009B77] data-[selected]:font-bold'
                    >
                        {faNum(n)} نفر
                        <svg
                            className='hidden group-data-[selected]:block'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2.2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <path d='M5 12l5 5L20 7' />
                        </svg>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </div>
    </Listbox>
)

const HotelReserveCard = ({ hotel }: IProps) => {
    const [dates, setDates] = useState<DateObject[]>([])
    const [guests, setGuests] = useState<number | null>(null)
    const [activeField, setActiveField] = useState<'in' | 'out' | null>(null)

    const [checkIn, checkOut] = dates

    const onDatesChange = (val: DateObject | DateObject[] | null) => {
        if (Array.isArray(val)) setDates(val)
        else setDates(val ? [val] : [])
    }

    const canReserve = !!(checkIn && checkOut && guests)

    const handleReserve = () => {
        if (!canReserve) return

        console.log({
            houseId: hotel.id,
            checkIn: checkIn.toDate().toISOString(),
            checkOut: checkOut.toDate().toISOString(),
            guests,
        })
    }

    return (
        <div dir='rtl' className='w-full h-full flex flex-col gap-5 sm:gap-6 p-4 sm:p-6'>
            <h2 className='text-center text-[#10088F] text-[16px] font-bold'>رزرو هتل</h2>

            <DatePicker
                range
                value={dates}
                onChange={onDatesChange}
                onClose={() => setActiveField(null)}
                calendar={persian}
                locale={persian_fa}
                minDate={new Date()}
                numberOfMonths={1}
                calendarPosition='bottom-center'
                className='teal'
                render={(_: unknown, openCalendar: () => void) => (
                    <div className='grid grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4'>
                        <button
                            type='button'
                            onClick={() => {
                                setActiveField('in')
                                openCalendar()
                            }}
                            className='flex flex-col gap-3 text-right cursor-pointer min-w-0'
                        >
                            <span className='flex items-center justify-between w-full text-[14px] font-medium text-[#060425]'>
                                تاریخ ورود
                                <Chevron open={activeField === 'in'} />
                            </span>
                            <span className={`text-[14px] ${checkIn ? 'text-[#060425] font-medium' : 'text-[#9A9A9A]'}`}>
                                {checkIn ? checkIn.format('YYYY/MM/DD') : 'انتخاب کن'}
                            </span>
                        </button>

                        <span className='mt-3 block w-2.5 h-px bg-[#9A9A9A]' />

                        <button
                            type='button'
                            onClick={() => {
                                setActiveField('out')
                                openCalendar()
                            }}
                            className='flex flex-col gap-3 text-right cursor-pointer min-w-0'
                        >
                            <span className='flex items-center justify-between w-full text-[14px] font-medium text-[#060425]'>
                                تاریخ خروج
                                <Chevron open={activeField === 'out'} />
                            </span>
                            <span className={`text-[14px] ${checkOut ? 'text-[#060425] font-medium' : 'text-[#9A9A9A]'}`}>
                                {checkOut ? checkOut.format('YYYY/MM/DD') : 'انتخاب کن'}
                            </span>
                        </button>
                    </div>
                )}
            />

            <hr className='border-[#E0E0E0]' />

            <GuestSelect max={hotel.capacity} value={guests} onChange={setGuests} />

            <hr className='border-[#E0E0E0]' />

            <div className='flex flex-col gap-3'>
                <p className='text-[14px] font-medium text-[#060425]'>
                    قیمت کل با تخفیف
                </p>

                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='text-[#111111] text-sm font-bold relative'>
                        <div className='border-t border-red-1 absolute top-[9px] left-0 w-full' />
                        {hotel.discounted_price === null ? 3000000 : faNum(hotel.discounted_price)} تومان
                    </div>

                    <span className='text-[16px] font-bold text-[#0A7FD6]'>{faNum(hotel.price)} تومان</span>
                </div>
            </div>

            <div className='w-full justify-center items-center flex'>
                <button
                    type='button'
                    onClick={handleReserve}
                    disabled={!canReserve}
                    className='w-full sm:w-[80%] h-12 rounded-[16px] bg-[#15977D] text-white text-[14px] font-bold cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    همین الان رزرو کن
                </button>
            </div>
        </div>
    )
}

export default HotelReserveCard