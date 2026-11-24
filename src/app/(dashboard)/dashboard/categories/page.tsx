import PageTitle from '@/components/dashboard/common/PageTitle'
import AdminCategoriesList from '@/components/dashboard/admin/categories/AdminCategoriesList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function CategoriesPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت دسته بندی ها</PageTitle>
            <RoleGate allow={['admin']}>
                <AdminCategoriesList />
            </RoleGate>
        </div>
    )
}
