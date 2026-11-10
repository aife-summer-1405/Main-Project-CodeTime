'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { addComment } from '@/lib/Api/reserveDetail'

interface IProps {
    open: boolean
    onClose: () => void
    houseId: number | string
    parentCommentId?: string | null
    onSuccess?: () => void
}

const errors: Record<string, string> = {
    'Caption must be at least 10 characters long': 'متن نظر باید حداقل ۱۰ کاراکتر باشد',
    'Parent comment must belong to the same house': 'نظر اصلی متعلق به این هتل نیست',
}

const HotelAddComment = ({ open, onClose, houseId, parentCommentId = null, onSuccess }: IProps) => {
    const isReply = !!parentCommentId
    const [caption, setCaption] = useState('')
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && !loading && onClose()
        window.addEventListener('keydown', onEsc)
        return () => window.removeEventListener('keydown', onEsc)
    }, [open, loading, onClose])

    const submit = async () => {
        if (!caption.trim()) return toast.error('متن نظر را وارد کنید')
        if (!isReply && !rating) return toast.error('امتیاز را انتخاب کنید')

        setLoading(true)
        try {
            await addComment({
                house_id: String(houseId),
                title: 'hello',
                caption: caption.trim(),
                rating: isReply ? 5 : rating,
                parent_comment_id: parentCommentId,
            })
            toast.success(isReply ? 'پاسخ شما ثبت شد' : 'نظر شما ثبت شد')
            setCaption('')
            setRating(0)
            onClose()
            onSuccess?.()
        } catch (err: any) {
            const msg = err?.response?.data?.message
            toast.error(errors[msg] ?? msg ?? 'خطا در ارسال، دوباره تلاش کنید')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className='fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 px-3 sm:px-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => !loading && onClose()}
                >
                    <motion.div
                        dir='rtl'
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className='w-full max-w-[596px] max-h-[92vh] overflow-y-auto bg-[#F5F5F5] flex flex-col gap-4 px-5 py-6 sm:px-16 sm:py-9 rounded-tr-[40px] rounded-bl-[40px] sm:rounded-tr-[64px] sm:rounded-bl-[64px] rounded-tl-[8px] rounded-br-[8px]'
                    >
                        {!isReply && (
                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 px-1'>
                                <p className='text-sm font-medium text-[#060425]'>امتیاز شما:</p>
                                <div className='flex gap-1' onMouseLeave={() => setHover(0)}>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <motion.button
                                            key={n}
                                            type='button'
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.85 }}
                                            onMouseEnter={() => setHover(n)}
                                            onClick={() => setRating(n)}
                                            className='cursor-pointer'
                                        >
                                            <Star
                                                size={24}
                                                color='#0887CAB2'
                                                fill={n <= (hover || rating) ? '#0887CAB2' : 'transparent'}
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className='relative w-full'>
                            <textarea
                                id='comment-caption'
                                placeholder=' '
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className='peer w-full h-[120px] sm:h-[145px] resize-none rounded-[16px] border-2 border-[#0887CAB2] bg-transparent px-4 pt-6 pb-1 text-[#060425] outline-none'
                            />
                            <label
                                htmlFor='comment-caption'
                                className='absolute right-4 top-[18px] px-1 text-[#0887CAB2] transition-all duration-200 cursor-text
                                peer-focus:top-[10px] peer-focus:-translate-y-1/2 peer-focus:text-xs
                                peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs'
                            >
                                پیام شما
                            </label>
                        </div>

                        <motion.button
                            type='button'
                            onClick={submit}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className='w-full h-12 sm:h-14 bg-[#10088F] text-white text-sm sm:text-[16px] font-bold rounded-[16px] cursor-pointer disabled:opacity-60'
                        >
                            {loading ? 'در حال ارسال...' : 'ارسال نظر'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default HotelAddComment