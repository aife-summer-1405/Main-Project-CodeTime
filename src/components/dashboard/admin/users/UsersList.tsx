'use client'

import { useEffect, useState } from 'react'
import { Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { faDate } from '@/lib/format'
import { roleLabels, type Role } from '@/lib/dashboard/config'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { deleteUser, getAdminUsers, type AdminUser } from '@/lib/Api/dashboard/admin/users'
import ListToolbar from '../../common/ListToolbar'
import FilterSelect from '../../common/FilterSelect'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import RoleBadge from '../RoleBadge'
import UserCell from '../UserCell'
import UserEditModal from './UserEditModal'
import UserRoleModal from './UserRoleModal'

const PAGE_SIZE = 10

const roleOptions = (Object.keys(roleLabels) as Role[]).map((value) => ({ label: roleLabels[value], value }))

const columns: Column<AdminUser>[] = [
    { key: 'user', header: 'کاربر', width: '1.6fr', render: (u) => <UserCell user={u} /> },
    { key: 'email', header: 'ایمیل', width: '2fr', render: (u) => <span className='block truncate'>{u.email}</span> },
    {
        key: 'phone',
        header: 'شماره موبایل',
        width: '1.2fr',
        render: (u) => <span dir='ltr'>{u.phoneNumber || '—'}</span>,
    },
    { key: 'role', header: 'نقش', width: '1fr', render: (u) => <RoleBadge role={u.role} /> },
    { key: 'createdAt', header: 'تاریخ عضویت', width: '1.2fr', render: (u) => <span>{faDate(u.createdAt)}</span> },
]

export default function UsersList() {
    const [items, setItems] = useState<AdminUser[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState('')
    const [role, setRole] = useState<Role | ''>('')
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [editing, setEditing] = useState<AdminUser | null>(null)
    const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(query.trim())
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminUsers({ page, limit: PAGE_SIZE, email: search, role })
            .then((res) => {
                if (!active) return
                setItems(res.users)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست کاربران')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, search, role, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const isSelf = (user: AdminUser) => user.id === String(getUserId())

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return
        setDeleting(true)
        try {
            await deleteUser(deleteTarget.id)
            toast.success('کاربر با موفقیت حذف شد')
            setDeleteTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف کاربر انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست کاربران'
                count={total}
                query={query}
                searchPlaceholder='ایمیل کاربر ...'
                onQueryChange={setQuery}
            >
                <FilterSelect
                    label='نقش'
                    value={role}
                    options={roleOptions}
                    onChange={(value) => {
                        setRole(value as Role | '')
                        setPage(1)
                    }}
                />
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(u) => u.id}
                loading={loading}
                emptyText='کاربری یافت نشد'
                actions={(user) => (
                    <RowMenu
                        items={[
                            { label: 'ویرایش', icon: <Pencil size={16} />, variant: 'primary', onClick: () => setEditing(user) },
                            ...(isSelf(user)
                                ? []
                                : [
                                      { label: 'تغییر نقش', icon: <ShieldCheck size={16} />, onClick: () => setRoleTarget(user) },
                                      { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger' as const, onClick: () => setDeleteTarget(user) },
                                  ]),
                        ]}
                    />
                )}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <UserEditModal user={editing} onClose={() => setEditing(null)} onSaved={reload} />
            <UserRoleModal user={roleTarget} onClose={() => setRoleTarget(null)} onSaved={reload} />

            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف کاربر'
                message='آیا از حذف این کاربر مطمئنی؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
