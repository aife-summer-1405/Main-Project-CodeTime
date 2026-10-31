'use client'
import React, { Suspense, useState } from 'react'
import LoginSlider from '../login/slider/LoginSlider'
import { RegisterPhoneStepName } from './types/types'
import RegisterPhoneStep1 from './step1/page'
import RegisterPhoneStep2 from './step2/page'
import RegisterPhoneStep3 from './step3/page'

export default function RegisterPhoneLayout() {
    const [step, setStep] = useState<RegisterPhoneStepName>('step1')
    const [phoneNumber, setPhoneNumber] = useState('')
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
                    <RegisterPhoneStep1
                        setStep={setStep}
                        setTempUserId={setTempUserId}
                        setPhoneNumber={setPhoneNumber}
                    />
                )}
                {step === 'step2' && tempUserId !== null && (
                    <RegisterPhoneStep2
                        setStep={setStep}
                        tempUserId={tempUserId}
                        phoneNumber={phoneNumber}
                        setTempUserId={setTempUserId}
                        setUserId={setUserId}
                    />
                )}
                {step === 'step3' && userId !== null && (
                    <RegisterPhoneStep3
                        setStep={setStep}
                        userId={userId}
                        phoneNumber={phoneNumber}
                    />
                )}
            </div>
        </div>
    )
}