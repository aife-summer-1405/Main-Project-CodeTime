'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { createAdminBlog, updateAdminBlog, type AdminBlog } from '@/lib/Api/dashboard/admin/blogs'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'
import FieldBox, { fieldInput } from '../FieldBox'
import { formatReadingTime, parseReadingMinutes } from './readingTime'

type Option = { label: string; value: string }

type Props = { open: boolean; blog: AdminBlog | null; categories: Option[]; onClose: () => void; onSaved: () => void }

type Values = {
    title: string
    caption: string
    minutes: string
    authorId: string
    categoryId: string
}

const TITLE_MIN = 5
const TITLE_MAX = 150
const CAPTION_MIN = 20
const CAPTION_MAX = 2000
const MINUTES_MAX = 120

const emptyValues = (): Values => ({
    title: '',
    caption: '',
    minutes: '',
    authorId: typeof window === 'undefined' ? '' : (getUserId() ?? ''),
    categoryId: '',
})

const fromBlog = (blog: AdminBlog): Values => ({
    title: blog.title,
    caption: blog.caption,
    minutes: parseReadingMinutes(blog.readingTime),
    authorId: blog.authorId,
    categoryId: blog.categoryId,
})

export default function AdminBlogFormModal({ open, blog, categories, onClose, onSaved }: Props) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange', defaultValues: emptyValues() })

    useEffect(() => {
        if (open) reset(blog ? fromBlog(blog) : emptyValues())
    }, [open, blog, reset])

    const onSubmit = async (values: Values) => {
        const body = {
            title: values.title.trim(),
            caption: values.caption.trim(),
            estimated_reading_time: formatReadingTime(values.minutes),
            author_id: Number(values.authorId),
            category_id: Number(values.categoryId),
        }

        try {
            if (blog) await updateAdminBlog(blog.id, body)
            else await createAdminBlog(body)
            toast.success(blog ? 'مقاله با موفقیت ویرایش شد' : 'مقاله جدید با موفقیت ثبت شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, blog ? 'ویرایش مقاله با خطا مواجه شد' : 'ثبت مقاله با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={blog ? 'ویرایش مقاله' : 'افزودن مقاله جدید'} className='max-w-xl'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='عنوان مقاله' error={errors.title?.message}>
                    <input
                        className={fieldInput}
                        {...register('title', {
                            required: 'عنوان مقاله را وارد کنید',
                            validate: (value) => value.trim().length >= TITLE_MIN || `عنوان باید حداقل ${fa(TITLE_MIN)} کاراکتر باشد`,
                            maxLength: { value: TITLE_MAX, message: `عنوان نباید بیشتر از ${fa(TITLE_MAX)} کاراکتر باشد` },
                        })}
                    />
                </FieldBox>

                <FieldBox title='خلاصه مقاله' error={errors.caption?.message}>
                    <textarea
                        rows={5}
                        className={`${fieldInput} resize-none leading-6`}
                        {...register('caption', {
                            required: 'خلاصه مقاله را وارد کنید',
                            validate: (value) => value.trim().length >= CAPTION_MIN || `خلاصه باید حداقل ${fa(CAPTION_MIN)} کاراکتر باشد`,
                            maxLength: { value: CAPTION_MAX, message: `خلاصه نباید بیشتر از ${fa(CAPTION_MAX)} کاراکتر باشد` },
                        })}
                    />
                </FieldBox>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <Controller
                        control={control}
                        name='categoryId'
                        rules={{ required: 'دسته بندی را انتخاب کنید' }}
                        render={({ field, fieldState }) => (
                            <div className='flex min-w-0 flex-col gap-1'>
                                <FilterSelect
                                    label='دسته بندی'
                                    value={field.value}
                                    options={categories}
                                    onChange={field.onChange}
                                    allowAll={false}
                                    className='w-full'
                                />
                                {fieldState.error && <p className='px-1 text-[11px] text-red-500'>{fieldState.error.message}</p>}
                            </div>
                        )}
                    />

                    <FieldBox title='زمان مطالعه ( دقیقه )' error={errors.minutes?.message}>
                        <input
                            type='number'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('minutes', {
                                required: 'زمان مطالعه را وارد کنید',
                                validate: (value) => Number.isInteger(Number(value)) || 'زمان مطالعه باید عدد صحیح باشد',
                                min: { value: 1, message: 'زمان مطالعه باید حداقل ۱ دقیقه باشد' },
                                max: { value: MINUTES_MAX, message: `زمان مطالعه نباید بیشتر از ${fa(MINUTES_MAX)} دقیقه باشد` },
                            })}
                        />
                    </FieldBox>
                </div>

                {/* <FieldBox title='شناسه نویسنده' error={errors.authorId?.message}>
                    <input
                        type='number'
                        dir='ltr'
                        className={`${fieldInput} text-right`}
                        {...register('authorId', {
                            required: 'شناسه نویسنده را وارد کنید',
                            validate: (value) => (Number.isInteger(Number(value)) && Number(value) > 0) || 'شناسه نویسنده معتبر نیست',
                        })}
                    />
                </FieldBox> */}

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : blog ? 'ذخیره تغییرات' : 'ثبت مقاله'}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </Modal>
    )
}
