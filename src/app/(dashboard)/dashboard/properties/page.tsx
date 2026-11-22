import PageTitle from '@/components/dashboard/common/PageTitle'
import PropertiesList from '@/components/dashboard/seller/properties/PropertiesList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function PropertiesPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت املاک</PageTitle>
            <RoleGate allow={['seller']}>
                <PropertiesList />
            </RoleGate>
        </div>
    )
}
