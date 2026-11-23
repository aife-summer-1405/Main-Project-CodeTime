'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fa } from '@/lib/format'
import { getErrorMessage, getFinanceDashboard, type FinanceDashboard } from '@/lib/dashboard/dashboardApi'

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const toFaDigit = (n: number) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)])

const SHAPE = [0.16, 0.47, 0.46, 0.59, 0.26, 0.62, 0.6, 0.9, 0.72, 1]
const DEFAULT_SELECTED = 2

const TOOLTIP_W = 180

export default function IncomeChart() {
    const [data, setData] = useState<FinanceDashboard | null>(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(DEFAULT_SELECTED)

    useEffect(() => {
        getFinanceDashboard()
            .then(setData)
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت اطلاعات مالی')))
            .finally(() => setLoading(false))
    }, [])

    const current = data?.totalCurrentMonthAmount ?? 0
    const monthLabel = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long', year: 'numeric' }).format(
        new Date()
    )

    const count = SHAPE.length
    const center = ((selected + 0.5) / count) * 100
    const thumbWidth = 28
    const thumbLeft = (selected / (count - 1)) * (100 - thumbWidth)

    return (
        <div className='flex flex-col gap-4 rounded-3xl border shadow-[0px_0px_4px_0px_#005EA433] border-gray-100 bg-[#f5f5f5] p-5 dark:border-white/10 dark:bg-[#121212]'>
            <div className='flex items-center justify-between'>
                <h3 className='text-base font-bold text-[#060425] dark:text-white'>آمار درآمد ها</h3>

                <button
                    type='button'
                    className='flex items-center gap-2 rounded-lg border border-[#0087CA] px-3 py-1.5 text-sm text-[#0087CA]'
                >
                    <span>{monthLabel}</span>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                        <path d='M6 9l6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                </button>
            </div>

            {loading ? (
                <div className='h-52 animate-pulse rounded-lg bg-gray-200 dark:bg-[#3c3c3cbd]' />
            ) : (
                <>
                    <div dir='ltr' className='relative px-2 pt-[72px]'>
                        <div className='relative h-[80px]'>
                            <div
                                className='pointer-events-none absolute z-10'
                                style={{
                                    bottom: `calc(${SHAPE[selected] * 100}% + 12px)`,
                                    left: `clamp(${TOOLTIP_W / 2}px, ${center}%, calc(100% - ${TOOLTIP_W / 2}px))`,
                                    width: TOOLTIP_W,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <div
                                    dir='rtl'
                                    className='flex flex-col items-center gap-1 rounded-md bg-[#0A9D77] px-3 py-2 text-white'
                                >
                                    <span className='text-xs'>درآمد ماه جاری</span>
                                    <span className='text-sm font-bold'>{fa(current)}</span>
                                </div>
                            </div>
                            <div
                                className='absolute z-10 h-2 w-3 bg-[#0A9D77]'
                                style={{
                                    bottom: `calc(${SHAPE[selected] * 100}% + 4px)`,
                                    left: `${center}%`,
                                    transform: 'translateX(-50%)',
                                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                }}
                            />

                            <div className='flex h-full items-end'>
                                {SHAPE.map((ratio, i) => (
                                    <button
                                        key={i}
                                        type='button'
                                        onClick={() => setSelected(i)}
                                        aria-label={`ستون ${toFaDigit(i + 1)}`}
                                        className='flex h-full flex-1 items-end justify-center'
                                    >
                                        <span
                                            className={` rounded-full transition-all ${i === selected ? 'bg-[#0A9D77] w-[5px]' : 'bg-[#8A8799] w-[3px] dark:bg-[#5b5873]'
                                                }`}
                                            style={{ height: `${ratio * 100}%`, minHeight: 6 }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='mt-2 flex'>
                            {SHAPE.map((_, i) => (
                                <span
                                    key={i}
                                    className={`flex-1 text-center text-sm font-bold ${i === selected ? 'text-[#060425] dark:text-white' : 'text-[#3a3750] dark:text-gray-300'
                                        }`}
                                >
                                    {toFaDigit(i + 1)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div dir='ltr' className='relative mx-2 h-1.5 rounded-full bg-[#B9B7C4] dark:bg-white/20'>
                        <div
                            className='absolute top-0 h-full rounded-full bg-[#0087CA] transition-all'
                            style={{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}