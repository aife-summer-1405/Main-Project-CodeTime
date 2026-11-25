const errorTranslations: [string, string][] = [
    ['access denied', 'دسترسی شما به این بخش مجاز نیست'],
    ['unauthorized', 'ابتدا وارد حساب کاربری خود شوید'],
    ['forbidden', 'شما اجازه‌ی انجام این عملیات را ندارید'],
    ['not found', 'مورد درخواستی یافت نشد'],
    ['network error', 'خطا در اتصال به اینترنت'],
]

const translateError = (message: string) => {
    const lower = message.toLowerCase()
    return errorTranslations.find(([key]) => lower.includes(key))?.[1] ?? message
}

export const getErrorMessage = (error: unknown, fallback: string) => {
    const err = error as { message?: string; response?: { data?: { message?: string } } }
    const message = err?.response?.data?.message ?? err?.message
    return message ? translateError(message) : fallback
}
