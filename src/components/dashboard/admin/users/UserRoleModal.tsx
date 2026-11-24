'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { roleLabels, type Role } from '@/lib/dashboard/config'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { updateUserRole, type AdminUser } from '@/lib/dashboard/adminApi'
import Modal from '../../components/Modal'

type Props = { user: AdminUser | null; onClose: () => void; onSaved: () => void }

const roles = Object.keys(roleLabels) as Role[]

export default function UserRoleModal({ user, onClose, onSaved }: Props) {
    const [role, setRole] = useState<Role>('buyer')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) setRole(user.role)
    }, [user])

    const save = async () => {
        if (!user || saving) return
        if (role === user.role) return onClose()
        setSaving(true)
        try {
            await updateUserRole(user.id, role)
            toast.success('نقش کاربر تغییر کرد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'تغییر نقش کاربر با خطا مواجه شد'))
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal open={!!user} onClose={onClose} title='تغییر نقش کاربر' className='max-w-sm'>
            <div className='flex flex-col gap-4'>
                <p className='text-xs font-bold text-[#060425] dark:text-white'>{user?.fullName || user?.email}</p>

                <div role='radiogroup' aria-label='نقش' className='grid grid-cols-3 gap-2'>
                    {roles.map((item) => {
                        const active = item === role
                        return (
                            <button
                                key={item}
                                type='button'
                                role='radio'
                                aria-checked={active}
                                onClick={() => setRole(item)}
                                className={`flex h-10 cursor-pointer items-center justify-center rounded-xl border text-xs font-bold transition active:scale-[0.95] ${
                                    active
                                        ? 'border-[#0087CA] bg-[#0087CA] text-white shadow-[0px_2px_8px_0px_#0887CA55]'
                                        : 'border-[#28A5E6]/40 bg-transparent text-[#060425] hover:border-[#28A5E6] hover:bg-[#0887CA0D] dark:text-white'
                                }`}
                            >
                                {roleLabels[item]}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className='mt-6 flex gap-3'>
                <button
                    type='button'
                    onClick={save}
                    disabled={saving}
                    className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                >
                    {saving ? 'در حال ذخیره ...' : 'ذخیره تغییرات'}
                </button>
                <button
                    type='button'
                    onClick={onClose}
                    className='h-10 flex-1 cursor-pointer rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                >
                    انصراف
                </button>
            </div>
        </Modal>
    )
}
