'use client'

import { fa } from '@/lib/format'

type Props = {
    min: number
    max: number
    step: number
    low: number
    high: number
    onChange: (low: number, high: number) => void
}

const thumb = [
    'pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent',
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
    '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
    '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#0887CA]',
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4',
    '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
    '[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#0887CA]',
].join(' ')

const box = 'flex h-11 flex-1 items-center gap-1.5 rounded-2xl border border-[#28A5E6] px-3 text-[11px] text-[#28A5E6]'

export default function PriceRange({ min, max, step, low, high, onChange }: Props) {
    const span = Math.max(max - min, 1)
    const percent = (value: number) => ((value - min) / span) * 100

    const setLow = (value: number) => onChange(Math.min(Math.max(value, min), high), high)
    const setHigh = (value: number) => onChange(low, Math.max(Math.min(value, max), low))

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-3'>
                <label className={box}>
                    <span>از</span>
                    <input
                        type='text'
                        min={min}
                        max={high}
                        value={low}
                        onChange={(e) => setLow(Number(e.target.value) || 0)}
                        className='w-full min-w-0 bg-transparent text-xs font-bold text-[#060425] outline-none dark:text-white'
                        dir='ltr'
                    />
                    <span className='shrink-0'>تومان</span>
                </label>
                <label className={box}>
                    <span>تا</span>
                    <input
                        type='text'
                        min={low}
                        max={max}
                        value={high}
                        onChange={(e) => setHigh(Number(e.target.value) || 0)}
                        className='w-full min-w-0 bg-transparent text-xs font-bold text-[#060425] outline-none dark:text-white'
                        dir='ltr'
                    />
                    <span className='shrink-0'>تومان</span>
                </label>
            </div>

            <div dir='rtl' className='relative mx-2 h-6'>
                <div className='absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[#DDE3E8] dark:bg-[#2A2A2A]' />
                <div
                    style={{ right: `${percent(low)}%`, left: `${100 - percent(high)}%` }}
                    className='absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#0887CA]'
                />
                <input
                    type='range'
                    aria-label='حداقل قیمت'
                    min={min}
                    max={max}
                    step={step}
                    value={low}
                    onChange={(e) => setLow(Number(e.target.value))}
                    className={thumb}
                />
                <input
                    type='range'
                    aria-label='حداکثر قیمت'
                    min={min}
                    max={max}
                    step={step}
                    value={high}
                    onChange={(e) => setHigh(Number(e.target.value))}
                    className={thumb}
                />
            </div>

            <p className='text-center text-[10px] text-[#8A8997]'>
                بازه قیمت: {fa(low)} تا {fa(high)} تومان
            </p>
        </div>
    )
}
