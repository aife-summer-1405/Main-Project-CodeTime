'use client'
import React, { Suspense, useState } from 'react'
import LoginSlider from '../login/slider/LoginSlider'
import type { ForgotStepName } from './types/types'
import ForgotStep1 from './step1/page'
import ForgotStep2 from './step2/page'
import ForgotStep3 from './step3/page'

export default function ForgetPasswordLayout() {
    const [step, setStep] = useState<ForgotStepName>('step1')
    const [email, setEmail] = useState('')
    const [resetCode, setResetCode] = useState('')

    return (
        <div className="w-full min-h-dvh bg-white-1 flex justify-center items-center p-1 dark:bg-[#121212]">
            <div className="w-full max-w-[1600px] xl:h-[min(900px,calc(100dvh-32px))] flex flex-col xl:flex-row">
                <div className="hidden xl:block relative w-[40%] h-full shrink-0 overflow-hidden">
                    <Suspense fallback={null}>
                        <LoginSlider registerForm={true} />
                    </Suspense>
                </div>

                {step === 'step1' && (
                    <ForgotStep1 setStep={setStep} setEmail={setEmail} />
                )}
                {step === 'step2' && email !== '' && (
                    <ForgotStep2
                        setStep={setStep}
                        email={email}
                        setResetCode={setResetCode}
                    />
                )}
                {step === 'step3' && email !== '' && resetCode !== '' && (
                    <ForgotStep3 email={email} code={resetCode} />
                )}
            </div>
        </div>
    )
}