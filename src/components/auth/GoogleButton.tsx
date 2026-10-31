'use client'

export default function GoogleButton() {
    const handleGoogle = () => {
        const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '')
        window.location.href = `${base}/api/auth/google`
    }

    return (
        <button
            type="button"
            onClick={handleGoogle}
            className="w-full h-14 flex justify-center items-center mt-8 md:mt-10 rounded-[16px] bg-[#0887CA] active:scale-[0.97] transition cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <img src="/images/google.svg" alt="" />
                <p className="text-white font-medium text-[14px]">ورود با حساب گوگل</p>
            </div>
        </button>
    )
}