'use client'

import { useState } from 'react'
import { Pencil, Settings } from 'lucide-react'
import SecurityForm from './SecurityForm'
import ProfileForm from './ProfileForm'


const tabs = [
    { id: 'profile', label: 'اطلاعات فردی', icon: Pencil },
    { id: 'security', label: 'امنیت', icon: Settings },
] as const

export default function AccountPage() {
    const [active, setActive] = useState<(typeof tabs)[number]['id']>('profile')

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <h1 className='text-base font-bold text-[#0087CA]'>••• اطلاعات کاربری •••</h1>

            <nav className='flex h-14 w-full items-center overflow-x-auto rounded-2xl bg-[#f5f5f5] px-3 shadow-[0px_0px_8px_0px_#0887CA26] dark:bg-[#121212]'>
                <div className='flex items-center gap-2.5'>
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type='button'
                            onClick={() => setActive(id)}
                            className={`flex shrink-0 items-center gap-2 rounded-lg cursor-pointer px-4 py-2 text-sm transition ${active === id
                                ? 'bg-[#E6E6E6] text-[#1A1A1A] dark:bg-[#2A2A2A] dark:text-white'
                                : 'text-[#55536D] dark:text-[#A1A1AA]'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </nav>

            <div className='rounded-2xl bg-[#f5f5f5] p-4 shadow-[0px_0px_8px_0px_#0887CA26] sm:p-6 dark:bg-[#121212]'>
                {active === 'profile' ? <ProfileForm /> : <SecurityForm />}
            </div>
        </div>
    )
}