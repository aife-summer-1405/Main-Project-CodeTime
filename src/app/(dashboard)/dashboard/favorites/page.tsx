import PageTitle from '@/components/dashboard/common/PageTitle'
import FavoritesList from '@/components/dashboard/buyer/favorites/FavoritesList'
import { RoleGate } from '@/components/dashboard/RoleView'

export default function FavoritesPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>علاقه مندی ها</PageTitle>
            <RoleGate allow={['buyer']}>
                <FavoritesList />
            </RoleGate>
        </div>
    )
}
