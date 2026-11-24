import PageTitle from '@/components/dashboard/common/PageTitle'
import AdminContactList from '@/components/dashboard/admin/contact/AdminContactList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function ContactUsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>ارتباط با ما</PageTitle>
            <RoleGate allow={['admin']}>
                <AdminContactList />
            </RoleGate>
        </div>
    )
}
