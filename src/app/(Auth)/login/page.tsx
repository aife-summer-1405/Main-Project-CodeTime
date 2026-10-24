import React, { Suspense } from 'react'
import LoginPage from './LoginPage'

const page = () => {
    return (
        <div>
            <Suspense fallback={null}>
                <LoginPage />
            </Suspense>
        </div>
    )
}

export default page