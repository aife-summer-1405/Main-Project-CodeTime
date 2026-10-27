'use client'
import { EyeClosed, EyeIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import AuthFloatingMenu from './popMenu/PopMenu'
import LoginSlider from './slider/LoginSlider'
import { loginSchema, LoginFormData } from '@/lib/schemas/auth'
import { loginUser } from '@/lib/Api/authApi'
import SocialButtons from '@/app/(Auth)/components/SocialButtons'

const LoginPage = () => {
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormData) => {
    try {
      const { data } = await loginUser(values)
      console.log(values)
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      toast.success('با موفقیت وارد شدید')
      router.push('/')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : undefined
      if (message === 'Invalid credentials') {
        return toast.error('ایمیل یا رمز عبور اشتباه است')
      }
      toast.error('مشکلی پیش آمده، دوباره تلاش کنید')
    }
  }

  return (
    <div className="w-full min-h-dvh bg-white-1 flex justify-center items-center p-1 dark:bg-[#121212]">
      <div className="w-full max-w-[1600px] lg:h-[min(900px,calc(100dvh-32px))] flex flex-col lg:flex-row-reverse">
        <div className="hidden lg:block relative w-[40%] h-full shrink-0 overflow-hidden">
          <LoginSlider registerForm={false} />
        </div>

        {/* Form */}
        <div className="flex-1 min-w-0 flex justify-center items-center lg:h-full">
          <div className="relative w-full max-w-[520px] lg:h-full flex flex-col items-center px-4 md:px-0 pt-24 pb-8 md:pt-40 md:pb-0">
            <img
              src="/images/vec.svg"
              alt="بازگشت به صفحه اصلی"
              className="hidden md:block absolute right-0 top-0 h-35 object-cover"
            />

            <div className="absolute right-5 top-0 md:-right-15 md:top-4 xl:-right-20 xl:top-4 z-50 flex h-10 w-10">
              <AuthFloatingMenu />
            </div>

            <p className="text-[#060425] font-bold dark:text-white-1 text-[14px] md:text-[16px]">خوش آمدید :)</p>
            <h1 className="text-[#060425] font-bold mt-2.5 dark:text-white-1 text-[18px] md:text-[20px]">ورود به حساب کاربری</h1>

            {/* google github */}
            <SocialButtons/>

            <div className="w-full flex justify-center items-center py-3 mt-3">
              <i className="w-full border-t-2 dark:border-blue-3 border-[#7777778d]"></i>
              <p className="text-[#0887CA] dark:text-blue-3 px-1.5">یا</p>
              <i className="w-full border-t-2 border-[#7777778d] dark:border-blue-3"></i>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="w-full flex flex-col items-center"
            >
              {/* email */}
              <div className="w-full mt-3">
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

              {/* password */}
              <div className="w-full mt-3">
                <div className="relative cursor-pointer w-full">
                  <input
                    type={isShow ? 'text' : 'password'}
                    id="password"
                    placeholder=" "
                    autoComplete="current-password"
                    {...register('password')}
                    className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] bg-transparent dark:bg-white-1 px-4 pt-3 pb-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsShow((prev) => !prev)}
                    aria-label={isShow ? 'پنهان کردن رمز' : 'نمایش رمز'}
                    className="absolute left-[13px] top-[18px]"
                  >
                    {isShow ? <EyeClosed className='cursor-pointer' color="#0887CAB2" /> : <EyeIcon className='cursor-pointer' color="#0887CAB2" />}
                  </button>
                  <label
                    htmlFor="password"
                    className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text dark:bg-white-1 px-1 text-[#0887CAB2] transition-all duration-200
                    peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                    dark:bg-[#121212]"
                  >
                    رمز عبور
                  </label>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-[12px] text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-wrap w-full items-center justify-end gap-x-3 gap-y-3 mt-6 md:mt-8">
                {/* <p className="text-[#10088F] font-bold border-b dark:text-white-1 border-[#10088F] text-[13px] md:text-[14px] cursor-pointer">ورود با شماره موبایل</p> */}
                <Link href={'forget-password'} className="text-[#0887CAB2] font-semibold border-b border-[#0887CAB2] text-xs cursor-pointer">رمز عبور خود را فراموش کردید؟</Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center h-14 mt-6 md:mt-8 rounded-[16px] bg-[#10088F] active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <p className="text-white font-medium text-[16px]">
                  {isSubmitting ? 'در حال ورود...' : 'ورود'}
                </p>
              </button>
            </form>

            <div className="w-full flex justify-center items-center mt-3">
              <ul className="flex flex-wrap justify-center items-center gap-2">
                <p className="text-[#060425CC] font-medium text-sm dark:text-white-1">حساب کاربری ندارید؟</p>
                <Link href="/register" className="text-[#10088F] font-bold border-b border-[#10088F] text-[14px] cursor-pointer">ثبت نام</Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage