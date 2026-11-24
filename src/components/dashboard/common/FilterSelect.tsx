'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

type Option = { label: string; value: string }

type Props = {
    label: string
    value: string
    onChange: (value: string) => void
    options: Option[]
    className?: string
    allowAll?: boolean
}

type Pos = { left: number; width: number; top?: number; bottom?: number }

export default function FilterSelect({ label, value, onChange, options, className = 'min-w-44', allowAll = true }: Props) {
    const trigger = useRef<HTMLButtonElement>(null)
    const list = useRef<HTMLUListElement>(null)
    const [pos, setPos] = useState<Pos | null>(null)
    const open = pos !== null
    const selected = options.find((o) => o.value === value)

    useEffect(() => {
        if (!open) return
        const close = () => setPos(null)
        const onScroll = (e: Event) => {
            if (!list.current?.contains(e.target as Node)) close()
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            e.stopPropagation()
            close()
        }
        window.addEventListener('scroll', onScroll, true)
        window.addEventListener('resize', close)
        document.addEventListener('keydown', onKey, true)
        return () => {
            window.removeEventListener('scroll', onScroll, true)
            window.removeEventListener('resize', close)
            document.removeEventListener('keydown', onKey, true)
        }
    }, [open])

    const toggle = () => {
        if (open) return setPos(null)
        const rect = trigger.current?.getBoundingClientRect()
        if (!rect) return
        const above = window.innerHeight - rect.bottom < 260 && rect.top > 260
        setPos({
            left: rect.left,
            width: rect.width,
            ...(above ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
        })
    }

    const choose = (v: string) => {
        onChange(v)
        setPos(null)
    }

    return (
        <>
            <button
                ref={trigger}
                type='button'
                onClick={toggle}
                className={`relative flex h-12 cursor-pointer items-center justify-between gap-2 rounded-2xl border bg-transparent px-3 text-right transition-colors duration-200 ${className} ${open ? 'border-blue-4 shadow-[0px_0px_8px_0px_#0887CA40] dark:border-[#38A9E0]' : 'border-blue-4'}`}
            >
                {selected && <span className='absolute right-3 top-1 text-[9px] text-[#8A8997]'>{label}</span>}
                <span className={`truncate text-xs ${selected ? 'pt-3 font-bold text-[#060425] dark:text-white' : 'text-blue-4'}`}>{selected ? selected.label : label}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className='shrink-0 text-blue-4'>
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {open && pos && (
                            <div dir='rtl' className='fixed inset-0 z-[1200]' onMouseDown={() => setPos(null)}>
                                <motion.ul
                                    ref={list}
                                    initial={{ opacity: 0, y: pos.bottom !== undefined ? 8 : -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: pos.bottom !== undefined ? 8 : -8, scale: 0.97 }}
                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom }}
                                    className='fixed flex max-h-60 flex-col gap-1 overflow-y-auto rounded-2xl border border-[#DCEEF4] bg-white p-1.5 shadow-[0px_0px_12px_0px_#0887CA40] dark:border-[#2A2A2A] dark:bg-[#1C1C1C]'
                                >
                                    {(allowAll ? [{ label: 'همه', value: '' }, ...options] : options).map((o, i) => {
                                        const active = o.value === value
                                        return (
                                            <motion.li
                                                key={o.value || 'all'}
                                                initial={{ opacity: 0, x: 8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.025, duration: 0.15 }}
                                            >
                                                <button
                                                    type='button'
                                                    onClick={() => choose(o.value)}
                                                    className={`flex h-9 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-right text-xs transition-colors ${active ? 'bg-[#EAF6FA] font-bold text-[#0087CA] dark:bg-[#0087CA22]' : 'text-[#060425] hover:bg-[#F5F5F5] dark:text-white dark:hover:bg-[#121212]'}`}
                                                >
                                                    <span>{o.label}</span>
                                                    {active && <Check size={14} />}
                                                </button>
                                            </motion.li>
                                        )
                                    })}
                                </motion.ul>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    )
}