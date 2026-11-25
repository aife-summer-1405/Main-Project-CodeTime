'use client'

import { useEffect, useState } from 'react'
import { Info, Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { deleteAdminLocation, getAdminLocations, type AdminLocation } from '@/lib/Api/dashboard/admin/locations'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import LocationDetailModal from './LocationDetailModal'
import LocationFormModal from './LocationFormModal'

const PAGE_SIZE = 10

const coordinate = (value: number) => (
    <span dir='rtl' className='block text-right'>
        {value.toFixed(4)}
    </span>
)

const columns: Column<AdminLocation>[] = [
    { key: 'id', header: 'کد مکان', width: '0.7fr', render: (l) => <span>{toFaDigits(l.id)}</span> },
    { key: 'name', header: 'نام منطقه', width: '2fr', render: (l) => <span className='block truncate'>{l.areaName || '—'}</span> },
    { key: 'lat', header: 'عرض جغرافیایی', width: '1.2fr', render: (l) => coordinate(l.lat) },
    { key: 'lng', header: 'طول جغرافیایی', width: '1.2fr', render: (l) => coordinate(l.lng) },
]

export default function AdminLocationsList() {
    const [items, setItems] = useState<AdminLocation[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [areaName, setAreaName] = useState('')
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [detail, setDetail] = useState<AdminLocation | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminLocation | null>(null)
    const [target, setTarget] = useState<AdminLocation | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAreaName(query.trim())
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminLocations({ page, limit: PAGE_SIZE, areaName })
            .then((res) => {
                if (!active) return
                setItems(res.locations)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست مکان‌ها')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, areaName, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const openForm = (location: AdminLocation | null) => {
        setEditing(location)
        setFormOpen(true)
    }

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminLocation(target.id)
            toast.success('مکان با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف مکان انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar title='لیست مکان ها' count={total} query={query} onQueryChange={setQuery} searchPlaceholder='نام منطقه مورد نظر ...'>
                <button
                    type='button'
                    onClick={() => openForm(null)}
                    className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#10088F] px-5 text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                >
                    <Plus size={18} />
                    افزودن مکان جدید
                </button>
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(l) => l.id}
                loading={loading}
                emptyText='مکانی یافت نشد'
                actions={(l) => (
                    <RowMenu
                        items={[
                            { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => setDetail(l) },
                            { label: 'ویرایش', icon: <Pencil size={16} />, onClick: () => openForm(l) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(l) },
                        ]}
                    />
                )}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <LocationDetailModal location={detail} onClose={() => setDetail(null)} />
            <LocationFormModal open={formOpen} location={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف مکان'
                message={target ? `آیا از حذف ${target.areaName} مطمئنی؟` : ''}
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
