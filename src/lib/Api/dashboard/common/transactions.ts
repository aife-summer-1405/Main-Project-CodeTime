export const TRANSACTION_LABELS: Record<string, string> = {
    rental: 'اجاره',
    mortgage: 'رهن',
    reservation: 'رزرو',
    direct_purchase: 'خرید مستقیم',
}

const LABEL_TO_KEY: Record<string, string> = Object.fromEntries(
    Object.entries(TRANSACTION_LABELS).map(([key, label]) => [label, key])
)

export const transactionKey = (value: string | null | undefined): string => {
    const raw = (value ?? '').trim()
    if (!raw) return ''
    if (raw in TRANSACTION_LABELS) return raw
    const normalized = raw.toLowerCase().replace(/[\s-]+/g, '_')
    if (normalized in TRANSACTION_LABELS) return normalized
    return LABEL_TO_KEY[raw] ?? raw
}

export const transactionLabel = (value: string) => {
    if (!value) return '—'
    return TRANSACTION_LABELS[transactionKey(value)] ?? value
}

export const transactionOptions = Object.entries(TRANSACTION_LABELS).map(([value, label]) => ({
    label,
    value,
}))
