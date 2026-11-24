import PageTitle from '@/components/dashboard/common/PageTitle'
import CommentsList from '@/components/dashboard/seller/comments/CommentsList'
import AdminCommentsList from '@/components/dashboard/admin/comments/AdminCommentsList'
import RoleView from '@/components/dashboard/RoleView'

export default function CommentsPage() {
    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت نظرات</PageTitle>
            <RoleView views={{ seller: <CommentsList />, admin: <AdminCommentsList /> }} />
        </div>
    )
}
