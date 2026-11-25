'use client'

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { deleteAdminCategory, getAdminCategories, type AdminCategory } from '@/lib/Api/dashboard/admin/categories'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import CategoryFormModal from './CategoryFormModal'

const PAGE_SIZE = 10

const columns: Column<AdminCategory>[] = [
    { key: 'id', header: 'کد دسته بندی', width: '1fr', render: (c) => <span>{toFaDigits(c.id)}</span> },
    { key: 'name', header: 'نام دسته بندی', width: '4fr', render: (c) => <span className='block truncate'>{c.name || '—'}</span> },
]

export default function AdminCategoriesList() {
    const [items, setItems] = useState<AdminCategory[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [name, setName] = useState('')
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminCategory | null>(null)
    const [target, setTarget] = useState<AdminCategory | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setName(query.trim())
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminCategories({ page, limit: PAGE_SIZE, name })
            .then((res) => {
                if (!active) return
                setItems(res.categories)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست دسته بندی ها')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, name, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const openForm = (category: AdminCategory | null) => {
        setEditing(category)
        setFormOpen(true)
    }

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminCategory(target.id)
            toast.success('دسته بندی با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف دسته بندی انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar title='لیست دسته بندی ها' count={total} query={query} onQueryChange={setQuery} searchPlaceholder='نام دسته بندی مورد نظر ...'>
                <button
                    type='button'
                    onClick={() => openForm(null)}
                    className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#10088F] px-5 text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                >
                    <Plus size={18} />
                    افزودن دسته بندی جدید
                </button>
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(c) => c.id}
                loading={loading}
                emptyText='دسته بندی یافت نشد'
                actions={(c) => (
                    <RowMenu
                        items={[
                            { label: 'ویرایش', icon: <Pencil size={16} />, variant: 'primary', onClick: () => openForm(c) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(c) },
                        ]}
                    />
                )}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <CategoryFormModal open={formOpen} category={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف دسته بندی'
                message={target ? `آیا از حذف ${target.name} مطمئنی؟` : ''}
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
