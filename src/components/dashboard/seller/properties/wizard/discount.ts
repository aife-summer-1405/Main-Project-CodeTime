export const getDiscountError = (price: string, discountedPrice: string) => {
    const raw = String(discountedPrice ?? '').trim()
    if (!raw) return undefined
    const discounted = Number(raw)
    const original = Number(price)
    if (!(discounted > 0)) return 'قیمت تخفیف باید بیشتر از صفر باشد'
    if (original > 0 && discounted >= original) return 'قیمت تخفیف باید کمتر از قیمت اصلی باشد'
    return undefined
}