'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
    open: boolean
    onClose: () => void
    title?: string
    className?: string
    children: ReactNode
}

export default function Modal({ open, onClose, title, className = 'max-w-md', children }: Props) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onMouseDown={onClose}
                    className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4'
                >
                    <motion.div
                        role='dialog'
                        aria-modal='true'
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.2 }}
                        onMouseDown={e => e.stopPropagation()}
                        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-[#F5F5F5] p-5 shadow-xl dark:bg-[#121212] ${className}`}
                    >
                        {title && (
                            <header className='mb-5 flex items-center justify-between border-b border-[#0887CA33] pb-2'>
                                <h2 className='text-sm font-bold text-[#0087CA]'>{title}</h2>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className='flex cursor-pointer items-center gap-1 text-[10px] text-[#8A8997] active:scale-[0.9] transition-all duration-300'
                                >
                                    <X size={12} className='text-[#E5484D]' />
                                    بستن
                                </button>
                            </header>
                        )}
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}