'use client'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import {
    BedDouble,
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    House,
    Landmark,
    School,
    Store,
    Tent,
    Trees,
    Waves,
    type LucideProps,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryLabel } from '@/lib/Api/blog'
import type { RentCategory } from '@/lib/Api/rent'
import Bone from '@/components/skeletons/Bone'

type Props = {
    categories: RentCategory[]
    loading: boolean
    active: string
    onSelect: (name: string) => void
}

const ICONS: [RegExp, ComponentType<LucideProps>][] = [
    [/apartment|آپارتمان/i, Building2],
    [/school|مدرسه/i, School],
    [/pool|استخر/i, Waves],
    [/office|اداری/i, Briefcase],
    [/store|shop|فروشگاه|مغازه/i, Store],
    [/suite|سوئیت/i, BedDouble],
    [/cottage|کلبه/i, Tent],
    [/garden|باغ/i, Trees],
    [/traditional|سنتی|eco|بوم/i, Landmark],
    [/villa|ویلا/i, House],
]

const iconFor = (name: string) => ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? House

const arrow =
    'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-blue-3/70 text-blue-3 transition hover:bg-blue-3/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent dark:border-blue-4/70 dark:text-blue-4'

export default function RentCategories({ categories, loading, active, onSelect }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [canLeft, setCanLeft] = useState(false)
    const [canRight, setCanRight] = useState(false)

    const measure = useCallback(() => {
        const el = ref.current
        if (!el) return
        const rtl = getComputedStyle(el).direction === 'rtl'
        const max = el.scrollWidth - el.clientWidth
        const pos = Math.abs(el.scrollLeft)
        const x = rtl ? max - pos : pos
        setCanLeft(x > 1)
        setCanRight(x < max - 1)
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(el)
        return () => observer.disconnect()
    }, [measure, categories, loading])

    const scroll = (dir: 1 | -1) => {
        const el = ref.current
        if (!el) return
        el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.7, 160), behavior: 'smooth' })
    }

    return (
        <div className='flex items-center gap-3'>
            <button type='button' aria-label='بعدی' disabled={!canRight} onClick={() => scroll(1)} className={arrow}>
                <ChevronRight size={18} />
            </button>

            <div
                ref={ref}
                onScroll={measure}
                className='flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => <Bone key={i} className='h-16 w-24 shrink-0 rounded-[12px]' />)
                    : categories.map((category) => {
                          const Icon = iconFor(category.name)
                          const on = active === category.name
                          return (
                              <button
                                  key={category.id}
                                  type='button'
                                  aria-pressed={on}
                                  onClick={() => onSelect(on ? '' : category.name)}
                                  className={cn(
                                      'flex min-w-24 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-[12px] px-4 py-2 text-xs transition active:scale-[0.97]',
                                      on
                                          ? 'bg-blue-3/10 font-bold text-blue-3 dark:bg-blue-4/15 dark:text-blue-4'
                                          : 'text-black-2/70 hover:bg-blue-3/5 dark:text-white-1/70 dark:hover:bg-white-1/5'
                                  )}
                              >
                                  <Icon size={28} strokeWidth={1.5} />
                                  <span className='whitespace-nowrap'>{categoryLabel(category.name)}</span>
                              </button>
                          )
                      })}
            </div>

            <button type='button' aria-label='قبلی' disabled={!canLeft} onClick={() => scroll(-1)} className={arrow}>
                <ChevronLeft size={18} />
            </button>
        </div>
    )
}
