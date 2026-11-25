'use client'

import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Info, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import {
    deleteAdminPayment,
    getAdminPayments,
    paymentStatusOptions,
    type AdminPayment,
    type PaymentStatus,
} from '@/lib/Api/dashboard/admin/payments'
import ListToolbar from '../../common/ListToolbar'
import DataList from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import { paymentColumns } from './paymentColumns'
import AdminPaymentDetailModal from './AdminPaymentDetailModal'
import AdminPaymentEditModal from './AdminPaymentEditModal'
import AdminPaymentVerifyModal from './AdminPaymentVerifyModal'
import useUsers from './useUsers'

const PAGE_SIZE = 10

const filterFields: FilterField[] = [
    { key: 'status', label: 'وضعیت پرداخت', options: paymentStatusOptions },
    { key: 'userId', label: 'شناسه کاربر', type: 'number' },
    { key: 'amount', label: 'مبلغ ( تومان )', type: 'number' },
]

export default function AdminPaymentsList() {
    const [items, setItems] = useState<AdminPayment[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [detail, setDetail] = useState<AdminPayment | null>(null)
    const [editing, setEditing] = useState<AdminPayment | null>(null)
    const [verifying, setVerifying] = useState<AdminPayment | null>(null)
    const [target, setTarget] = useState<AdminPayment | null>(null)
    const [deleting, setDeleting] = useState(false)

    const users = useUsers(items.map((payment) => payment.userId))
    const columns = useMemo(() => paymentColumns(users), [users])

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminPayments({
            page,
            limit: PAGE_SIZE,
            status: (filters.status as PaymentStatus) || '',
            userId: filters.userId,
            amount: filters.amount,
        })
            .then((res) => {
                if (!active) return
                setItems(res.payments)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت پرداخت‌ها')))
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
            await deleteAdminPayment(target.id)
            toast.success('پرداخت با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف پرداخت انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست پرداخت ها'
                count={total}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            />

            <DataList
                columns={columns}
                rows={items}
                rowKey={(p) => p.id}
                loading={loading}
                emptyText='پرداختی یافت نشد'
                actions={(p) => (
                    <RowMenu
                        items={[
                            { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => setDetail(p) },
                            ...(p.status === 'pending'
                                ? [{ label: 'تایید پرداخت', icon: <BadgeCheck size={16} />, onClick: () => setVerifying(p) }]
                                : []),
                            { label: 'ویرایش', icon: <Pencil size={16} />, onClick: () => setEditing(p) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(p) },
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

            <AdminPaymentDetailModal payment={detail} onClose={() => setDetail(null)} />
            <AdminPaymentEditModal payment={editing} onClose={() => setEditing(null)} onSaved={reload} />

            <AdminPaymentVerifyModal payment={verifying} onClose={() => setVerifying(null)} onVerified={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف پرداخت'
                message='آیا از حذف این پرداخت مطمئنی؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
