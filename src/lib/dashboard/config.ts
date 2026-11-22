import type { ComponentType, SVGProps } from 'react'
import {
    BellIcon,
    CommentsIcon,
    DashboardIcon,
    HeartIcon,
    PropertiesIcon,
    ReservationsIcon,
    UserIcon,
    WalletIcon,
} from '@/components/dashboard/NavIcons'

export type Role = 'buyer' | 'seller' | 'admin'

export type NavItem = { label: string; href: string; icon: ComponentType<SVGProps<SVGSVGElement>>; badge?: string }

export const roleLabels: Record<Role, string> = {
    buyer: 'خریدار',
    seller: 'فروشنده',
    admin: 'مدیر',
}

export const menus: Record<Role, NavItem[]> = {
    buyer: [
        { label: 'داشبورد', href: '/dashboard', icon: DashboardIcon },
        { label: 'اطلاعات کاربری', href: '/dashboard/account', icon: UserIcon },
        { label: 'مدیریت رزرو ها', href: '/dashboard/reservations', icon: ReservationsIcon },
        { label: 'علاقه مندی ها', href: '/dashboard/favorites', icon: HeartIcon },
        { label: 'پرداخت', href: '/dashboard/payments', icon: WalletIcon },
        { label: 'اعلان ها', href: '/dashboard/notifications', icon: BellIcon },
    ],
    seller: [
        { label: 'داشبورد', href: '/dashboard', icon: DashboardIcon },
        { label: 'اطلاعات کاربری', href: '/dashboard/account', icon: UserIcon },
        { label: 'مدیریت املاک', href: '/dashboard/properties', icon: PropertiesIcon },
        { label: 'مدیریت رزرو ها', href: '/dashboard/reservations', icon: ReservationsIcon },
        { label: 'مدیریت مالی', href: '/dashboard/finance', icon: WalletIcon },
        { label: 'مدیریت نظرات', href: '/dashboard/comments', icon: CommentsIcon, badge: '+۵' },
        { label: 'اعلان ها', href: '/dashboard/notifications', icon: BellIcon },
    ],
    admin: [],
}

export const topLinks = [
    { label: 'صفحه اصلی', href: '/' },
    { label: 'رزرو سریع', href: '/reserve' },
    { label: 'وبلاگ', href: '/blog' },
    { label: 'درباره ما', href: '/contact-us' },
]
