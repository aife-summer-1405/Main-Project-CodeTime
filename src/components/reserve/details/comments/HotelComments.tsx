'use client'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDownIcon, Star } from 'lucide-react'
import type { Comment } from '@/lib/Api/reserveDetail'
import HotelAddComment from './HotelAddComment'
import toast from 'react-hot-toast'

interface IProps {
    comments: Comment[]
    total: number
    houseId: number | string
    onCommentAdded?: () => void
}

interface CardProps {
    comment: Comment
    isReply?: boolean
    repliesCount?: number
    repliesOpen?: boolean
    onToggleReplies?: () => void
    onReply?: (id: string) => void
}

const defaultAvatar = '/images/Rectangle (4).png'
const PAGE_SIZE = 5

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })

const CommentCard = ({ comment, isReply, repliesCount = 0, repliesOpen, onToggleReplies, onReply }: CardProps) => {
    const { user } = comment

    return (
        <div
            className={`w-[94%] sm:w-[85%] flex flex-col px-3.5 sm:px-[23px] py-[13px] shadow-[0_0_10px_0_#005EA41A] rounded-[8px] rounded-tr-[24px] rounded-bl-[24px] sm:rounded-tr-[32px] sm:rounded-bl-[32px] ${isReply ? 'bg-[#0887CA0D] border border-[#0887CA1A] mr-4 sm:mr-10' : 'bg-[#F5F5F5]'
                }`}
        >
            <ul className='w-full flex flex-wrap justify-between items-center gap-x-3 gap-y-2'>
                <div className='flex gap-2 sm:gap-3 items-center min-w-0'>
                    <div className='border-3 border-[#05ED6A66] rounded-full shrink-0'>
                        <img className='size-10 sm:size-12 rounded-full object-cover' src={user.profilePicture ?? defaultAvatar} alt='' />
                    </div>
                    <h1 className='text-sm sm:text-[16px] font-bold text-[#060425] truncate'>
                        {user.firstName} {user.lastName}
                    </h1>
                    {!isReply && (
                        <div className='flex gap-1.5 shrink-0'>
                            <p className='text-sm text-[#005EA4]'>{Number(comment.rating)}</p>
                            <Star size={19} color='#005EA4' />
                        </div>
                    )}
                </div>
                <p className='text-xs sm:text-sm text-[#060425] font-medium'>{formatDate(comment.created_at)}</p>
            </ul>

            <center className='w-full flex-col flex mt-1'>
                <p className='text-sm text-[#060425] font-medium text-right pr-0 sm:pr-15 break-words'>{comment.caption}</p>
                <div className='flex flex-wrap justify-start items-center gap-x-7 gap-y-2 mt-3 pr-0 sm:pr-15'>
                    {repliesCount > 0 && (
                        <button type='button' onClick={onToggleReplies} className='flex items-center gap-1 cursor-pointer'>
                            <p className='text-xs text-gray-400'>مشاهده پاسخ ها ( {repliesCount} )</p>
                            <ChevronDownIcon
                                size={15}
                                color='#99a1af'
                                className={`transition-transform duration-300 ${repliesOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    )}
                    {!isReply && (
                        <button type='button' onClick={() => onReply?.(comment.id)} className='flex items-center gap-2 cursor-pointer'>
                            <p className='text-xs text-[#005EA4] font-bold'>پاسخ دادن</p>
                            <img className='h-3' src='/images/left.svg' alt='' />
                        </button>
                    )}
                </div>
            </center>
        </div>
    )
}

const CommentThread = ({
    comment,
    replies,
    onReply,
}: {
    comment: Comment
    replies: Comment[]
    onReply: (id: string) => void
}) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='w-full flex flex-col items-center gap-4'>
            <CommentCard
                comment={comment}
                repliesCount={replies.length}
                repliesOpen={open}
                onToggleReplies={() => setOpen((o) => !o)}
                onReply={onReply}
            />
            {open && replies.map((r) => <CommentCard key={r.id} comment={r} isReply />)}
        </div>
    )
}

const HotelComments = ({ comments, total, houseId, onCommentAdded }: IProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [visible, setVisible] = useState(PAGE_SIZE)

    const parents = comments.filter((c) => !c.parent_comment_id)
    const shownParents = parents.slice(0, visible)
    const hasMore = parents.length > visible
    const repliesOf = (id: string) => comments.filter((c) => c.parent_comment_id === id)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
   
    const handleOpenModal = (parentId: string | null = null) => {
        const token = localStorage.getItem('access_token')

        if (token) {
            setReplyTo(parentId)
            setModalOpen(true)
        } else {
            toast('در حال انتقال به صفحه ورود...')

            const currentUrl = `${pathname}?${searchParams.toString()}`

            router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`)
        }
    }
    return (
        <div className='w-full  flex flex-col mt-10 sm:mt-14'>
            <div className='w-full relative flex flex-wrap justify-between items-center gap-3'>
                <img className='h-100 absolute -left-160 -top-70' src='/images/vector (1).svg' alt='' />
                <h1 className='text-[#10088F] text-sm sm:text-[16px] font-bold relative'>
                    نظرات دیگر کاربران ( {total} )
                    <img className='absolute -left-6 -top-6' src='/images/vector.svg' alt='' />
                </h1>
                <button
                    type='button'
                    onClick={() => handleOpenModal()}
                    className='border-2 relative border-blue-2 px-5 sm:px-7 py-1.5 sm:py-2 text-blue-2 text-sm sm:text-[16px] font-medium rounded-[16px] active:scale-[0.9] duration-300 cursor-pointer'
                >
                    افزودن نظر
                </button>
            </div>

            <div className='w-full  flex flex-col items-center mt-6 sm:mt-10 gap-4 py-4'>
                {parents.length === 0 ? (
                    <p className='text-sm text-red-500 font-medium py-10'>نظراتی وجود ندارد! </p>
                ) : (
                    shownParents.map((c) => (
                        <CommentThread
                            key={c.id}
                            comment={c}
                            replies={repliesOf(c.id)}
                            onReply={handleOpenModal}
                        />
                    ))
                )}

                {hasMore && (
                    <div className='flex justify-center items-center'>
                        <button
                            type='button'
                            onClick={() => setVisible((v) => v + PAGE_SIZE)}
                            className='flex items-center gap-1 cursor-pointer'
                        >
                            <p className='text-sm sm:text-[16px] font-bold text-[#005EA4]'>مشاهده نظرات بیشتر</p>
                            <ChevronDownIcon size={23} color='#005EA4' />
                        </button>
                    </div>
                )}
            </div>

            <HotelAddComment
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                houseId={houseId}
                parentCommentId={replyTo}
                onSuccess={onCommentAdded ?? (() => router.refresh())}
            />
        </div>
    )
}

export default HotelComments