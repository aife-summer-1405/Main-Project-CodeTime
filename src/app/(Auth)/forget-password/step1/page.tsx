'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import AuthFloatingMenu from '../../login/popMenu/PopMenu'
import { forgotStep1Schema, ForgotStep1FormData } from '@/lib/schemas/auth'
import { forgotPasswordRequest } from '@/lib/Api/authApi'
import type { ForgotStepName } from '../types/types'

interface IStep {
    setStep: (step: ForgotStepName) => void
    setEmail: (email: string) => void
}

export default function ForgotStep1({ setStep, setEmail }: IStep) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotStep1FormData>({
        resolver: zodResolver(forgotStep1Schema),
    })

    const onSubmit = async (values: ForgotStep1FormData) => {
        try {
            await forgotPasswordRequest(values)
            setEmail(values.email)
            toast.success('کد بازیابی به ایمیل شما ارسال شد')
            setStep('step2')
        } catch (err) {
            const message = isAxiosError(err) ? err.response?.data?.message : undefined
            toast.error(typeof message === 'string' ? message : 'خطایی رخ داد، دوباره تلاش کنید')
        }
    }

    return (
        <div className="relative flex-1 min-w-0 xl:h-full flex flex-col">
            <div className="relative w-full h-[72px] shrink-0">
                <div className="absolute left-5 top-0 md:left-35 xl:left-20 xl:top-7 z-50 flex h-10 w-10">
                    <AuthFloatingMenu />
                </div>
                <img
                    src="/images/vec (2).svg"
                    alt="بازگشت به صفحه اصلی"
                    className="hidden xl:block absolute left-[150px] top-5 h-[140px] object-cover pointer-events-none"
                />
            </div>

            <div className="relative flex-1 flex flex-col xl:flex-row items-center justify-center px-4 md:px-0 pb-8 xl:pb-0 xl:pl-[100px]">
                <ol className="flex flex-row xl:flex-col items-start xl:items-center justify-center mb-8 xl:mb-0 xl:absolute xl:left-6 xl:top-[42%] xl:-translate-y-1/2">
                    <li className="flex flex-col items-center">
                        <img src="/images/one (1).svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#10088F] dark:text-white-1 font-bold">ایمیل</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border-dotted border-[#10088F]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border-dotted border-[#10088F]" />
                    <li className="flex flex-col items-center">
                        <img src="/images/Two.svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#777]">کد تایید</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border-dotted border-[#7777778d]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border-dotted border-[#7777778d]" />
                    <li className="flex flex-col items-center">
                        <img src="/images/Three.svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#777]">رمز جدید</span>
                    </li>
                </ol>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-full max-w-[520px] xl:shrink-0 flex flex-col items-center xl:-mt-8"
                >
                    <p className="text-[#060425] font-bold dark:text-white-1 text-[14px] md:text-[16px]">رمز عبور را فراموش کردید؟</p>
                    <h1 className="text-[#060425] font-bold mt-2.5 dark:text-white-1 text-[18px] md:text-[20px]">بازیابی رمز عبور</h1>
                    <p className="mt-3 text-center text-[13px] text-[#777] dark:text-white-1">
                        ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.
                    </p>

                    <div className="w-full mt-8 md:mt-10">
                        <div className="relative cursor-pointer w-full">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                autoComplete="email"
                                {...register('email')}
                                className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] dark:bg-white-1 bg-transparent px-4 pt-3 pb-1 outline-none"
                            />
                            <img className="absolute left-[15px] top-[20px] h-4" src="/images/email.svg" alt="" />
                            <label
                                htmlFor="email"
                                className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 dark:bg-white-1 text-[#0887CAB2] transition-all duration-200
                            peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                            peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                            dark:bg-[#121212]"
                            >
                                ایمیل
                            </label>
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-[12px] text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 flex justify-center items-center mt-6 md:mt-8 rounded-[16px] bg-[#10088F] active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <p className="text-white font-medium text-[16px]">
                            {isSubmitting ? 'در حال ارسال...' : 'ارسال کد'}
                        </p>
                    </button>

                    <div className="w-full flex flex-wrap justify-center items-center mt-5 gap-2">
                        <p className="text-[#060425CC] font-medium text-sm dark:text-white-1">رمز خود را به یاد آوردید؟</p>
                        <Link
                            href="/login"
                            className="text-[#10088F] font-bold border-b border-[#10088F] text-[14px]"
                        >
                            ورود
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}