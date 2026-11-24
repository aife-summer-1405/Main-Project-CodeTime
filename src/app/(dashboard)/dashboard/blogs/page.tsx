import PageTitle from '@/components/dashboard/common/PageTitle'
import AdminBlogsList from '@/components/dashboard/admin/blogs/AdminBlogsList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function BlogsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت وبلاگ</PageTitle>
            <RoleGate allow={['admin']}>
                <AdminBlogsList />
            </RoleGate>
        </div>
    )
}
