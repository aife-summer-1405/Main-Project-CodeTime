import { toFaDigits } from '@/lib/format'

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

export const parseReadingMinutes = (value: string) => {
    const latin = value.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    return latin.match(/\d+/)?.[0] ?? ''
}

export const formatReadingTime = (minutes: string | number) => `${toFaDigits(Number(minutes))} دقیقه`
