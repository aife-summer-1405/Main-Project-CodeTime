import { Suspense } from 'react'
import PropertyWizard from '@/components/dashboard/seller/properties/PropertyWizard'
import { RoleGate } from '@/components/dashboard/RoleView'
import { WizardSkeleton } from '@/components/skeletons/DashboardSkeletons'

export default function NewPropertyPage() {
    return (
        <RoleGate allow={['seller']}>
            <Suspense fallback={<WizardSkeleton />}>
                <PropertyWizard />
            </Suspense>
        </RoleGate>
    )
}
