'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DropdownOption = { value: string; label: string; disabled?: boolean }

type Props = {
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
    ariaLabel: string
    trigger: (ctx: { open: boolean; selected?: DropdownOption }) => ReactNode
    className?: string
    triggerClassName?: string
    menuClassName?: string
}

export default function Dropdown({
    options,
    value,
    onChange,
    ariaLabel,
    trigger,
    className,
    triggerClassName,
    menuClassName,
}: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const listId = useId()
    const selected = options.find((o) => o.value === value)

    useEffect(() => {
        if (!open) return
        const onPointer = (e: PointerEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div ref={ref} className={cn('relative', open && 'z-30', className)}>
            <button
                type='button'
                aria-label={ariaLabel}
                aria-haspopup='listbox'
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((v) => !v)}
                className={cn('cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-4/50', triggerClassName)}
            >
                {trigger({ open, selected })}
            </button>

            {open && (
                <ul
                    id={listId}
                    role='listbox'
                    aria-label={ariaLabel}
                    className={cn(
                        'absolute start-0 top-full mt-2 max-h-64 w-max min-w-full max-w-[80vw] overflow-y-auto rounded-[12px] border border-blue-3/30 bg-white p-1 text-sm shadow-[0_4px_16px_0_#0887CA33] dark:border-blue-4/30 dark:bg-[#1b1b1b] dark:shadow-none',
                        menuClassName
                    )}
                >
                    {options.map((option) => {
                        const active = option.value === value
                        return (
                            <li key={option.value || 'none'} role='option' aria-selected={active} aria-disabled={option.disabled}>
                                <button
                                    type='button'
                                    disabled={option.disabled}
                                    onClick={() => {
                                        onChange(option.value)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-[8px] px-3 py-2 text-start transition hover:bg-blue-3/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent',
                                        active ? 'font-medium text-blue-3 dark:text-blue-4' : 'text-black-2 dark:text-white-1'
                                    )}
                                >
                                    {option.label}
                                    {active && <Check size={14} />}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
