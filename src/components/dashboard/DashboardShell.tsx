'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '@/lib/dashboard/session'
import Header from './Header'
import Sidebar from './Sidebar'
import LogoutModal from './components/LogoutModal'
import { useRole } from './RoleProvider'

export default function DashboardShell({ children }: { children: ReactNode }) {
    const role = useRole()
    const router = useRouter()
    const [drawer, setDrawer] = useState(false)
    const [logoutOpen, setLogoutOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const confirmLogout = async () => {
        setLoggingOut(true)
        await logout()
        setLogoutOpen(false)
        setLoggingOut(false)
        toast.success('از حساب خارج شدید')
        router.replace('/login')
    }

    return (
        <>
            <div dir='rtl' className='relative flex h-dvh w-full gap-5 overflow-hidden bg-[#F5F5F5] dark:bg-[#121212] p-4 text-[#060425] dark:text-white sm:p-6 lg:pr-14'>
                <img src='/images/dashboard/swoosh.svg' alt='' className='pointer-events-none absolute left-0 top-0 hidden h-[460px] w-full lg:block' />
                <img src='/images/dashboard/hand.svg' alt='' className='absolute right-3 top-[190px] hidden w-9 lg:block' />

                <div className='relative hidden shrink-0 lg:block'>
                    <Sidebar role={role} collapsible onLogout={() => setLogoutOpen(true)} />
                </div>

                <div className='relative flex min-h-0 min-w-0 flex-1 flex-col gap-5'>
                    <Header role={role} onMenu={() => setDrawer(true)} />
                    <main className='min-h-0 min-w-0 flex-1 overflow-y-auto rounded-[40px] rounded-tr-[4px] rounded-bl-[4px] border shadow-[0px_0px_8px_0px_#0887CA26] border-[#DCEEF4] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#121212] p-4 sm:p-6'>
                        {children}
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {drawer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDrawer(false)}
                        className='fixed inset-0 z-50 bg-[#060425]/40 lg:hidden'
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            className='absolute right-0 top-0 h-full bg-white-1 dark:bg-[#121212] p-3'
                        >
                            <button
                                type='button'
                                onClick={() => setDrawer(false)}
                                aria-label='بستن منو'
                                className='absolute -left-11 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#121212] text-[#0069A6]'
                            >
                                <X size={18} />
                            </button>
                            <Sidebar
                                role={role}
                                onNavigate={() => setDrawer(false)}
                                onLogout={() => {
                                    setDrawer(false)
                                    setLogoutOpen(true)
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LogoutModal open={logoutOpen} loading={loggingOut} onClose={() => setLogoutOpen(false)} onConfirm={confirmLogout} />
        </>
    )
}
