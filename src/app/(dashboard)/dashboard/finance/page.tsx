import FinanceOverview from '@/components/dashboard/seller/finance/FinanceOverview'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function FinancePage() {
    return (
        <RoleGate allow={['seller']}>
            <FinanceOverview />
        </RoleGate>
    )
}
