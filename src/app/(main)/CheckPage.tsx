'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

const ThemeToggleSwitch = () => {
    const path = usePathname()
    return path.startsWith('/dashboard') ? null : <ThemeToggle />
}

const CheckPage = () => (
    <Suspense fallback={null}>
        <ThemeToggleSwitch />
    </Suspense>
)

export default CheckPage