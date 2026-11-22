import PageTitle from '@/components/dashboard/common/PageTitle'
import PaymentsList from '@/components/dashboard/buyer/payments/PaymentsList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function PaymentsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>پرداخت ها</PageTitle>
            <RoleGate allow={['buyer']}>
                <PaymentsList />
            </RoleGate>
        </div>
    )
}
