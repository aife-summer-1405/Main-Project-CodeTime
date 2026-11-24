import { fa } from '@/lib/format'

export const PAGE_LIMIT = 12

export const NONE_LABEL = 'هیچکدام'

export const SORT_OPTIONS = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'cheapest', label: 'ارزان‌ترین' },
    { value: 'expensive', label: 'گران‌ترین' },
]

export const TYPE_OPTIONS = [
    { value: 'mortgage', label: 'رهن' },
    { value: 'rental', label: 'اجاره' },
]

export const transactionTypeParam = (type: string) => (type ? type : 'rental,mortgage')

export const typeTitle = (type: string) => TYPE_OPTIONS.find((o) => o.value === type)?.label ?? 'رهن و اجاره'

const toman = (value: number) =>
    value >= 1_000_000_000 ? `${fa(value / 1_000_000_000)} میلیارد تومان` : `${fa(value / 1_000_000)} میلیون تومان`

export type RangeKey = 'minArea' | 'maxArea' | 'minPrice' | 'maxPrice' | 'minRent' | 'maxRent'

export type RangeGroup = {
    id: string
    minKey: RangeKey
    maxKey: RangeKey
    minTitle: string
    maxTitle: string
    values: number[]
    format: (value: number) => string
    empty: string
}

export const RANGE_GROUPS: RangeGroup[] = [
    {
        id: 'area',
        minKey: 'minArea',
        maxKey: 'maxArea',
        minTitle: 'حداقل متراژ',
        maxTitle: 'حداکثر متراژ',
        values: [30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 300, 500],
        format: (value) => `${fa(value)} متر`,
        empty: `${fa(0)} متر`,
    },
    {
        id: 'price',
        minKey: 'minPrice',
        maxKey: 'maxPrice',
        minTitle: 'حداقل قیمت',
        maxTitle: 'حداکثر قیمت',
        values: [50, 100, 200, 300, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000].map((v) => v * 1_000_000),
        format: toman,
        empty: `${fa(0)} تومان`,
    },
    {
        id: 'rent',
        minKey: 'minRent',
        maxKey: 'maxRent',
        minTitle: 'حداقل اجاره',
        maxTitle: 'حداکثر اجاره',
        values: [2, 5, 10, 15, 20, 30, 50, 80, 100, 200, 300, 500, 800, 1000, 2000, 3000, 5000].map((v) => v * 1_000_000),
        format: toman,
        empty: `${fa(0)} تومان`,
    },
]

export type RentFilters = {
    q: string
    sort: string
    location: string
    type: string
    category: string
    minArea: string
    maxArea: string
    minPrice: string
    maxPrice: string
    minRent: string
    maxRent: string
    page: number
}

export const FILTER_KEYS: (keyof RentFilters)[] = [
    'q',
    'sort',
    'location',
    'type',
    'category',
    'minArea',
    'maxArea',
    'minPrice',
    'maxPrice',
    'minRent',
    'maxRent',
]
