'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Star, X } from 'lucide-react'
import FilterSelect from '../../../common/FilterSelect'

type Option = { label: string; value: string }

const ring = (error?: string) => (error ? 'border-[#ED053F]' : 'border-[#28A5E6]')

const Error = ({ text }: { text?: string }) => (text ? <p className='mt-1 text-[11px] text-[#ED053F]'>{text}</p> : null)

export function TextField({
    label,
    value,
    onChange,
    type = 'text',
    error,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    type?: 'text' | 'number'
    error?: string
}) {
    return (
        <div>
            <label className={`relative flex h-12 items-center rounded-2xl border bg-transparent px-3 ${ring(error)}`}>
                {value && <span className='absolute right-3 top-1 text-[9px] text-[#8A8997]'>{label}</span>}
                <input
                    type={type}
                    min={type === 'number' ? 0 : undefined}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={label}
                    className={`h-full w-full bg-transparent text-xs text-[#060425] outline-none placeholder:text-[#28A5E6] dark:text-white ${value ? 'pt-3' : ''}`}
                />
            </label>
            <Error text={error} />
        </div>
    )
}

export function RateField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    const handle = (raw: string) => {
        if (raw === '') return onChange('')
        if (!/^\d?\.?\d?$/.test(raw)) return
        onChange(Number(raw) > 5 ? '5' : raw)
    }

    return (
        <label className={`relative flex h-12 items-center rounded-2xl border bg-transparent px-3 ${ring()}`}>
            {value && <span className='absolute right-3 top-1 text-[9px] text-[#8A8997]'>{label}</span>}
            <input
                type='text'
                inputMode='decimal'
                value={value}
                onChange={(e) => handle(e.target.value)}
                placeholder={label}
                className={`h-full w-full bg-transparent text-xs text-[#060425] outline-none placeholder:text-[#28A5E6] dark:text-white ${value ? 'pt-3' : ''}`}
            />
            <Star size={16} className='shrink-0 text-[#28A5E6]' />
        </label>
    )
}

export function TextArea({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <label className='relative block rounded-2xl border border-[#28A5E6] px-3 pb-3 pt-5'>
            <span className='absolute right-3 top-2 text-[10px] text-[#8A8997]'>{label}</span>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={5}
                className='w-full resize-none bg-transparent text-xs leading-6 text-[#060425] outline-none dark:text-white'
            />
        </label>
    )
}

export function SelectField({
    label,
    value,
    options,
    onChange,
    error,
}: {
    label: string
    value: string
    options: Option[]
    onChange: (value: string) => void
    error?: string
}) {
    return (
        <div>
            <FilterSelect label={label} value={value} options={options} onChange={onChange} className='w-full' allowAll={false} />
            <Error text={error} />
        </div>
    )
}

const MAX_CUSTOM_LENGTH = 25

export function MultiSelect({
    label,
    values,
    options,
    onChange,
    allowCustom = true,
    customPlaceholder = 'برچسب دلخواه بنویسید',
}: {
    label: string
    values: string[]
    options: Option[]
    onChange: (values: string[]) => void
    allowCustom?: boolean
    customPlaceholder?: string
}) {
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState('')
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) return
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [open])

    useEffect(() => {
        if (open && allowCustom) inputRef.current?.focus()
    }, [open, allowCustom])

    const toggle = (value: string) =>
        onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value])

    const addCustom = () => {
        const value = draft.trim().replace(/\s+/g, ' ')
        if (!value) return
        const match = options.find((o) => o.label === value || o.value === value)?.value ?? value
        if (!values.includes(match)) onChange([...values, match])
        setDraft('')
        inputRef.current?.focus()
    }

    return (
        <div ref={ref} className='relative'>
            <div
                role='button'
                tabIndex={0}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen((v) => !v)}
                className='relative flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-2xl border border-[#28A5E6] px-3 py-2'
            >
                {values.length > 0 && <span className='absolute right-3 top-1 text-[9px] text-[#8A8997]'>{label}</span>}
                <div className={`flex flex-wrap gap-1.5 ${values.length ? 'pt-3' : ''}`}>
                    {values.length === 0 && <span className='text-xs text-[#28A5E6]'>{label}</span>}
                    {values.map((v) => (
                        <span key={v} className='flex h-6 items-center gap-1 rounded-full bg-[#0887CA] px-2.5 text-[10px] text-white'>
                            {v}
                            <button
                                type='button'
                                aria-label={`حذف ${v}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggle(v)
                                }}
                                className='cursor-pointer'
                            >
                                <X size={11} />
                            </button>
                        </span>
                    ))}
                </div>
                <ChevronDown size={16} className={`shrink-0 text-[#28A5E6] transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className='absolute left-0 right-0 top-full z-30 mt-1.5 flex max-h-72 flex-col gap-1 overflow-hidden rounded-2xl border border-[#DCEEF4] bg-white p-1.5 shadow-[0px_0px_12px_0px_#0887CA40] dark:border-[#2A2A2A] dark:bg-[#1C1C1C]'>
                    {allowCustom && (
                        <div className='flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#28A5E6] px-2 pr-3'>
                            <input
                                ref={inputRef}
                                type='text'
                                value={draft}
                                maxLength={MAX_CUSTOM_LENGTH}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
                                    e.preventDefault()
                                    addCustom()
                                }}
                                placeholder={customPlaceholder}
                                className='h-full min-w-0 flex-1 bg-transparent text-xs text-[#060425] outline-none placeholder:text-[#8A8997] dark:text-white'
                            />
                            <button
                                type='button'
                                onClick={addCustom}
                                disabled={!draft.trim()}
                                className='flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-[#0887CA] px-2.5 text-[11px] text-white transition disabled:cursor-not-allowed disabled:opacity-40'
                            >
                                <Plus size={13} />
                                افزودن
                            </button>
                        </div>
                    )}

                    <ul className='flex min-h-0 flex-col gap-1 overflow-y-auto'>
                        {options.map((o) => {
                            const active = values.includes(o.value)
                            return (
                                <li key={o.value}>
                                    <button
                                        type='button'
                                        onClick={() => toggle(o.value)}
                                        className={`flex h-9 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-right text-xs transition-colors ${active ? 'bg-[#EAF6FA] font-bold text-[#0087CA] dark:bg-[#0087CA22]' : 'text-[#060425] hover:bg-[#F5F5F5] dark:text-white dark:hover:bg-[#121212]'}`}
                                    >
                                        <span>{o.label}</span>
                                        {active && <Check size={14} />}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}