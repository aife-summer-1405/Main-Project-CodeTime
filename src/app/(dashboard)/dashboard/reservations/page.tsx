import PageTitle from '@/components/dashboard/common/PageTitle'
import ReservationsList from '@/components/dashboard/buyer/reservations/ReservationsList'
import AdminBookingsList from '@/components/dashboard/admin/bookings/AdminBookingsList'
import SellerBookingsList from '@/components/dashboard/seller/reservations/SellerBookingsList'
import RoleView from '@/components/dashboard/RoleView'

export default function ReservationsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت رزرو ها</PageTitle>
            <RoleView views={{ buyer: <ReservationsList />, seller: <SellerBookingsList />, admin: <AdminBookingsList /> }} />
        </div>
    )
}
