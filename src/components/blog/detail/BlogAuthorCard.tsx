'use client'
import { useEffect, useState } from 'react'
import { Mail, User } from 'lucide-react'
import { getUserById, type UserProfile } from '@/lib/Api/user'
import Bone from '@/components/skeletons/Bone'

type Props = { authorId: string }

const fullName = (u: UserProfile) => [u.firstName, u.lastName].filter(Boolean).join(' ') || u.fullName

export default function BlogAuthorCard({ authorId }: Props) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        if (!localStorage.getItem('access_token')) {
            setLoading(false)
            return
        }

        getUserById(authorId)
            .then((res) => {
                if (active) setUser((res as { user?: UserProfile }).user ?? (res as unknown as UserProfile))
            })
            .catch(() => {})
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [authorId])

    const name = user ? fullName(user) : ''

    return (
        <div className='flex w-full items-center gap-3 rounded-[16px] border border-transparent bg-[#F5F5F5D9] p-4 shadow-[0_0_10px_0_#005EA41A] dark:border-white/10 dark:bg-[#1B1B1B]'>
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-[#10088F] text-lg font-bold text-white'>
                {name ? name.charAt(0) : <User size={22} />}
            </div>

            <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <p className='text-xs text-[#060425]/60 dark:text-white-1/60'>نویسنده مقاله</p>
                {loading ? (
                    <>
                        <Bone className='h-4 w-28' />
                        <Bone className='h-3 w-40 max-w-full' />
                    </>
                ) : (
                    <>
                        <p className='truncate text-sm font-bold text-[#060425] dark:text-white-1'>{name || 'تیم تحریریه'}</p>
                        {user?.email && (
                            <p dir='ltr' className='flex items-center justify-end gap-1.5 text-xs text-[#060425]/70 dark:text-white-1/70'>
                                <span className='truncate'>{user.email}</span>
                                <Mail size={14} className='shrink-0' />
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
