import type { AdminUser } from '@/lib/Api/dashboard/admin/users'

export default function UserCell({ user }: { user: AdminUser }) {
    return (
        <div className='flex min-w-0 items-center gap-2'>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6F1F6] text-xs font-bold text-[#0069A6] dark:bg-[#1C1C1C]'>
                {user.profilePicture ? <img src={user.profilePicture} alt='' className='h-full w-full object-cover' /> : user.firstName[0] ?? ''}
            </span>
            <span title={user.fullName} className='truncate'>
                {user.fullName || '—'}
            </span>
        </div>
    )
}
