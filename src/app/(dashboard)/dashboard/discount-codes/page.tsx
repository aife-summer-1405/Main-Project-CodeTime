import PageTitle from '@/components/dashboard/common/PageTitle'
import AdminDiscountsList from '@/components/dashboard/admin/discounts/AdminDiscountsList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function DiscountCodesPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت کدهای تخفیف</PageTitle>
            <RoleGate allow={['admin']}>
                <AdminDiscountsList />
            </RoleGate>
        </div>
    )
}
