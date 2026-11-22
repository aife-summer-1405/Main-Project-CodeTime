import type { ReactNode } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import RoleProvider from '@/components/dashboard/RoleProvider'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <RoleProvider>
            <DashboardShell>{children}</DashboardShell>
        </RoleProvider>
    )
}
