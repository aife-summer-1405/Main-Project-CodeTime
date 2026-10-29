'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, type PanInfo, type Variants } from 'framer-motion'
import { fa } from '@/lib/format'
import Select, { Option } from './Select'

/* ---------- Types ---------- */

export type Filters = {
  destination: string[]
  sort: string[]
  facilities: string[]
  minPrice: string[]
  maxPrice: string[]
  beds: number | null
  baths: number | null
  toilets: number | null
  parking: number | null
}

export const emptyFilters: Filters = {
  destination: [],
  sort: [],
  facilities: [],
  minPrice: [],
  maxPrice: [],
  beds: null,
  baths: null,
  toilets: null,
  parking: null,
}

type CountKey = 'beds' | 'baths' | 'toilets' | 'parking'

/* ---------- Options ---------- */

const destinations: Option[] = [
  { value: 'rasht', label: 'گیلان ، رشت' },
  { value: 'anzali', label: 'گیلان ، بندر انزلی' },
  { value: 'tehran', label: 'تهران' },
  { value: 'shiraz', label: 'فارس ، شیراز' },
  { value: 'isfahan', label: 'اصفهان' },
  { value: 'mashhad', label: 'خراسان رضوی ، مشهد' },
]

const sorts: Option[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheapest', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'rating', label: 'بیشترین امتیاز' },
]

const facilities: Option[] = [
  { value: 'wifi', label: 'وای‌فای' },
  { value: 'parking', label: 'پارکینگ' },
  { value: 'pool', label: 'استخر' },
  { value: 'breakfast', label: 'صبحانه' },
  { value: 'elevator', label: 'آسانسور' },
  { value: 'heating', label: 'سیستم گرمایش' },
]

const prices: Option[] = [500000, 1000000, 2000000, 5000000, 10000000, 20000000].map((p) => ({
  value: String(p),
  label: `${fa(p)} تومان`,
}))

const counters: { key: CountKey; label: string }[] = [
  { key: 'beds', label: 'تخت' },
  { key: 'baths', label: 'حمام' },
  { key: 'toilets', label: 'دستشویی' },
  { key: 'parking', label: 'پارکینگ' },
]

/* ---------- Animations (transform + opacity only) ---------- */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// panel slides in from the right, then children stagger in
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
  exit: {
    x: '100%',
    opacity: 0.6,
    transition: { type: 'tween', ease: [0.4, 0, 1, 1], duration: 0.22 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 24, stiffness: 320 } },
}

/* ---------- Small components ---------- */

// picks up the parent's stagger
const Item = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
)

type CounterProps = {
  label: string
  value: number | null
  onChange: (v: number | null) => void
}

const Counter = ({ label, value, onChange }: CounterProps) => (
  <Item className='flex flex-col gap-2'>
    <p className='text-xs text-gray-1'>تعداد {label}</p>

    <div className='flex items-center justify-between'>
      {[0, 1, 2, 3, 4, 5].map((n) => {
        const active = value === n
        return (
          <motion.button
            key={n}
            type='button'
            onClick={() => onChange(active ? null : n)} // click again to clear
            aria-pressed={active}
            whileTap={{ scale: 0.85 }}
            animate={{ scale: active ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className={`h-8 w-8 rounded-full border text-xs cursor-pointer transition-colors ${active
              ? 'bg-blue-4 border-blue-4 text-white font-bold'
              : 'border-[#10088F] text-[#10088F] dark:text-white-1 dark:border-white-1 hover:bg-blue-4/10'
              }`}
          >
            {fa(n)}
          </motion.button>
        )
      })}
    </div>
  </Item>
)

/* ---------- Drawer ---------- */

type Props = {
  open: boolean
  onClose: () => void
  onApply: (filters: Filters) => void
}

export default function FilterDrawer({ open, onClose, onApply }: Props) {
  const [f, setF] = useState<Filters>(emptyFilters)
  const set = <K extends keyof Filters>(key: K, val: Filters[K]) => setF((p) => ({ ...p, [key]: val }))

  const activeCount =
    [f.destination, f.sort, f.facilities, f.minPrice, f.maxPrice].filter((a) => a.length).length +
    [f.beds, f.baths, f.toilets, f.parking].filter((n) => n !== null).length

  // close on Escape + lock page scroll while open
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

  // swipe right to dismiss on touch devices
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90 || info.velocity.x > 500) onClose()
  }

  return (
    // respects the OS "reduce motion" setting
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
              {/* header */}
              <Item className='flex items-center justify-between px-4 pt-5 pb-3 sm:px-5'>
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
              <Item className='w-full border-t py-3.5 border-[#0887CA80]'>
                <i ></i>
              </Item>
              {/* scrollable content */}
              <div className='blue-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 sm:px-5'>
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

                <Item>
                  <Select
                    placeholder='امکانات هتل'
                    options={facilities}
                    value={f.facilities}
                    onChange={(v) => set('facilities', v)}
                    multiple
                  />
                </Item>

                <Item className='flex flex-col gap-2 mt-1'>
                  <h3 className='text-[#060425] dark:text-white-1 font-bold text-xs'>قیمت هتل</h3>
                  <div className='flex gap-2'>
                    <Select placeholder='حداقل' options={prices} value={f.minPrice} onChange={(v) => set('minPrice', v)} />
                    <Select placeholder='حداکثر' options={prices} value={f.maxPrice} onChange={(v) => set('maxPrice', v)} />
                  </div>
                </Item>

                <div className='flex flex-col gap-4 mt-1'>
                  <Item>
                    <h3 className='text-[#060425] dark:text-white-1 font-bold text-xs'>امکانات هتل</h3>
                  </Item>

                  {counters.map(({ key, label }) => (
                    <Counter key={key} label={label} value={f[key]} onChange={(v) => set(key, v)} />
                  ))}
                </div>
              </div>

              {/* actions: pinned so they stay reachable on short screens */}
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