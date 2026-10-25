'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import { EyeClosed, EyeIcon } from 'lucide-react'
import AuthFloatingMenu from '../../login/popMenu/PopMenu'
import { registerStep3Schema, RegisterStep3FormData } from '@/lib/schemas/auth'
import { completeRegistration } from '@/lib/Api/authApi'
import { RegisterStepName } from '../types/types'

interface IStep {
    setStep: (step: RegisterStepName) => void
    userId: string
}

const getStrength = (pw: string) => {
    if (!pw) return 0
    if (pw.length < 8) return 1
    const hasNumber = /\d/.test(pw)
    const hasMixed = /[A-Z]/.test(pw) || /[^A-Za-z0-9]/.test(pw)
    if (hasNumber && hasMixed) return 3
    return 2
}

const strengthInfo = [
    null,
    { label: 'ضعیف', bar: 'bg-red-500', text: 'text-red-500' },
    { label: 'متوسط', bar: 'bg-yellow-400', text: 'text-yellow-500' },
    { label: 'قوی', bar: 'bg-[#0A9E88]', text: 'text-[#0A9E88]' },
]

export default function RegisterStep3({ setStep, userId }: IStep) {
    const [isShow, setIsShow] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterStep3FormData>({
        resolver: zodResolver(registerStep3Schema),
    })

    const strength = getStrength(watch('password') ?? '')
    const info = strengthInfo[strength]

    const onSubmit = async (values: RegisterStep3FormData) => {
        try {
            await completeRegistration({
                userId,
                phoneNumber: values.phoneNumber,
                password: values.password,
            })
            toast.success('ثبت‌نام با موفقیت انجام شد، وارد شوید')
            router.push('/login')
        } catch (err) {
            const message = isAxiosError(err) ? err.response?.data?.message : undefined
            toast.error(message || 'ثبت‌نام ناموفق بود، دوباره تلاش کنید')
        }
    }

    return (
        <div className="relative flex-1 min-w-0 h-full flex flex-col">
            <div className="relative w-full h-[72px] shrink-0">
                <div className="absolute left-6 top-4 z-50 flex h-10 w-10">
                    <AuthFloatingMenu />
                </div>
                <img
                    src="/images/vec (2).svg"
                    alt="بازگشت به صفحه اصلی"
                    className="absolute left-[150px] top-5 h-[140px] object-cover pointer-events-none"
                />
            </div>

            <div className="relative flex-1 flex items-center justify-center pl-[100px]">
                {/* Stepper */}
                <ol className="absolute left-6 top-[42%] -translate-y-1/2 flex flex-col items-center">
                    <li className="flex flex-col items-center">
                        <img src="/images/One.svg" alt="" className="h-11 w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#05ED6A] dark:text-white-1 font-bold">ایمیل</span>
                        <span className="my-2 h-10 border-l-2 border border-[#05ED6A]" />
                    </li>
                    <li className="flex flex-col items-center">
                        <img src="/images/Two (2).svg" alt="" className="h-11 w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#05ED6A]">کد تایید</span>
                        <span className="my-2 h-10 border-l-2 border border-[#05ED6A]" />
                    </li>
                    <li className="flex flex-col items-center">
                        <img src="/images/Three (1).svg" alt="" className="h-11 w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#10088F]">شماره و رمز</span>
                    </li>
                </ol>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-[520px] shrink-0 flex flex-col items-center -mt-8"
                >
                    <p className="text-[#060425] font-bold dark:text-white-1 text-[16px]">خوش آمدید :)</p>
                    <h1 className="text-[#060425] font-bold mt-2.5 dark:text-white-1 text-[20px]">ایجاد حساب کاربری</h1>

                    {/* phone */}
                    <div className="w-full mt-10">
                        <div className="relative cursor-pointer w-full">
                            <input
                                type="tel"
                                id="phoneNumber"
                                dir='rtl'
                                inputMode="numeric"
                                autoComplete="tel"
                                placeholder=" "
                                {...register('phoneNumber')}
                                className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] dark:bg-white-1 bg-transparent px-4 pt-3 pb-1 outline-none"
                            />
                            <img className="absolute left-[13px] top-[17px] h-6" src="/images/mobile.svg" alt="" />
                            <label
                                htmlFor="phoneNumber"
                                className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 dark:bg-white-1 text-[#0887CAB2] transition-all duration-200
                                peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                                peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                                dark:bg-[#121212]"
                            >
                                شماره تماس
                            </label>
                        </div>
                        {errors.phoneNumber && (
                            <p className="mt-1.5 text-[12px] text-red-500">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    {/* password */}
                    <div className="w-full mt-5">
                        <div className="relative cursor-pointer w-full">
                            <input
                                type={isShow ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                dir='rtl'
                                placeholder=" "
                                {...register('password')}
                                className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] bg-transparent dark:bg-white-1 px-4 pt-3 pb-1 outline-none transition-colors duration-200
                                focus:border-[#0A9E88] focus:text-[#0A9E88]"
                            />
                            <button
                                type="button"
                                onClick={() => setIsShow((prev) => !prev)}
                                aria-label={isShow ? 'پنهان کردن رمز' : 'نمایش رمز'}
                                className="absolute cursor-pointer left-[13px] top-[18px] text-[#0887CAB2] peer-focus:text-[#0A9E88] transition-colors duration-200"
                            >
                                {isShow ? <EyeClosed /> : <EyeIcon />}
                            </button>
                            <label
                                htmlFor="password"
                                className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text dark:bg-white-1 px-1 text-[#0887CAB2] transition-all duration-200
                                peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs peer-focus:text-[#0A9E88]
                                peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                                dark:bg-[#121212]"
                            >
                                رمز عبور
                            </label>
                        </div>

                        {errors.password && (
                            <p className="mt-1.5 text-[12px] text-red-500">{errors.password.message}</p>
                        )}

                        {/* strength */}
                        {info && (
                            <div className="mt-3">
                                <div className="flex gap-3 w-full">
                                    {[1, 2, 3].map((i) => (
                                        <span
                                            key={i}
                                            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${strength >= i ? info.bar : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className={`mt-1.5 text-[11px] ${info.text}`}>{info.label}</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 mt-8 flex justify-center items-center rounded-[16px] bg-[#10088F] active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <p className="text-white font-medium text-[16px]">
                            {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
                        </p>
                    </button>
                </form>
            </div>
        </div>
    )
}