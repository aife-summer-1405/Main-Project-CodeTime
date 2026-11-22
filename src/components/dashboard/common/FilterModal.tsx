'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Modal from '../components/Modal'
import FilterSelect from './FilterSelect'

export type FilterField = {
    key: string
    label: string
    type?: 'text' | 'number'
    options?: { label: string; value: string }[]
}

export type FilterValues = Record<string, string>

type Props = {
    open: boolean
    onClose: () => void
    fields: FilterField[]
    values: FilterValues
    onApply: (values: FilterValues) => void
}

export default function FilterModal({ open, onClose, fields, values, onApply }: Props) {
    const [draft, setDraft] = useState<FilterValues>(values)

    useEffect(() => {
        if (open) setDraft(values)
    }, [open, values])

    const count = Object.values(draft).filter(Boolean).length
    const set = (key: string, value: string) => setDraft((d) => ({ ...d, [key]: value }))

    return (
        <Modal open={open} onClose={onClose} className='max-w-sm'>
            <header className='mb-5 flex items-center justify-between border-b border-[#0887CA33] pb-2'>
                <h2 className='text-sm font-bold text-[#0087CA]'>فیلتر ها</h2>
                <button type='button' onClick={() => setDraft({})} className='cursor-pointer text-[10px] text-[#8A8997]'>
                    پاک کردن فیلتر ها ({count})
                </button>
            </header>

            <div className='flex flex-col gap-4'>
                {fields.map(({ key, label, type = 'text', options }) =>
                    options ? (
                        <FilterSelect key={key} label={label} value={draft[key] ?? ''} options={options} onChange={(v) => set(key, v)} className='w-full' />
                    ) : (
                        <label key={key} className='relative flex h-12 items-center rounded-2xl border border-[#28A5E6] bg-white px-3 dark:bg-[#1C1C1C]'>
                            {draft[key] && <span className='absolute right-3 top-1 text-[9px] text-[#8A8997]'>{label}</span>}
                            <input
                                type={type}
                                value={draft[key] ?? ''}
                                onChange={(e) => set(key, e.target.value)}
                                placeholder={label}
                                className={`h-full w-full bg-transparent text-xs text-[#060425] outline-none dark:text-white ${draft[key] ? 'pt-3' : ''}`}
                            />
                        </label>
                    )
                )}
            </div>

            <div className='mt-6 flex gap-3'>
                <button
                    type='button'
                    onClick={() => {
                        onApply(draft)
                        onClose()
                    }}
                    className='h-10 flex-1 cursor-pointer rounded-xl bg-[#10088F] text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
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