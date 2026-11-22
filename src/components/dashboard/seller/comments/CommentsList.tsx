'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fa, faDate } from '@/lib/format'
import { getUserId } from '@/lib/dashboard/dashboardApi'
import { commentErrorMessage, deleteComment, getSellerComments, isFinalCommentError, loadCommentsErrorMessage, SellerComment, updateComment } from '@/lib/dashboard/sellerCommentApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import Modal from '../../components/Modal'

const PAGE_SIZE = 10
const NO_INFO = 'اطلاعاتی وجود ندارد'

const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

const fieldBox =
    'relative flex flex-col rounded-2xl border border-[#28A5E6] px-3 pb-2 pt-5 text-xs text-[#060425] dark:text-white'
const fieldLabel = 'absolute right-3 top-1.5 text-[9px] text-[#8A8997]'
const fieldInput = 'w-full bg-transparent text-xs font-bold text-[#060425] outline-none dark:text-white'

type Draft = { title: string; text: string; rating: number }

const validDate = (v?: string | null) => !!v && !Number.isNaN(new Date(v).getTime())

function RatingPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
    return (
        <div className='flex flex-col gap-2'>
            <span className='px-1 text-[10px] text-[#8A8997]'>امتیاز</span>
            <div role='radiogroup' aria-label='امتیاز' className='grid grid-cols-3 gap-2'>
                {ratingOptions.map((r) => {
                    const active = r === value
                    return (
                        <button
                            key={r}
                            type='button'
                            role='radio'
                            aria-checked={active}
                            onClick={() => onChange(r)}
                            className={`flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition active:scale-[0.95] ${active
                                ? 'border-[#0087CA] bg-[#0087CA] text-white shadow-[0px_2px_8px_0px_#0887CA55]'
                                : 'border-[#28A5E6]/40 bg-transparent text-[#060425] hover:border-[#28A5E6] hover:bg-[#0887CA0D] dark:text-white'
                                }`}
                        >
                            <Star size={14} className='fill-[#EDB305] text-[#EDB305]' />
                            {fa(r)}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function CommentsList() {
    const [items, setItems] = useState<SellerComment[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [pending, setPending] = useState<SellerComment | null>(null)
    const [editing, setEditing] = useState<SellerComment | null>(null)
    const [draft, setDraft] = useState<Draft>({ title: '', text: '', rating: 5 })

    const load = useCallback(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        setLoading(true)
        getSellerComments(userId)
            .then((res) => setItems(res.items))
            .catch((e) => toast.error(loadCommentsErrorMessage(e)))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const filtered = useMemo(() => {
        const q = query.trim()
        return items.filter((c) => !q || c.author.includes(q) || c.property.includes(q))
    }, [items, query])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const openEdit = (c: SellerComment) => {
        setDraft({ title: c.title, text: c.text, rating: c.rating || 5 })
        setEditing(c)
    }

    const confirmDelete = async () => {
        if (!pending || deleting) return
        setDeleting(true)
        try {
            await deleteComment(pending.id)
            setItems((prev) => prev.filter((x) => x.id !== pending.id))
            toast.success('نظر حذف شد')
            setPending(null)
        } catch (e) {
            toast.error(commentErrorMessage(e, 'delete'))
            if (isFinalCommentError(e)) setPending(null)
        } finally {
            setDeleting(false)
        }
    }

    const saveEdit = async () => {
        if (!editing || saving) return
        const title = draft.title.trim() || editing.title
        const caption = draft.text.trim()
        if (!caption) {
            toast.error('متن نظر نمی‌تواند خالی باشد')
            return
        }
        setSaving(true)
        try {
            await updateComment(editing.id, { title, caption, rating: draft.rating })
            setItems((prev) =>
                prev.map((x) => (x.id === editing.id ? { ...x, title, text: caption, rating: draft.rating } : x))
            )
            toast.success('نظر ویرایش شد')
            setEditing(null)
        } catch (e) {
            toast.error(commentErrorMessage(e, 'update'))
            if (isFinalCommentError(e)) setEditing(null)
        } finally {
            setSaving(false)
        }
    }

    const columns: Column<SellerComment>[] = [
        {
            key: 'author',
            header: 'کاربر',
            width: '1.2fr',
            render: (c) => <span className='block truncate'>{c.author || NO_INFO}</span>,
        },
        {
            key: 'property',
            header: 'اقامتگاه',
            width: '1.3fr',
            render: (c) => <span className='block truncate'>{c.property || NO_INFO}</span>,
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
            key: 'text',
            header: 'نظر',
            width: '3fr',
            render: (c) => (
                <span className='flex min-w-0 items-center gap-2'>
                    {c.isReply && (
                        <span className='shrink-0 rounded-full bg-[#E6F1F6] px-2 py-0.5 text-[9px] text-[#0087CA] dark:bg-[#1C1C1C]'>
                            پاسخ
                        </span>
                    )}
                    <p title={c.text} className='truncate'>
                        {c.text || NO_INFO}
                    </p>
                </span>
            ),
        },
        {
            key: 'date',
            header: 'تاریخ',
            width: '1.1fr',
            render: (c) => <span>{validDate(c.date) ? faDate(c.date) : NO_INFO}</span>,
        },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست نظرات کاربران'
                count={filtered.length}
                query={query}
                searchPlaceholder='نام کاربر یا اقامتگاه ....'
                onQueryChange={(v) => {
                    setQuery(v)
                    setPage(1)
                }}
            />

            <DataList
                columns={columns}
                rows={visible}
                rowKey={(c) => c.id}
                loading={loading}
                emptyText='نظری ثبت نشده است'
                actions={(c) => (
                    <RowMenu
                        items={[
                            {
                                label: 'ویرایش',
                                icon: <Pencil size={16} />,
                                variant: 'primary',
                                onClick: () => openEdit(c),
                            },
                            {
                                label: 'حذف',
                                icon: <Trash2 size={16} />,
                                variant: 'danger',
                                onClick: () => setPending(c),
                            },
                        ]}
                    />
                )}
            />

            <Pagination page={current} total={pages} onChange={setPage} />

            <Modal open={!!editing} onClose={() => setEditing(null)} title='ویرایش نظر' className='max-w-sm'>
                <div className='flex flex-col gap-4'>
                    {/* <label className={fieldBox}>
                        <span className={fieldLabel}>عنوان</span>
                        <input
                            value={draft.title}
                            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                            className={fieldInput}
                        />
                    </label> */}

                    <label className={fieldBox}>
                        <span className={fieldLabel}>متن نظر</span>
                        <textarea
                            rows={4}
                            value={draft.text}
                            onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
                            className={`${fieldInput} resize-none leading-6`}
                        />
                    </label>

                    <RatingPicker value={draft.rating} onChange={(rating) => setDraft((d) => ({ ...d, rating }))} />
                </div>

                <div className='mt-6 flex gap-3'>
                    <button
                        type='button'
                        onClick={saveEdit}
                        disabled={saving}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {saving ? 'در حال ذخیره ...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type='button'
                        onClick={() => setEditing(null)}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                    >
                        انصراف
                    </button>
                </div>
            </Modal>

            <ConfirmModal
                open={!!pending}
                onClose={() => setPending(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف نظر'
                message='آیا از حذف این نظر مطمئنی؟'
            />
        </div>
    )
}


