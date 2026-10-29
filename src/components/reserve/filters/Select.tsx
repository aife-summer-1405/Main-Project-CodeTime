'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export type Option = { value: string; label: string }

interface Props {
    label?: string
    placeholder: string
    options: Option[]
    value: string[]
    onChange: (v: string[]) => void
    multiple?: boolean
}

export default function Select({ label, placeholder, options, value, onChange, multiple = false }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const selected = options.filter((o) => value.includes(o.value)).map((o) => o.label)

    const toggle = (v: string) => {
        if (multiple) {
            onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
        } else {
            onChange(value[0] === v ? [] : [v])
            setOpen(false)
        }
    }

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`w-full ${label ? 'h-14' : 'h-12'} flex items-center justify-between gap-2 rounded-[16px] border border-blue-4 px-3.5 text-right cursor-pointer transition ${open ? 'ring-2 ring-blue-4/30' : ''}`}
            >
                <span className="flex flex-col min-w-0 flex-1">
                    {label && <span className="text-[10px] text-gray-1">{label}</span>}
                    <span className={`truncate text-xs ${selected.length ? 'text-[#10088F] dark:text-white-1' : 'text-blue-4/70'}`}>
                        {selected.length ? selected.join('، ') : placeholder}
                    </span>
                </span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 text-blue-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <ul
                role="listbox"
                className={`blue-scroll absolute top-full mt-1.5 z-30 w-full max-h-48 overflow-y-auto rounded-[16px] border border-blue-4 bg-white dark:bg-[#121212] shadow-lg origin-top transition duration-200 ${open ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}
            >
                {options.map((o) => {
                    const active = value.includes(o.value)
                    return (
                        <li key={o.value}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={active}
                                onClick={() => toggle(o.value)}
                                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs text-right cursor-pointer transition hover:bg-blue-4/10 ${active ? 'text-blue-4 font-bold' : 'text-[#060425] dark:text-white-1'
                                    }`}
                            >
                                {o.label}
                                {active && <Check size={14} />}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}