import type { Filters } from '@/components/reserve/filters/FilterDrawer'
import type { Hotel } from '@/lib/Api/house'

export type { Hotel }

const countKeys = ['beds', 'baths', 'toilets', 'parking'] as const

export function filterHotels(list: Hotel[], f: Filters, query: string): Hotel[] {
    const q = query.trim()

    const result = list.filter((h) => {
        if (q && !`${h.title} ${h.location}`.includes(q)) return false
        if (f.destination.length && !f.destination.includes(h.city)) return false
        if (f.facilities.length && !f.facilities.every((x) => h.facilities.includes(x))) return false
        if (f.minPrice[0] && h.price < Number(f.minPrice[0])) return false
        if (f.maxPrice[0] && h.price > Number(f.maxPrice[0])) return false
        for (const k of countKeys) {
            const need = f[k]
            if (need !== null && h[k] < need) return false
        }
        return true
    })

    switch (f.sort[0]) {
        case 'cheapest':
            return [...result].sort((a, b) => a.price - b.price)
        case 'expensive':
            return [...result].sort((a, b) => b.price - a.price)
        case 'rating':
            return [...result].sort((a, b) => b.rating - a.rating)
        case 'newest':
            return [...result].sort((a, b) => b.id - a.id)
        default:
            return result
    }
}