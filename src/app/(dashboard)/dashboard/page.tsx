import BuyerOverview from '@/components/dashboard/buyer/BuyerOverview'
import SellerOverview from '@/components/dashboard/seller/SellerOverview'
import AdminOverview from '@/components/dashboard/admin/AdminOverview'
import RoleView from '@/components/dashboard/RoleView'
export const instant = false
export default function DashboardPage() {
    return <RoleView views={{ buyer: <BuyerOverview />, seller: <SellerOverview />, admin: <AdminOverview /> }} />
}
