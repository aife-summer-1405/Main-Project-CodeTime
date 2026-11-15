'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Bell, ChevronLeft, ChevronRight, ClipboardList, Heart, LayoutDashboard,
    Menu, Moon, Users, Wallet, X
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { dashboardLinks } from './dashboard-data'

const iconMap = {
    'layout-dashboard': LayoutDashboard,
    users: Users,
    'clipboard-list': ClipboardList,
    heart: Heart,
    wallet: Wallet,
    bell: Bell,
}

export default function DashboardMenu({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    const sidebar = (
        <motion.aside
            animate={{ width: collapsed ? 78 : 210 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className='relative flex h-full shrink-0 flex-col overflow-hidden rounded-[22px] border border-[#DCEEF4] bg-white px-3 py-4 shadow-[0_3px_18px_rgba(0,105,166,0.06)]'
        >
            <div className='mb-7 flex h-10 items-center justify-center'>
                <Link href='/dashboard' className='flex items-center gap-1 whitespace-nowrap'>
                    <span className='text-[25px] font-black tracking-tight text-[#060425]'>
                        رهن
                    </span>
                    <span className='text-[25px] font-black tracking-tight text-[#087FC0]'>
                        کده
                    </span>
                </Link>
            </div>

            <div className='mb-5 flex justify-center'>
                <div className='flex h-12 w-14 items-center justify-center rounded-full text-[#5BC8BC]'>
                    <svg viewBox='0 0 64 48' className='h-11 w-14' fill='none'>
                        <path d='M7 39C17 15 34 10 53 15' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
                        <path d='M45 5L55 15L43 20' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                        <circle cx='31' cy='27' r='9' stroke='currentColor' strokeWidth='2' />
                        <path d='M28 23H34V31H28z' stroke='currentColor' strokeWidth='1.5' />
                    </svg>
                </div>
            </div>


            <nav className='flex flex-1 flex-col gap-1.5'>
                {dashboardLinks.map((item) => {
                    const active = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? item.label : undefined}
                            className={`group flex h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 ${active
                                    ? 'bg-[#0069A6] font-semibold text-white'
                                    : 'text-[#060425] hover:bg-[#EAF6FA] hover:text-[#0069A6]'
                                }`}
                        >
                            <img
                                src={item.icon}
                                alt=''
                                className={`h-5 w-5 shrink-0 transition-all duration-200 ${active ? 'brightness-0 invert' : ''
                                    }`}
                            />

                            <AnimatePresence initial={false}>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className='overflow-hidden whitespace-nowrap'
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>


            <div className='mt-5 flex flex-col gap-2'>
                <div className={`flex items-center gap-3 rounded-[18px] bg-[#DDF0F5] p-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#43D6B5] bg-white text-sm font-bold text-[#0069A6]'>
                        ط
                    </div>
                    {!collapsed && (
                        <div className='min-w-0'>
                            <p className='text-[11px] text-[#777]'>خریدار</p>
                            <p className='truncate text-sm font-bold text-[#0069A6]'>نام کاربر</p>
                        </div>
                    )}
                </div>

                <div className={`flex items-center gap-2 rounded-[16px] bg-[#DDF0F5] p-3 text-[#55536D] ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <Wallet size={18} className='shrink-0' />
                    {!collapsed && (
                        <div className='min-w-0 flex-1'>
                            <p className='text-xs font-bold'>کیف پول</p>
                            <p className='text-[10px]'>عدم موجودی</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type='button'
                onClick={() => setCollapsed((value) => !value)}
                className='absolute -left-1 top-[104px] hidden h-7 w-7 items-center justify-center rounded-full border border-[#DCEEF4] bg-white text-[#0069A6] shadow-sm lg:flex'
                aria-label={collapsed ? 'باز کردن منو' : 'بستن منو'}
            >
                {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </motion.aside>
    )

    return (
        <div dir='rtl'>
            <div className='min-h-screen bg-[#F5F5F5] p-3 text-[#060425] sm:p-5'>
                <div className='mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] gap-4 sm:min-h-[calc(100vh-40px)] sm:gap-5'>
                    <div className='hidden lg:block'>{sidebar}</div>

                    <div className='flex min-w-0 flex-1 flex-col gap-4 sm:gap-5'>
                        <header className='flex h-[58px] shrink-0 items-center justify-between rounded-[18px] border border-[#DCEEF4] bg-white px-4 shadow-[0_3px_18px_rgba(0,105,166,0.05)] sm:px-6'>
                            <div className='flex items-center gap-2 lg:hidden'>
                                <button
                                    type='button'
                                    onClick={() => setMobileOpen(true)}
                                    className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6FA] text-[#0069A6]'
                                    aria-label='باز کردن منو'
                                >
                                    <Menu size={20} />
                                </button>
                                <span className='text-sm font-black text-[#0069A6]'>رهن کده</span>
                            </div>

                            <nav className='hidden items-center gap-6 text-xs font-medium text-[#343343] sm:flex'>
                                <Link href='/' className='transition-colors hover:text-[#0087CA]'>صفحه اصلی</Link>
                                <Link href='/reserve' className='transition-colors hover:text-[#0087CA]'>رزرو سریع</Link>
                                <Link href='/blog' className='transition-colors hover:text-[#0087CA]'>وبلاگ</Link>
                                <Link href='/about' className='transition-colors hover:text-[#0087CA]'>درباره ما</Link>
                            </nav>

                            <div className='mr-auto flex items-center gap-2 sm:mr-0'>
                                <span className='flex h-9 w-9 items-center justify-center rounded-full border border-[#E4EDF1] text-[#55536D]' aria-label='حالت شب'>
                                    <Moon size={17} />
                                </span>
                                <button
                                    type='button'
                                    className='relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E4EDF1] text-[#55536D] transition hover:bg-[#EAF6FA]'
                                    aria-label='اعلان‌ها'
                                >
                                    <Bell size={17} />
                                    <span className='absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F04464]' />
                                </button>
                            </div>
                        </header>

                        <main className='min-w-0 flex-1 rounded-[40px] rounded-tr-[4px] rounded-bl-[4px] border border-[#DCEEF4] bg-[#F7F8F9] px-6 py-4 shadow-[0px_0px_8px_0px_#0887CA26] sm:p-5'>
                            {children}
                        </main>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 bg-[#060425]/40 lg:hidden'
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.25 }}
                            onClick={(event) => event.stopPropagation()}
                            className='absolute right-0 top-0 h-full w-[min(82vw,290px)] p-3'
                        >
                            <div className='relative h-full'>
                                <button
                                    type='button'
                                    onClick={() => setMobileOpen(false)}
                                    className='absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0069A6]'
                                    aria-label='بستن منو'
                                >
                                    <X size={18} />
                                </button>
                                {sidebar}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
