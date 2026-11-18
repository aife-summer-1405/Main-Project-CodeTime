'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Landmark, List, LogOut, Settings, Wallet } from 'lucide-react'
import { getUser, getUserId, User } from '@/lib/dashboard/dashboardApi'
import NotificationModal from './components/NotificationModal'
import LogoutModal from './components/LogoutModal'
import TransactionsModal from './components/TransactionsModal'

type Props = {
    slim?: boolean
    onLogout: () => void
    onNavigate?: () => void
}

type Menu = 'user' | 'wallet' | null
type ModalName = 'logout' | 'notifications' | 'transactions' | null

const dropdown =
    'absolute bottom-full right-0 z-50 mb-2 w-[190px] overflow-hidden rounded-2xl border border-[#DCEEF4] bg-white py-1 shadow-lg dark:border-[#2A2A2A] dark:bg-[#121212]'

const item =
    'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[11px] text-[#343343] transition-colors dark:text-[#D4D4D8] hover:bg-[#EAF6FA] dark:hover:bg-[#1C1C1C]'

function Avatar({ size, user }: { size: string; user: User | null }) {
    return (
        <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#43D6B5] bg-white font-bold text-[#0069A6] dark:bg-[#121212] ${size}`}>
            {user?.profilePicture ? (
                <img src={user.profilePicture} alt='' className='h-full w-full' />
            ) : (
                user?.firstName?.[0] ?? ''
            )}
        </span>
    )
}

export default function UserCard({ slim, onLogout, onNavigate }: Props) {
    const [menu, setMenu] = useState<Menu>(null)
    const [modal, setModal] = useState<ModalName>(null)
    const [user, setUser] = useState<User | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const loadUser = useCallback(async () => {
        const id = getUserId()
        if (!id) return
        try {
            setUser(await getUser(id))
        } catch { }
    }, [])

    useEffect(() => {
        loadUser()
        window.addEventListener('user-updated', loadUser)
        return () => window.removeEventListener('user-updated', loadUser)
    }, [loadUser])

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setMenu(null)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    const name = user ? user.fullName || `${user.firstName} ${user.lastName}` : ''
    const phone = user?.phoneNumber ? `+98 ${user.phoneNumber.slice(1)}` : ''

    const toggleMenu = (name: Exclude<Menu, null>) => setMenu(prev => (prev === name ? null : name))

    const openModal = (name: Exclude<ModalName, null>) => {
        setMenu(null)
        setModal(name)
    }

    const navigate = () => {
        setMenu(null)
        onNavigate?.()
    }

    const confirmLogout = () => {
        setModal(null)
        onLogout()
    }

    return (
        <div ref={ref} className='mt-auto flex flex-col gap-2 pt-6'>
            <div className='relative'>
                {menu === 'user' && (
                    <div className={dropdown}>
                        <div className='flex items-center gap-2 border-b border-[#EDF2F4] px-3 py-2 dark:border-[#2A2A2A]'>
                            <Avatar size='h-8 w-8 text-xs' user={user} />
                            <div>
                                <p className='text-[11px] font-bold'>{name}</p>
                                <p className='text-[9px] text-[#8A8997]' dir='ltr'>
                                    {phone}
                                </p>
                            </div>
                        </div>

                        <Link href='/dashboard/payments' onClick={navigate} className={item}>
                            <Wallet size={15} />
                            شارژ کردن کیف پول
                        </Link>
                        <button type='button' onClick={() => openModal('notifications')} className={item}>
                            <Settings size={15} />
                            تنظیمات نوتیفیکیشن
                        </button>
                        <button type='button' onClick={() => openModal('logout')} className={item}>
                            <LogOut size={15} />
                            خروج از حساب
                        </button>
                    </div>
                )}

                <button
                    type='button'
                    onClick={() => toggleMenu('user')}
                    className={`flex w-full cursor-pointer flex-col items-center gap-1 rounded-2xl bg-[#DDF0F5] dark:bg-[#1C1C1C] ${slim ? 'p-2' : 'px-3 py-3'}`}
                >
                    <Avatar size={slim ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm'} user={user} />

                    {!slim && (
                        <>
                            <span className='text-[9px] text-[#777] dark:text-[#A1A1AA]'>خریدار</span>
                            <span className='flex items-center gap-1 text-sm font-bold text-[#0069A6] dark:text-[#38A9E0]'>
                                <ChevronDown size={14} className={`transition-transform ${menu === 'user' ? 'rotate-180' : ''}`} />
                                {name || '...'}
                            </span>
                        </>
                    )}
                </button>
            </div>

            <div className='relative'>
                {menu === 'wallet' && (
                    <div className={dropdown}>
                        <Link href='/dashboard/payments' onClick={navigate} className={item}>
                            <Wallet size={15} />
                            شارژ کردن کیف پول
                        </Link>
                        <button type='button' onClick={() => openModal('transactions')} className={item}>
                            <List size={15} />
                            لیست تراکنش ها
                        </button>
                        <Link href='/dashboard/payments?type=withdraw' onClick={navigate} className={item}>
                            <Landmark size={15} />
                            برداشت وجه
                        </Link>
                    </div>
                )}

                <button
                    type='button'
                    onClick={() => toggleMenu('wallet')}
                    title={slim ? 'کیف پول' : undefined}
                    className={`flex w-full cursor-pointer items-center rounded-2xl bg-[#DDF0F5] py-3 text-[#55536D] dark:bg-[#1C1C1C] dark:text-[#D4D4D8] ${slim ? 'justify-center' : 'justify-between px-4'}`}
                >
                    {!slim && (
                        <span className='text-start'>
                            <span className='block text-xs font-bold text-[#0069A6] dark:text-[#38A9E0]'>کیف پول</span>
                            <span className='block text-[10px]'>عدم موجودی</span>
                        </span>
                    )}
                    <Wallet size={18} />
                </button>
            </div>

            <LogoutModal open={modal === 'logout'} onClose={() => setModal(null)} onConfirm={confirmLogout} />
            <NotificationModal open={modal === 'notifications'} onClose={() => setModal(null)} />
            <TransactionsModal open={modal === 'transactions'} onClose={() => setModal(null)} />
        </div>
    )
}