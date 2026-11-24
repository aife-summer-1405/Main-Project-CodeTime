import PageTitle from '@/components/dashboard/common/PageTitle'
import PropertiesList from '@/components/dashboard/seller/properties/PropertiesList'
import AdminHousesList from '@/components/dashboard/admin/houses/AdminHousesList'
import RoleView from '@/components/dashboard/RoleView'

export default function PropertiesPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت املاک</PageTitle>
            <RoleView views={{ seller: <PropertiesList />, admin: <AdminHousesList /> }} />
        </div>
    )
}
