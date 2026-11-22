'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

type Position = [number, number]

type Props = {
    value: Position | null
    onChange: (position: Position) => void
}

const DEFAULT_CENTER: Position = [36.5633, 53.0601]

const tiles = (dark: boolean) =>
    dark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function LocationPicker({ value, onChange }: Props) {
    const container = useRef<HTMLDivElement>(null)
    const onChangeRef = useRef(onChange)
    const initial = useRef(value)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        let map: import('leaflet').Map | undefined
        let observer: MutationObserver | undefined
        let mounted = true

        const init = async () => {
            const L = await import('leaflet')
            if (!mounted || !container.current) return

            const start = initial.current ?? DEFAULT_CENTER
            map = L.map(container.current).setView(start, 14)

            const layer = L.tileLayer(tiles(document.documentElement.classList.contains('dark')), {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
            }).addTo(map)

            const marker = L.circleMarker(start, {
                radius: 9,
                color: '#0887CA',
                fillColor: '#0887CA',
                fillOpacity: 0.9,
                weight: 3,
            }).addTo(map)

            map.on('click', (e) => {
                marker.setLatLng(e.latlng)
                onChangeRef.current([e.latlng.lat, e.latlng.lng])
            })

            observer = new MutationObserver(() => layer.setUrl(tiles(document.documentElement.classList.contains('dark'))))
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        }

        init()

        return () => {
            mounted = false
            observer?.disconnect()
            map?.remove()
        }
    }, [])

    return <div ref={container} className='h-full w-full' />
}
