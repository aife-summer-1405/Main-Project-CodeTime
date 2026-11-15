import type { ReactNode } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { currentRole } from '@/lib/dashboard/config'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardShell role={currentRole}>{children}</DashboardShell>
}
