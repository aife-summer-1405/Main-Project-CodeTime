'use client'

import { useState } from 'react'
import Modal from './Modal';

type Props = { open: boolean; onClose: () => void }

const options = [
    { key: 'reserve', label: 'نوتیفیکیشن رزرو' },
    { key: 'payment', label: 'نوتیفیکیشن پرداخت' },
    { key: 'discount', label: 'نوتیفیکیشن تخفیف' },
    { key: 'system', label: 'نوتیفیکیشن سیستمی' },
]

export default function NotificationModal({ open, onClose }: Props) {
    const [enabled, setEnabled] = useState<Record<string, boolean>>({
        reserve: true,
        payment: true,
        discount: false,
        system: true,
    })

    const toggle = (key: string) => setEnabled(prev => ({ ...prev, [key]: !prev[key] }))

    return (
        <Modal open={open} onClose={onClose} title='تنظیمات نوتیفیکیشن' className='max-w-sm'>
            <ul className='flex flex-col gap-4'>
                {options.map(({ key, label }) => (
                    <li key={key} className='flex items-center justify-between'>
                        <span className='text-xs text-[#55536D] dark:text-[#D4D4D8]'>{label}</span>
                        <button
                            type='button'
                            role='switch'
                            aria-checked={enabled[key]}
                            aria-label={label}
                            dir='ltr'
                            onClick={() => toggle(key)}
                            className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ${enabled[key]
                                    ? 'border-[#05ED6A] bg-[#05ED6A1A]'
                                    : 'border-[#06042580] bg-[#0604251A] dark:border-[#71717A] dark:bg-[#2A2A2A]'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300 ${enabled[key] ? 'left-[18px] bg-[#05ED6A]' : 'left-0.5 bg-[#06042580] dark:bg-[#A1A1AA]'
                                    }`}
                            />
                        </button>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}