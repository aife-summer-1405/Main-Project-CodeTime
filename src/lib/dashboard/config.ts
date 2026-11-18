import { Bell, ClipboardCheck, Heart, LayoutDashboard, UserRound, Wallet, type LucideIcon } from 'lucide-react'

export type Role = 'buyer' | 'seller' | 'admin'

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const currentRole: Role = 'buyer'

// export const currentUser = { name: 'غلام علی', phone: '09115556666', avatar: '' }

export const menus: Record<Role, NavItem[]> = {
    buyer: [
        { label: 'داشبورد', href: '/dashboard', icon: LayoutDashboard },
        { label: 'اطلاعات کاربری', href: '/dashboard/account', icon: UserRound },
        { label: 'مدیریت رزرو ها', href: '/dashboard/reservations', icon: ClipboardCheck },
        { label: 'علاقه مندی ها', href: '/dashboard/favorites', icon: Heart },
        { label: 'پرداخت', href: '/dashboard/payments', icon: Wallet },
        { label: 'اعلان ها', href: '/dashboard/notifications', icon: Bell },
    ],
    seller: [],
    admin: [],
}

export const topLinks = [
    { label: 'صفحه اصلی', href: '/' },
    { label: 'رزرو سریع', href: '/reserve' },
    { label: 'وبلاگ', href: '/blog' },
    { label: 'درباره ما', href: '/about' },
]
