'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import AuthFloatingMenu from '../../login/popMenu/PopMenu'
import { forgotStep2Schema, ForgotStep2FormData } from '@/lib/schemas/auth'
import { forgotPasswordRequest, forgotPasswordVerify } from '@/lib/Api/authApi'
import type { ForgotStepName } from '../types/types'

const RESEND_SECONDS = 600
interface IStep {
    setStep: (step: ForgotStepName) => void
    email: string
    setResetCode: (code: string) => void
}

const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function ForgotStep2({ setStep, email, setResetCode }: IStep) {
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
    const [isResending, setIsResending] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotStep2FormData>({
        resolver: zodResolver(forgotStep2Schema),
    })

    useEffect(() => {
        if (secondsLeft <= 0) return
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
        return () => clearTimeout(timer)
    }, [secondsLeft])

    const onSubmit = async (values: ForgotStep2FormData) => {
        try {
            await forgotPasswordVerify({ email, code: values.code })
            setResetCode(values.code)
            toast.success('کد تایید شد')
            setStep('step3')
        } catch (err) {
            const message = isAxiosError(err) ? err.response?.data?.message : undefined
            toast.error(typeof message === 'string' ? message : 'کد تایید اشتباه است')
        }
    }

    const handleResend = async () => {
        if (secondsLeft > 0 || isResending) return
        setIsResending(true)
        try {
            await forgotPasswordRequest({ email })
            setSecondsLeft(RESEND_SECONDS)
            toast.success('کد جدید ارسال شد')
        } catch (err) {
            const message = isAxiosError(err) ? err.response?.data?.message : undefined
            toast.error(typeof message === 'string' ? message : 'ارسال دوباره ناموفق بود')
        } finally {
            setIsResending(false)
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
                        <img src="/images/One.svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#05ED6A] dark:text-white-1 font-bold">ایمیل</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border border-[#05ED6A]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border border-[#05ED6A]" />
                    <li className="flex flex-col items-center">
                        <img src="/images/Two (1).svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#10088F]">کد تایید</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border-dotted border-[#10088F]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border-dotted border-[#10088F]" />
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
                    <p className="text-[#060425] font-bold dark:text-white-1 text-[14px] md:text-[16px]">کد بازیابی</p>
                    <h1 className="text-[#060425] font-bold mt-2.5 dark:text-white-1 text-[18px] md:text-[20px]">بازیابی رمز عبور</h1>
                    <p dir="ltr" className="mt-3 text-center text-[13px] text-[#777] dark:text-white-1 break-all">
                        {email}
                    </p>

                    <div className="w-full mt-8 md:mt-10">
                        <div className="relative cursor-pointer w-full">
                            <input
                                type="text"
                                id="code"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder=" "
                                {...register('code')}
                                className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] dark:bg-white-1 bg-transparent px-4 pt-3 pb-1 outline-none"
                            />
                            <img className="absolute left-[15px] top-[17px] h-6" src="/images/Icon.svg" alt="" />
                            <label
                                htmlFor="code"
                                className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 dark:bg-white-1 text-[#0887CAB2] transition-all duration-200
                            peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                            peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                            dark:bg-[#121212]"
                            >
                                کد تایید
                            </label>
                        </div>
                        {errors.code && (
                            <p className="mt-1.5 text-[12px] text-red-500">{errors.code.message}</p>
                        )}
                    </div>

                    <div className="w-full flex flex-wrap justify-between items-center gap-x-3 gap-y-3 py-6 md:py-7">
                        <button
                            type="button"
                            onClick={() => setStep('step1')}
                            className="text-[#10088F] font-bold border-b border-[#10088F] text-[13px] cursor-pointer"
                        >
                            تغییر ایمیل
                        </button>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={secondsLeft > 0 || isResending}
                                className="text-[#0887CA] font-bold border-b border-[#0887CA] text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isResending ? 'در حال ارسال...' : 'ارسال دوباره'}
                            </button>
                            <div className="flex gap-1 items-center justify-center">
                                <span className="text-[#10088F] dark:text-white-1 pt-0.5 font-semibold text-[13px] tabular-nums">
                                    {formatTime(secondsLeft)}
                                </span>
                                <img src="/images/sandclock.svg" className="h-7" alt="" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 flex justify-center items-center rounded-[16px] bg-[#10088F] active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <p className="text-white font-medium text-[16px]">
                            {isSubmitting ? 'در حال بررسی...' : 'تایید'}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep('step1')}
                        className="w-full h-14 flex justify-center items-center mt-6 md:mt-8 rounded-[16px] border-[#10088F] border-2 active:scale-[0.97] transition cursor-pointer"
                    >
                        <p className="text-[#10088F] dark:text-white-1 font-medium text-[16px]">مرحله قبل</p>
                    </button>
                </form>
            </div>
        </div>
    )
}