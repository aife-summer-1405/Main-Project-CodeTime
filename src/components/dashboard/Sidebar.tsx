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
            className='menuDashRight shadow-[0px_0px_8px_0px_#0887CA26] relative z-100000 flex overflow-hidden overflow-y-scroll h-full flex-col rounded-3xl border border-[#DCEEF4] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#121212] p-3'
        >

            <LogoType textSize={slim ? '10px' : '32px'} />


            <div className='relative my-3.5 flex h-14 items-center justify-center'>
                {!slim && <img className='h-14 ' src='/images/vector (3).svg' alt='' />}

                {collapsible && (
                    <button
                        type='button'
                        onClick={() => setCollapsed((v) => !v)}
                        className={`flex h-8 w-8 items-center justify-center cursor-pointer ${slim ? '' : 'absolute left-24 top-[50%] -translate-x-1/2 -translate-y-1/2'}`}
                    >
                        <img className={`h-4 transition-transform duration-300  dark:bg-[#ccc] dark:rounded-[4px]`} src='/images/3.svg' alt='' />
                    </button>
                )}
            </div>

            <nav className='flex flex-col gap-2'>
                {menus[role].map(({ label, href, icon: Icon, badge }) => {
                    const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            title={slim ? label : undefined}
                            className={`relative flex h-10 font-medium items-center gap-3 rounded-lg px-3 text-xs transition-colors ${slim ? 'justify-center' : ''} ${active ? `${role === 'seller' ? 'bg-[#10088F]' : 'bg-[#005EA4]'}  text-white` : 'text-[#060425] dark:text-white hover:bg-[#EAF6FA] dark:hover:bg-[#1C1C1C] hover:text-[#0069A6] dark:hover:text-[#38A9E0]'}`}
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

            <UserCard role={role} slim={slim} onLogout={onLogout} onNavigate={onNavigate} />
        </motion.aside>
    )
}