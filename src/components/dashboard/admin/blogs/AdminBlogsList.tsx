'use client'

import { useEffect, useMemo, useState } from 'react'
import { Info, Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { faDate, toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { deleteAdminBlog, getAdminBlogs, type AdminBlog } from '@/lib/dashboard/adminApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import { PaymentUser } from '../payments/paymentColumns'
import useUsers from '../payments/useUsers'
import AdminBlogDetailModal from './AdminBlogDetailModal'
import AdminBlogFormModal from './AdminBlogFormModal'
import useBlogCategories from './useBlogCategories'

const PAGE_SIZE = 10
const FETCH_LIMIT = 100

const fetchAllBlogs = async () => {
    const first = await getAdminBlogs({ page: 1, limit: FETCH_LIMIT })
    const pages = Math.ceil(first.totalCount / FETCH_LIMIT)
    if (pages <= 1) return first.blogs
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => getAdminBlogs({ page: i + 2, limit: FETCH_LIMIT })))
    return [...first.blogs, ...rest.flatMap((r) => r.blogs)]
}

const normalize = (value: string) =>
    value
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/[\u200c\u064B-\u065F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()

export default function AdminBlogsList() {
    const [all, setAll] = useState<AdminBlog[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [title, setTitle] = useState('')
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminBlog | null>(null)
    const [detail, setDetail] = useState<AdminBlog | null>(null)
    const [target, setTarget] = useState<AdminBlog | null>(null)
    const [deleting, setDeleting] = useState(false)

    const { options, labels } = useBlogCategories()

    const filtered = useMemo(() => {
        const needle = normalize(title)
        return all.filter(
            (blog) =>
                (!needle || normalize(blog.title).includes(needle)) &&
                (!filters.categoryId || blog.categoryId === filters.categoryId) &&
                (!filters.authorId || blog.authorId === filters.authorId.trim())
        )
    }, [all, title, filters])

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const currentPage = Math.min(page, pages)
    const items = useMemo(() => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filtered, currentPage])

    const users = useUsers(items.map((blog) => blog.authorId))

    const filterFields = useMemo<FilterField[]>(
        () => [
            { key: 'categoryId', label: 'دسته بندی', options },
            { key: 'authorId', label: 'شناسه نویسنده', type: 'number' },
        ],
        [options]
    )

    const columns = useMemo<Column<AdminBlog>[]>(
        () => [
            { key: 'id', header: 'کد مقاله', width: '0.6fr', render: (b) => <span>{toFaDigits(b.id)}</span> },
            {
                key: 'title',
                header: 'عنوان',
                width: '2.6fr',
                render: (b) => (
                    <span title={b.title} className='block truncate'>
                        {b.title || '—'}
                    </span>
                ),
            },
            {
                key: 'category',
                header: 'دسته بندی',
                width: '1fr',
                render: (b) => (
                    <span className='w-fit max-w-full truncate rounded-full bg-[#E6F1F6] px-2.5 py-1 text-[10px] text-[#0087CA] dark:bg-[#1C1C1C]'>
                        {labels[b.categoryId] || '—'}
                    </span>
                ),
            },
            { key: 'author', header: 'نویسنده', width: '1.4fr', render: (b) => <PaymentUser id={b.authorId} user={users[b.authorId]} /> },
            { key: 'time', header: 'زمان مطالعه', width: '0.9fr', render: (b) => <span>{b.readingTime ? toFaDigits(b.readingTime) : '—'}</span> },
            { key: 'date', header: 'تاریخ انتشار', width: '1.1fr', render: (b) => <span>{faDate(b.createdAt)}</span> },
        ],
        [labels, users]
    )

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

        fetchAllBlogs()
            .then((list) => active && setAll(list))
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست مقالات')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const openForm = (blog: AdminBlog | null) => {
        setEditing(blog)
        setFormOpen(true)
    }

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminBlog(target.id)
            toast.success('مقاله با موفقیت حذف شد')
            setTarget(null)
            reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف مقاله انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست مقالات'
                count={total}
                query={query}
                onQueryChange={setQuery}
                searchPlaceholder='عنوان مقاله مورد نظر ...'
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            >
                <button
                    type='button'
                    onClick={() => openForm(null)}
                    className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#10088F] px-5 text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                >
                    <Plus size={18} />
                    افزودن مقاله جدید
                </button>
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(b) => b.id}
                loading={loading}
                emptyText='مقاله ای یافت نشد'
                actions={(b) => (
                    <RowMenu
                        items={[
                            { label: 'مشاهده جزئیات', icon: <Info size={16} />, variant: 'default', onClick: () => setDetail(b) },
                            { label: 'ویرایش', icon: <Pencil size={16} />, variant: 'primary', onClick: () => openForm(b) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(b) },
                        ]}
                    />
                )}
            />

            <Pagination page={currentPage} total={pages} onChange={setPage} />

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

            <AdminBlogFormModal open={formOpen} blog={editing} categories={options} onClose={() => setFormOpen(false)} onSaved={reload} />

            <AdminBlogDetailModal
                blog={detail}
                categoryLabel={detail ? labels[detail.categoryId] ?? '' : ''}
                author={detail ? users[detail.authorId] : undefined}
                onClose={() => setDetail(null)}
            />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف مقاله'
                message={target ? `آیا از حذف «${target.title}» مطمئنی؟` : ''}
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}