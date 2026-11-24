import PageTitle from '@/components/dashboard/common/PageTitle'
import NotificationsList from '@/components/dashboard/buyer/notifications/NotificationsList'
import AdminNotificationsList from '@/components/dashboard/admin/notifications/AdminNotificationsList'
import RoleView from '@/components/dashboard/RoleView'

export default function NotificationsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>اعلان ها</PageTitle>
            <RoleView views={{ buyer: <NotificationsList />, seller: <NotificationsList />, admin: <AdminNotificationsList /> }} />
        </div>
    )
}
