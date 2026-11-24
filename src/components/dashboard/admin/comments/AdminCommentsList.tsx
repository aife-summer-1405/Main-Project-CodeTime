'use client'

import { useEffect, useState } from 'react'
import { Pencil, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fa, faDate } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { deleteAdminComment, getAdminComments, type AdminComment } from '@/lib/dashboard/adminApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import AdminCommentEditModal from './AdminCommentEditModal'

const PAGE_SIZE = 10

const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => ({ label: fa(value), value: String(value) }))

const filterFields: FilterField[] = [
    { key: 'userId', label: 'شناسه کاربر', type: 'number' },
    { key: 'houseId', label: 'شناسه ملک', type: 'number' },
    { key: 'rating', label: 'امتیاز', options: ratingOptions },
]

const columns: Column<AdminComment>[] = [
    {
        key: 'user',
        header: 'کاربر',
        width: '1.3fr',
        render: (c) => (
            <div className='flex min-w-0 items-center gap-2'>
                <span className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6F1F6] text-xs font-bold text-[#0069A6] dark:bg-[#1C1C1C]'>
                    {c.userPicture ? <img src={c.userPicture} alt='' className='h-full w-full object-cover' /> : c.userName[0] ?? ''}
                </span>
                <span title={c.userName} className='truncate'>
                    {c.userName || '—'}
                </span>
            </div>
        ),
    },
    {
        key: 'house',
        header: 'اقامتگاه',
        width: '1.5fr',
        render: (c) => (
            <div className='flex min-w-0 flex-col'>
                <span title={c.houseTitle} className='truncate'>
                    {c.houseTitle || '—'}
                </span>
                {c.houseAddress && <span className='truncate text-[11px] opacity-60'>{c.houseAddress}</span>}
            </div>
        ),
    },
    {
        key: 'rating',
        header: 'امتیاز',
        width: '0.7fr',
        render: (c) => (
            <span className='flex items-center gap-1'>
                <Star size={13} className='fill-[#EDB305] text-[#EDB305]' />
                {fa(c.rating)}
            </span>
        ),
    },
    {
        key: 'caption',
        header: 'نظر',
        width: '3fr',
        render: (c) => (
            <span className='flex min-w-0 items-center gap-2'>
                {c.isReply && (
                    <span className='shrink-0 rounded-full bg-[#E6F1F6] px-2 py-0.5 text-[9px] text-[#0087CA] dark:bg-[#1C1C1C]'>پاسخ</span>
                )}
                <p title={c.caption} className='truncate'>
                    {c.caption || '—'}
                </p>
            </span>
        ),
    },
    { key: 'date', header: 'تاریخ', width: '1.1fr', render: (c) => <span>{faDate(c.createdAt)}</span> },
]

export default function AdminCommentsList() {
    const [items, setItems] = useState<AdminComment[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [editing, setEditing] = useState<AdminComment | null>(null)
    const [target, setTarget] = useState<AdminComment | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminComments({ page, limit: PAGE_SIZE, userId: filters.userId, houseId: filters.houseId, rating: filters.rating })
            .then((res) => {
                if (!active) return
                setItems(res.comments)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست نظرات')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, filters, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminComment(target.id)
            toast.success('نظر با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف نظر انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست نظرات کاربران'
                count={total}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            />

            <DataList
                columns={columns}
                rows={items}
                rowKey={(c) => c.id}
                loading={loading}
                emptyText='نظری ثبت نشده است'
                actions={(c) => (
                    <RowMenu
                        items={[
                            { label: 'ویرایش', icon: <Pencil size={16} />, variant: 'primary', onClick: () => setEditing(c) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(c) },
                        ]}
                    />
                )}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <FilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                fields={filterFields}
                values={filters}
                onApply={(values) => {
                    setFilters(values)
                    setPage(1)
                }}
            />

            <AdminCommentEditModal comment={editing} onClose={() => setEditing(null)} onSaved={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف نظر'
                message='آیا از حذف این نظر مطمئنی؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
