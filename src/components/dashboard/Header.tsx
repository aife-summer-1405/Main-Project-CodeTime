import Link from 'next/link'
import { Bell, Menu, Moon } from 'lucide-react'
import { topLinks } from '@/lib/dashboard/config'
import { ThemeToggleDashboard } from '../theme-toggle-dashboard'

const iconButton = 'relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E4EDF1] dark:border-[#2A2A2A] text-[#55536D] dark:text-[#D4D4D8] transition hover:bg-[#EAF6FA] dark:hover:bg-[#1C1C1C]'

export default function Header({ onMenu }: { onMenu: () => void }) {
    return (
        <header className='flex h-14 shrink-0 items-center gap-3 rounded-[20px] border border-[#DCEEF4] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#121212] px-4 sm:px-6 shadow-[0px_0px_8px_0px_#0887CA26]'>
            <button
                type='button'
                onClick={onMenu}
                aria-label='باز کردن منو'
                className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6FA] dark:bg-[#1C1C1C] text-[#0069A6] lg:hidden'
            >
                <Menu size={20} />
            </button>

            <nav className='hidden items-center gap-7 text-xs text-[#343343] dark:text-[#D4D4D8] md:flex'>
                {topLinks.map(({ label, href }) => (
                    <Link key={href} href={href} className='transition-colors hover:text-[#0087CA]'>
                        {label}
                    </Link>
                ))}
            </nav>

            <div className='mr-auto flex items-center gap-2'>
                <button type='button' aria-label='اعلان ها' className={iconButton}>
                    <Bell size={17} />
                    <span className='absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F04464]' />
                </button>
                <ThemeToggleDashboard />
            </div>
        </header>
    )
}
