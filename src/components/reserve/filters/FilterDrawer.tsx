'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, type PanInfo, type Variants } from 'framer-motion'
import { fa } from '@/lib/format'
import Select, { Option } from './Select'

export interface Filters {
    destination: string[]
    sort: string[]
    minPrice: string[]
    maxPrice: string[]
    rooms: string[]
    bathrooms: string[]
    toilets: string[]
    parking: string[]
}

export const emptyFilters: Filters = {
    destination: [],
    sort: [],
    minPrice: [],
    maxPrice: [],
    rooms: [],
    bathrooms: [],
    toilets: [],
    parking: [],
}

const toOptions = (labels: Record<string, string>): Option[] =>
    Object.entries(labels).map(([value, label]) => ({ value, label }))

const destinations = toOptions({
    رشت: 'گیلان ، رشت',
    انزلی: 'گیلان ، بندر انزلی',
    تهران: 'تهران',
    شیراز: 'فارس ، شیراز',
    اصفهان: 'اصفهان',
    مشهد: 'خراسان رضوی ، مشهد',
})

const sorts = toOptions({
    newest: 'جدیدترین',
    cheapest: 'ارزان‌ترین',
    expensive: 'گران‌ترین',
})

const prices: Option[] = [500000, 1000000, 2000000, 5000000, 10000000, 20000000].map((p) => ({
    value: String(p),
    label: `${fa(p)} تومان`,
}))

const counts = [0, 1, 2, 3, 4, 5]

const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
}

const drawerVariants: Variants = {
    hidden: { x: '100%', opacity: 0.6 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 26,
            stiffness: 260,
            mass: 0.9,
            when: 'beforeChildren',
            staggerChildren: 0.045,
            delayChildren: 0.08,
        },
    },
    exit: { x: '100%', opacity: 0.6, transition: { type: 'tween', ease: [0.4, 0, 1, 1], duration: 0.22 } },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 24, stiffness: 320 } },
}

const Item = ({ children, className }: { children: ReactNode; className?: string }) => (
    <motion.div variants={itemVariants} className={className}>
        {children}
    </motion.div>
)

type CountPickerProps = {
    label: string
    value: string[]
    onChange: (v: string[]) => void
}

