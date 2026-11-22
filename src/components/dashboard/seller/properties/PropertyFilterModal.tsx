'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'
import PriceRange from './PriceRange'

export type PropertyFilters = { type: string; transaction: string; low: number; high: number | null }

export const emptyPropertyFilters: PropertyFilters = { type: '', transaction: '', low: 0, high: null }

export const priceBounds = (prices: number[]) => {
    const top = Math.max(0, ...prices)
    if (top <= 0) return { max: 1, step: 1 }
    const step = Math.max(1, 10 ** Math.floor(Math.log10(top)) / 10)
    return { max: Math.ceil(top / step) * step, step }
}

export const countPropertyFilters = (f: PropertyFilters) =>
    [f.type, f.transaction, f.low > 0, f.high !== null].filter(Boolean).length

type Option = { label: string; value: string }

type Props = {
    open: boolean
    onClose: () => void
    values: PropertyFilters
    onApply: (values: PropertyFilters) => void
    typeOptions: Option[]
    transactionOptions: Option[]
    maxPrice: number
    step: number
}

export default function PropertyFilterModal({
    open,
    onClose,
    values,
    onApply,
    typeOptions,
    transactionOptions,
    maxPrice,
    step,
}: Props) {
    const [draft, setDraft] = useState(values)

    useEffect(() => {
        if (open) setDraft(values)
    }, [open, values])

    return (
        <Modal open={open} onClose={onClose} className='max-w-sm'>
            <header className='mb-5 flex items-center justify-between border-b border-[#0887CA33] pb-2'>
                <h2 className='text-sm font-bold text-[#0087CA]'>فیلتر ها</h2>
                <button
                    type='button'
                    onClick={() => setDraft(emptyPropertyFilters)}
                    className='cursor-pointer text-[10px] text-[#8A8997]'
                >
                    پاک کردن فیلتر ها ({countPropertyFilters(draft).toLocaleString('fa-IR')})
                </button>
            </header>

            <div className='flex flex-col gap-4'>
                <FilterSelect
                    label='نوع ملک'
                    value={draft.type}
                    options={typeOptions}
                    onChange={(type) => setDraft((d) => ({ ...d, type }))}
                    className='w-full'
                />
                <FilterSelect
                    label='نوع معامله'
                    value={draft.transaction}
                    options={transactionOptions}
                    onChange={(transaction) => setDraft((d) => ({ ...d, transaction }))}
                    className='w-full'
                />

                <p className='text-xs font-bold text-[#060425] dark:text-white'>قیمت</p>
                <PriceRange
                    min={0}
                    max={maxPrice}
                    step={step}
                    low={draft.low}
                    high={draft.high ?? maxPrice}
                    onChange={(low, high) => setDraft((d) => ({ ...d, low, high: high >= maxPrice ? null : high }))}
                />
            </div>

            <div className='mt-6 flex gap-3'>
                <button
                    type='button'
                    onClick={() => {
                        onApply(draft)
                        onClose()
                    }}
                    className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                >
                    اعمال فیلتر
                </button>
                <button
                    type='button'
                    onClick={onClose}
                    className='flex h-10 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                >
                    بستن
                    <X size={14} />
                </button>
            </div>
        </Modal>
    )
}
