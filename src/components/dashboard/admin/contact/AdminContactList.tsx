'use client'

import { useEffect, useState } from 'react'
import { Info, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { deleteAdminContactMessage, getAdminContactMessages, type AdminContactMessage } from '@/lib/dashboard/adminApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import AdminContactDetailModal from './AdminContactDetailModal'

const PAGE_SIZE = 10

const columns: Column<AdminContactMessage>[] = [
    { key: 'id', header: 'کد پیام', width: '0.6fr', render: (m) => <span>{toFaDigits(m.id)}</span> },
    {
        key: 'sender',
        header: 'فرستنده',
        width: '1.8fr',
        render: (m) =>
            m.senderName || m.senderEmail ? (
                <div className='flex min-w-0 flex-col'>
                    <span title={m.senderName} className='truncate'>
                        {m.senderName || '—'}
                    </span>
                    <span title={m.senderEmail} dir='ltr' className='truncate text-start text-[11px] opacity-60'>
                        {m.senderEmail}
                    </span>
                </div>
            ) : (
                <span title={m.title} className='block truncate'>
                    {m.title || '—'}
                </span>
            ),
    },
    {
        key: 'message',
        header: 'متن پیام',
        width: '3fr',
        render: (m) => (
            <span title={m.message} className='block truncate'>
                {m.message || '—'}
            </span>
        ),
    },
]

export default function AdminContactList() {
    const [items, setItems] = useState<AdminContactMessage[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [detail, setDetail] = useState<AdminContactMessage | null>(null)
    const [target, setTarget] = useState<AdminContactMessage | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setTitle(query.trim())
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminContactMessages({ page, limit: PAGE_SIZE, title })
            .then((res) => {
                if (!active) return
                setItems(res.messages)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت پیام‌ها')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, title, reloadKey])

    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminContactMessage(target.id)
            toast.success('پیام با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else setReloadKey((key) => key + 1)
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف پیام انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar title='پیام های ارتباط با ما' count={total} query={query} onQueryChange={setQuery} searchPlaceholder='عنوان پیام مورد نظر ...' />

            <DataList
                columns={columns}
                rows={items}
                rowKey={(m) => m.id}
                loading={loading}
                emptyText='پیامی یافت نشد'
                actions={(m) => (
                    <RowMenu
                        items={[
                            { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => setDetail(m) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(m) },
                        ]}
                    />
                )}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <AdminContactDetailModal message={detail} onClose={() => setDetail(null)} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف پیام'
                message='آیا از حذف این پیام مطمئنی؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
