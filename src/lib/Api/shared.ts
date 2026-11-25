export type Raw = Record<string, unknown>

export const obj = (value: unknown): Raw => (value && typeof value === 'object' ? (value as Raw) : {})

export const text = (value: unknown) => (value === undefined || value === null ? '' : String(value))

export const number = (value: unknown) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

export const first = (...values: unknown[]) => values.find((v) => v !== undefined && v !== null && v !== '')

export const strings = (value: unknown) => (Array.isArray(value) ? value.map(text) : [])
