import api from "../api"

export interface RegisterStep1 {
    email: string
}

export interface RegisterStep2 {
    tempUserId: string
    verificationCode: string
}

export interface RegisterStep3 {
    userId: string
    password: string
    phoneNumber: string
}

export interface Login {
    email: string
    password: string
}

export interface ForgotStep1 {
    email: string
}

export interface ForgotStep2 {
    email: string
    code: string
}

export interface ForgotStep3 {
    email: string
    code: string
    newPassword: string
}

//step1
export const startRegister = (data: RegisterStep1) =>
    api.post('api/auth/register', data)

//step2
export const verifyEmail = (data: RegisterStep2) =>
    api.post('api/auth/verify-email', data)

//step3
export const completeRegistration = (data: RegisterStep3) =>
    api.post('api/auth/complete-registration', data)

//login
export const loginUser = (data: Login) =>
    api.post('api/auth/login', data)

//forgot password
export const forgotPasswordRequest = (data: ForgotStep1) =>
    api.post('api/auth/forgot-password/request', data)

export const forgotPasswordVerify = (data: ForgotStep2) =>
    api.post('api/auth/forgot-password/verify', data)

export const forgotPasswordReset = (data: ForgotStep3) =>
    api.post('api/auth/forgot-password/reset', data)

//login with github or google
export type SocialProvider = 'google' | 'github'

export const GITHUB_LOGIN_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`

export const githubCallback = (params: { code: string; state: string }) =>
    api.get('/api/auth/github/callback', { params })


export const googleLogin = (provider: SocialProvider) =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`

export const googleLoginCallback = (
    provider: SocialProvider,
    params: { code: string; state: string }
) => api.get(`/api/auth/${provider}/callback`, { params })