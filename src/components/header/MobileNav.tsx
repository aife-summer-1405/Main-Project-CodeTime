'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Newspaper, Users, type LucideIcon } from 'lucide-react'
import { HEADER_LINKS } from '@/constants/header'

const ICONS: LucideIcon[] = [Home, MapPin, Newspaper, Users]

const MobileNav = () => {
    const pathname = usePathname()

    return (
        <nav
            aria-label='منوی اصلی'
            className='md:hidden fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[10000] mx-auto max-w-[420px] h-14 rounded-[16px] bg-[#060425] shadow-[0_8px_24px_0_#06042540] flex items-center justify-around px-2'
        >
            {HEADER_LINKS.map((item, i) => {
                const Icon = ICONS[i] ?? Home
                const isActive =
                    item.href === '/'
                        ? pathname === '/'
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        aria-label={item.title}
                        aria-current={isActive ? 'page' : undefined}
                        className='relative flex-1 h-full flex items-center justify-center active:scale-90 transition-transform duration-300'
                    >
                        <Icon
                            size={24}
                            strokeWidth={isActive ? 2.2 : 1.8}
                            className={`transition-all duration-300 ${isActive ? 'text-white -translate-y-0.5' : 'text-white/60'}`}
                        />
                        <span
                            className={`absolute bottom-2 h-0.5 rounded-full bg-white transition-all duration-300 ${isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'}`}
                        />
                    </Link>
                )
            })}
        </nav>
    )
}

export default MobileNav