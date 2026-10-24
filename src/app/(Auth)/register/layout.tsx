'use client'
import React, { Suspense, useState } from 'react'
import LoginSlider from '../login/slider/LoginSlider'
import RegisterStep2 from './step2/page'
import RegisterStep3 from './step3/page'
import { RegisterStepName } from './types/types'
import RegisterStep1 from './step1/page'

export default function RegisterLayout() {
    const [step, setStep] = useState<RegisterStepName>('step1')
    const [email, setEmail] = useState('')
    const [tempUserId, setTempUserId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    return (
        <div className="w-full min-h-dvh bg-white-1 flex justify-center items-center p-1 dark:bg-[#121212]">
            <div className="w-full max-w-[1600px] xl:h-[min(900px,calc(100dvh-32px))] flex flex-col xl:flex-row">
                <div className="hidden xl:block relative w-[40%] h-full shrink-0 overflow-hidden">
                    <Suspense fallback={null}>
                        <LoginSlider registerForm={true} />
                    </Suspense>
                </div>

                {step === 'step1' && (
                    <RegisterStep1
                        setStep={setStep}
                        setTempUserId={setTempUserId}
                        setEmail={setEmail}
                    />
                )}
                {step === 'step2' && tempUserId !== null && (
                    <RegisterStep2
                        setStep={setStep}
                        tempUserId={tempUserId}
                        email={email}
                        setTempUserId={setTempUserId}
                        setUserId={setUserId}
                    />
                )}
                {step === 'step3' && userId !== null && (
                    <RegisterStep3 setStep={setStep} userId={userId} />
                )}
            </div>
        </div>
    )
}