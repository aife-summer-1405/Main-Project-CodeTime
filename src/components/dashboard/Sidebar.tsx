'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { menus, type Role } from '@/lib/dashboard/config'
import UserCard from './UserCard'
import LogoType from '../logo/logo-type'

type Props = { role: Role; collapsible?: boolean; onNavigate?: () => void; onLogout: () => void }

export default function Sidebar({ role, collapsible, onNavigate, onLogout }: Props) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const slim = !!collapsible && collapsed

    return (
        <motion.aside
            initial={false}
            animate={{ width: slim ? 78 : 210 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className='shadow-[0px_0px_8px_0px_#0887CA26] relative z-1000 flex h-full flex-col overflow-hidden rounded-3xl border border-[#DCEEF4] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#121212] p-3'
        >
            <div className='shrink-0'>
                <LogoType textSize={slim ? '10px' : '32px'} />

                <div className='relative my-3.5 flex h-14 items-center justify-center'>
                    {!slim && <img className='h-14' src='/images/vector (3).svg' alt='' />}

                    {collapsible && (
                        <button
                            type='button'
                            onClick={() => setCollapsed((v) => !v)}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center ${slim ? '' : 'absolute left-24 top-[50%] -translate-x-1/2 -translate-y-1/2'}`}
                        >
                            <img className='h-4 transition-transform duration-300 dark:rounded-[4px] dark:bg-[#ccc]' src='/images/3.svg' alt='' />
                        </button>
                    )}
                </div>
            </div>

            <nav className='menuDashRight flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto'>
                {menus[role].map(({ label, href, icon: Icon }) => {
                    const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            title={slim ? label : undefined}
                            className={`relative flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors ${slim ? 'justify-center' : ''} ${active ? `${role === 'buyer' ? 'bg-[#005EA4]' : 'bg-[#10088F]'} text-white` : 'text-[#060425] hover:bg-[#EAF6FA] hover:text-[#0069A6] dark:text-white dark:hover:bg-[#1C1C1C] dark:hover:text-[#38A9E0]'}`}
                        >
                            <Icon className='shrink-0' />
                            <AnimatePresence initial={false}>
                                {!slim && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className='overflow-hidden whitespace-nowrap'
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>

            <div className='shrink-0'>
                <UserCard role={role} slim={slim} onLogout={onLogout} onNavigate={onNavigate} />
            </div>
        </motion.aside>
    )
}