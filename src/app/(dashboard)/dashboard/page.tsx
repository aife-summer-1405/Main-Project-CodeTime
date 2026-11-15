import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import BuyerOverview from '@/components/dashboard/buyer/BuyerOverview'
import { currentRole, type Role } from '@/lib/dashboard/config'

const overviews: Partial<Record<Role, ComponentType>> = {
    buyer: BuyerOverview,
}

export default function DashboardPage() {
    const Overview = overviews[currentRole]

    if (!Overview) notFound()

    return <Overview />
}
