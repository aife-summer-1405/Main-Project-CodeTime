import PageTitle from '@/components/dashboard/common/PageTitle'
import UsersList from '@/components/dashboard/admin/users/UsersList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function UsersPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت کاربران</PageTitle>
            <RoleGate allow={['admin']}>
                <UsersList />
            </RoleGate>
        </div>
    )
}
