export const fa = (n: number) => n.toLocaleString('fa-IR')
export const discountPercent = (price?: number | null, discounted?: number | null) => {
    if (!price || discounted == null || discounted >= price) return 0
    return Math.round(((price - discounted) / price) * 100)
}