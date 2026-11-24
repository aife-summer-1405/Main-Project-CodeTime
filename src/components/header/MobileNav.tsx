'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Building2,
    Home,
    LayoutDashboard,
    LogIn,
    MapPin,
    Newspaper,
    Users,
    type LucideIcon,
} from 'lucide-react'
import { HEADER_LINKS } from '@/constants/header'

const TOKEN_KEY = 'access_token'

const ICONS: Record<string, LucideIcon> = {
    '/': Home,
    '/reserve': MapPin,
    '/rent': Building2,
    '/blog': Newspaper,
    '/contact-us': Users,
}

type NavItem = { title: string; href: string; Icon: LucideIcon }

const MobileNav = () => {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const check = () => setIsLoggedIn(!!localStorage.getItem(TOKEN_KEY))
        check()
        const onStorage = (e: StorageEvent) => {
            if (e.key === null || e.key === TOKEN_KEY) check()
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [pathname])

    const items: NavItem[] = HEADER_LINKS.map((item) => ({
        title: item.title,
        href: item.href,
        Icon: ICONS[item.href] ?? Home,
    }))

    if (isLoggedIn !== null) {
        items.push(
            isLoggedIn
                ? { title: 'داشبورد', href: '/dashboard', Icon: LayoutDashboard }
                : { title: 'ورود', href: '/login', Icon: LogIn }
        )
    }

    return (
        <nav
            aria-label='منوی اصلی'
            className='md:hidden fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[10000] mx-auto max-w-[420px] h-14 rounded-[16px] bg-[#060425] shadow-[0_8px_24px_0_#06042540] flex items-center justify-around px-2'
        >
            {items.map(({ title, href, Icon }) => {
                const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-label={title}
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