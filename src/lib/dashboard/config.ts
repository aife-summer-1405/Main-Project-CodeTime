import type { ComponentType, SVGProps } from 'react'
import {
    BellIcon,
    BlogIcon,
    CategoryIcon,
    CommentsIcon,
    ContactIcon,
    DashboardIcon,
    DiscountIcon,
    HeartIcon,
    LocationIcon,
    PropertiesIcon,
    ReservationsIcon,
    UserIcon,
    UsersIcon,
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
    admin: [
        { label: 'داشبورد', href: '/dashboard', icon: DashboardIcon },
        { label: 'اطلاعات کاربری', href: '/dashboard/account', icon: UserIcon },
        { label: 'مدیریت کاربران', href: '/dashboard/users', icon: UsersIcon },
        { label: 'مدیریت املاک', href: '/dashboard/properties', icon: PropertiesIcon },
        { label: 'مدیریت رزرو ها', href: '/dashboard/reservations', icon: ReservationsIcon },
        { label: 'مدیریت پرداخت ها', href: '/dashboard/payments', icon: WalletIcon },
        { label: 'مدیریت نظرات', href: '/dashboard/comments', icon: CommentsIcon },
        { label: 'ارتباط با ما', href: '/dashboard/contact-us', icon: ContactIcon },
        { label: 'مدیریت مکان ها', href: '/dashboard/locations', icon: LocationIcon },
        { label: 'مدیریت دسته بندی ها', href: '/dashboard/categories', icon: CategoryIcon },
        { label: 'مدیریت وبلاگ', href: '/dashboard/blogs', icon: BlogIcon },
        { label: 'مدیریت اعلان ها', href: '/dashboard/notifications', icon: BellIcon },
        { label: 'مدیریت کدهای تخفیف', href: '/dashboard/discount-codes', icon: DiscountIcon },
    ],
}

export const topLinks = [
    { label: 'صفحه اصلی', href: '/' },
    { label: 'رزرو سریع', href: '/reserve' },
    { label: 'رهن و اجاره', href: '/rent' },
    { label: 'وبلاگ', href: '/blog' },
    { label: 'درباره ما', href: '/contact-us' },
]
