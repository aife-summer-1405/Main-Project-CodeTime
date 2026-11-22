'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'

export type MenuItem = {
    label: string
    icon?: ReactNode
    onClick: () => void
    variant?: 'primary' | 'danger' | 'warning' | 'default'
}

const variants = {
    primary: 'bg-[#0887CA] text-white',
    danger: 'text-[#ED053F]',
    warning: 'text-[#FF6B00]',
    default: 'text-[#060425] dark:text-white',
}

export default function RowMenu({ items }: { items: MenuItem[] }) {
    const button = useRef<HTMLButtonElement>(null)
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

    useEffect(() => {
        if (!pos) return
        const close = () => setPos(null)
        window.addEventListener('scroll', close, true)
        window.addEventListener('resize', close)
        return () => {
            window.removeEventListener('scroll', close, true)
            window.removeEventListener('resize', close)
        }
    }, [pos])

    const toggle = () => {
        if (pos) return setPos(null)
        const rect = button.current?.getBoundingClientRect()
        if (!rect) return
        setPos({ top: rect.bottom + 4, left: Math.max(8, Math.min(rect.left, window.innerWidth - 160)) })
    }

    return (
        <>
            <button
                ref={button}
                type='button'
                aria-label='گزینه ها'
                onClick={toggle}
                className='flex w-8 cursor-pointer items-center justify-center rounded-full p-1 text-[#55536D] hover:bg-[#EAF6FA] dark:text-[#D4D4D8] dark:hover:bg-[#1C1C1C]'
            >
                <MoreVertical size={16} />
            </button>

            {pos &&
                createPortal(
                    <div dir='rtl' className='fixed inset-0 z-[90]' onMouseDown={() => setPos(null)}>
                        <div
                            style={{ top: pos.top, left: pos.left }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className='fixed flex w-36 flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0px_0px_8px_0px_#0887CA40] dark:bg-[#1C1C1C]'
                        >
                            {items.map(({ label, icon, onClick, variant = 'default' }) => (
                                <button
                                    key={label}
                                    type='button'
                                    onClick={() => {
                                        setPos(null)
                                        onClick()
                                    }}
                                    dir='ltr'
                                    className={`flex h-9 cursor-pointer items-center justify-between rounded-lg px-3 text-xs transition active:scale-[0.95] ${variants[variant]}`}
                                >
                                    <span>{label}</span>
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}
