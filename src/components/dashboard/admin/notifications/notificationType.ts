const TYPE_LABELS: Record<string, string> = {
    reserve: 'رزرو',
}

export const notificationTypeLabel = (type: string) => {
    if (!type || /^<.*>$/.test(type)) return '—'
    return TYPE_LABELS[type] ?? type
}
