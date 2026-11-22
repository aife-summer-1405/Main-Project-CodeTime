import PageTitle from '@/components/dashboard/common/PageTitle'
import NotificationsList from '@/components/dashboard/buyer/notifications/NotificationsList'

export default function NotificationsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>اعلان ها</PageTitle>
            <NotificationsList />
        </div>
    )
}
