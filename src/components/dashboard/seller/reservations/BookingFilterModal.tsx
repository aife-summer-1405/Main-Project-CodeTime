'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import { bookingStatusOptions } from '@/lib/dashboard/seller-data'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'

export type BookingFilters = { from: string; to: string; status: string }

export const emptyBookingFilters: BookingFilters = { from: '', to: '', status: '' }

export const countBookingFilters = (f: BookingFilters) => [f.from, f.to, f.status].filter(Boolean).length

type Props = {
    open: boolean
    onClose: () => void
    values: BookingFilters
    onApply: (values: BookingFilters) => void
}

// میلادی (YYYY-MM-DD) <-> شمسی
const fromISO = (s: string) =>
    s
        ? new DateObject({ date: s, format: 'YYYY-MM-DD', calendar: gregorian, locale: gregorian_en }).convert(
            persian,
            persian_fa
        )
        : null

const toISO = (d: DateObject | DateObject[] | null) =>
    d && !Array.isArray(d) ? d.convert(gregorian, gregorian_en).format('YYYY-MM-DD') : ''

const dateField =
    'relative flex h-12 items-center rounded-2xl border border-[#28A5E6] px-3 text-xs text-[#28A5E6]'

const dateInput = 'h-full w-full bg-transparent pt-3 text-xs font-bold text-[#060425] outline-none dark:text-white'

type DateFieldProps = {
    label: string
    value: string
    onChange: (iso: string) => void
    min?: string
    max?: string
}

function JalaliDateField({ label, value, onChange, min, max }: DateFieldProps) {
    return (
        <div className={dateField}>
            <span className='pointer-events-none absolute right-3 top-1 z-10 text-[9px] text-[#8A8997]'>{label}</span>
            <DatePicker
                value={fromISO(value)}
                onChange={(d) => onChange(toISO(d))}
                calendar={persian}
                locale={persian_fa}
                format='YYYY/MM/DD'
                minDate={min ? fromISO(min)! : undefined}
                maxDate={max ? fromISO(max)! : undefined}
                editable={false}
                portal
                zIndex={9999}
                calendarPosition='bottom-center'
                containerClassName='h-full w-full'
                inputClass={dateInput}
                placeholder='انتخاب تاریخ'
            />
        </div>
    )
}

export default function BookingFilterModal({ open, onClose, values, onApply }: Props) {
    const [draft, setDraft] = useState(values)

    useEffect(() => {
        if (open) setDraft(values)
    }, [open, values])

    return (
        <Modal open={open} onClose={onClose} className='max-w-sm'>
            <header className='mb-5 flex items-center justify-between border-b border-[#0887CA33] pb-2'>
                <h2 className='text-sm font-bold text-[#0087CA]'>فیلتر ها</h2>
                <button type='button' onClick={() => setDraft(emptyBookingFilters)} className='cursor-pointer text-[10px] text-[#8A8997]'>
                    پاک کردن فیلتر ها ({countBookingFilters(draft).toLocaleString('fa-IR')})
                </button>
            </header>

            <div className='flex flex-col gap-4'>
                <JalaliDateField
                    label='تاریخ رفت'
                    value={draft.from}
                    max={draft.to || undefined}
                    onChange={(from) => setDraft((d) => ({ ...d, from }))}
                />
                <JalaliDateField
                    label='تاریخ برگشت'
                    value={draft.to}
                    min={draft.from || undefined}
                    onChange={(to) => setDraft((d) => ({ ...d, to }))}
                />
                <FilterSelect
                    label='وضعیت رزرو'
                    value={draft.status}
                    options={bookingStatusOptions}
                    onChange={(status) => setDraft((d) => ({ ...d, status }))}
                    className='w-full'
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