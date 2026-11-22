export const fa = (n: number) => n.toLocaleString('fa-IR')
export const discountPercent = (price?: number | null, discounted?: number | null) => {
    if (!price || discounted == null || discounted >= price) return 0
    return Math.round(((price - discounted) / price) * 100)
}

export const faDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

export const faTime = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '—'

export const toFaDigits = (value?: string | number | null) =>
    String(value ?? '').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