const CountPicker = ({ label, value, onChange }: CountPickerProps) => {
    const current = Number(value[0] ?? 0)

    return (
        <div className='flex flex-col gap-2.5'>
            <h4 className='text-[#060425] dark:text-white-1 text-xs'>{label}</h4>
            <div className='flex items-center justify-between'>
                {counts.map((n) => {
                    const active = current === n
                    return (
                        <button
                            key={n}
                            type='button'
                            aria-pressed={active}
                            onClick={() => onChange(n === 0 || active ? [] : [String(n)])}
                            className={`h-9 w-9 flex items-center justify-center rounded-full border text-xs font-bold cursor-pointer transition active:scale-[0.9] ${active
                                ? 'bg-blue-4 border-blue-4 text-white'
                                : n === 0
                                    ? 'border-blue-4/40 text-blue-4'
                                    : 'border-gray-1 text-[#060425] dark:text-white-1'
                                }`}
                        >
                            {fa(n)}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

type Props = {
    open: boolean
    value: Filters
    onClose: () => void
    onApply: (filters: Filters) => void
}

export default function FilterDrawer({ open, value, onClose, onApply }: Props) {
    const [f, setF] = useState<Filters>(value)
    const set = <K extends keyof Filters>(key: K, val: Filters[K]) => setF((p) => ({ ...p, [key]: val }))

    const activeCount = Object.values(f).filter((v) => v.length).length

    useEffect(() => {
        if (open) setF(value)
    }, [open, value])

    useEffect(() => {
        if (!open) return

        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)

        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [open, onClose])

    const handleSearch = () => {
        onApply(f)
        onClose()
    }

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 90 || info.velocity.x > 500) onClose()
    }

    return (
        <MotionConfig reducedMotion='user'>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key='overlay'
                            variants={overlayVariants}
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                            onClick={onClose}
                            aria-hidden='true'
                            className='fixed inset-0 z-[60] bg-black/40'
                        />

                        <motion.aside
                            key='drawer'
                            role='dialog'
                            aria-modal='true'
                            aria-label='فیلتر ها'
                            variants={drawerVariants}
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                            drag='x'
                            dragDirectionLock
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={{ left: 0, right: 0.5 }}
                            dragMomentum={false}
                            onDragEnd={handleDragEnd}
                            className='fixed px-4 top-0 right-0 z-[70] flex h-dvh w-[92vw] flex-col overflow-hidden rounded-l-[28px] bg-white shadow-2xl will-change-transform sm:w-[380px] sm:rounded-l-[32px] dark:bg-[#121212]'
                        >
                            <Item className='flex items-center justify-between border-b border-[#0887CA80] px-4 pt-5 pb-3 sm:px-5'>
                                <h2 className='text-blue-2 font-bold text-base'>فیلتر ها</h2>
                                <button
                                    type='button'
                                    disabled={activeCount === 0}
                                    onClick={() => setF(emptyFilters)}
                                    className='text-gray-1 text-[11px] cursor-pointer transition hover:text-blue-4 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    پاک کردن فیلتر ها{activeCount > 0 && ` (${fa(activeCount)})`}
                                </button>
                            </Item>

                            <div className='blue-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5'>
                                <Item>
                                    <Select
                                        label='مقصد یا هتل شما'
                                        placeholder='استان ، شهر ، هتل سراوان را ...'
                                        options={destinations}
                                        value={f.destination}
                                        onChange={(v) => set('destination', v)}
                                    />
                                </Item>

                                <Item>
                                    <Select
                                        placeholder='مرتب سازی براساس ...'
                                        options={sorts}
                                        value={f.sort}
                                        onChange={(v) => set('sort', v)}
                                    />
                                </Item>

                                <Item className='flex flex-col gap-2 mt-1'>
                                    <h3 className='text-[#060425] dark:text-white-1 font-bold text-xs'>قیمت هتل</h3>
                                    <div className='flex gap-2'>
                                        <Select placeholder='حداقل' options={prices} value={f.minPrice} onChange={(v) => set('minPrice', v)} />
                                        <Select placeholder='حداکثر' options={prices} value={f.maxPrice} onChange={(v) => set('maxPrice', v)} />
                                    </div>
                                </Item>

                                <Item className='flex flex-col gap-4 mt-1'>
                                    <h3 className='text-[#060425] dark:text-white-1 font-bold text-xs'>امکانات هتل</h3>
                                    <CountPicker label='تعداد تخت' value={f.rooms} onChange={(v) => set('rooms', v)} />
                                    <CountPicker label='تعداد حمام' value={f.bathrooms} onChange={(v) => set('bathrooms', v)} />
                                    <CountPicker label='تعداد دستشویی' value={f.toilets} onChange={(v) => set('toilets', v)} />
                                    <CountPicker label='تعداد پارکینگ' value={f.parking} onChange={(v) => set('parking', v)} />
                                </Item>
                            </div>

                            <Item className='flex gap-2.5 border-t border-black/5 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 dark:border-white/10'>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className='flex-1 h-12 flex justify-center items-center gap-2 rounded-[14px] border border-[#060425] text-[#060425] dark:text-white-1 dark:border-white-1 text-sm font-medium cursor-pointer transition active:scale-[0.97]'
                                >
                                    <X size={16} />
                                    بستن
                                </button>
                                <button
                                    type='button'
                                    onClick={handleSearch}
                                    className='flex-1 h-12 flex justify-center items-center gap-2 rounded-[14px] bg-[#060425] text-white text-sm font-medium cursor-pointer transition active:scale-[0.97]'
                                >
                                    <Search size={16} />
                                    جستجو
                                </button>
                            </Item>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </MotionConfig>
    )
}