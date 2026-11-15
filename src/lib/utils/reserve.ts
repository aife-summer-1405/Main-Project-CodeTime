const FA = '۰۱۲۳۴۵۶۷۸۹'
const AR = '٠١٢٣٤٥٦٧٨٩'

export const faNum = (n: number) => n.toLocaleString('fa-IR')

export const toEnDigits = (s: string) =>
    s.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)))

export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => FA[Number(d)])

export const formatFaDate = (s?: string) => {
    if (!s) return '—'
    const d = new Date(s)
    if (isNaN(d.getTime())) return s
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}