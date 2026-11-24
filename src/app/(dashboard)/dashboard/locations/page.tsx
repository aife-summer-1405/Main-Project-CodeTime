import PageTitle from '@/components/dashboard/common/PageTitle'
import AdminLocationsList from '@/components/dashboard/admin/locations/AdminLocationsList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function LocationsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت مکان ها</PageTitle>
            <RoleGate allow={['admin']}>
                <AdminLocationsList />
            </RoleGate>
        </div>
    )
}
