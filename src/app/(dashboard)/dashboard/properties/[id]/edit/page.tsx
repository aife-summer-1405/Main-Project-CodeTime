import { Suspense } from 'react'
import PropertyWizard from '@/components/dashboard/seller/properties/PropertyWizard'
import { RoleGate } from '@/components/dashboard/RoleView'
import { WizardSkeleton } from '@/components/skeletons/DashboardSkeletons'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <RoleGate allow={['seller']}>
            <Suspense fallback={<WizardSkeleton />}>
                <PropertyWizard houseId={id} />
            </Suspense>
        </RoleGate>
    )
}
