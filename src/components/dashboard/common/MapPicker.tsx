'use client'

import { useEffect, useRef, useState } from 'react'
import type { CircleMarker, Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapPosition = [number, number]

type Props = {
    value: MapPosition | null
    onChange?: (position: MapPosition) => void
    className?: string
}

const DEFAULT_CENTER: MapPosition = [32.4279, 53.688]
const DEFAULT_ZOOM = 5
const FOCUS_ZOOM = 14
const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const round = (value: number) => Math.round(value * 1e6) / 1e6

export default function MapPicker({ value, onChange, className = 'h-64' }: Props) {
    const container = useRef<HTMLDivElement>(null)
    const mapRef = useRef<LeafletMap | null>(null)
    const markerRef = useRef<CircleMarker | null>(null)
    const leafletRef = useRef<typeof import('leaflet') | null>(null)
    const onChangeRef = useRef(onChange)
    const initial = useRef(value)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        let mounted = true
        let observer: MutationObserver | undefined
        let resizer: ResizeObserver | undefined

        const init = async () => {
            const L = await import('leaflet')
            if (!mounted || !container.current) return

            leafletRef.current = L
            const start = initial.current
            const map = L.map(container.current).setView(start ?? DEFAULT_CENTER, start ? FOCUS_ZOOM : DEFAULT_ZOOM)
            mapRef.current = map

            const layer = L.tileLayer(TILES, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)

            const updateTheme = () => {
                const dark = document.documentElement.classList.contains('dark')
                const tileContainer = layer.getContainer()
                if (tileContainer) tileContainer.style.filter = dark ? 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9)' : 'none'
            }

            updateTheme()
            observer = new MutationObserver(updateTheme)
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

            resizer = new ResizeObserver(() => map.invalidateSize())
            resizer.observe(container.current)

            map.on('click', (event) => {
                if (!onChangeRef.current) return
                const position: MapPosition = [round(event.latlng.lat), round(event.latlng.lng)]
                onChangeRef.current(position)
            })

            if (!onChangeRef.current) container.current.style.cursor = 'grab'
            setReady(true)
        }

        init()

        return () => {
            mounted = false
            observer?.disconnect()
            resizer?.disconnect()
            mapRef.current?.remove()
            mapRef.current = null
            markerRef.current = null
            setReady(false)
        }
    }, [])

    const lat = value?.[0]
    const lng = value?.[1]

    useEffect(() => {
        const map = mapRef.current
        const L = leafletRef.current
        if (!ready || !map || !L) return

        if (lat === undefined || lng === undefined || !Number.isFinite(lat) || !Number.isFinite(lng)) {
            markerRef.current?.remove()
            markerRef.current = null
            return
        }

        if (!markerRef.current) {
            markerRef.current = L.circleMarker([lat, lng], { radius: 9, color: '#0887CA', fillColor: '#0887CA', fillOpacity: 0.9, weight: 3 }).addTo(map)
            map.setView([lat, lng], Math.max(map.getZoom(), FOCUS_ZOOM))
            return
        }

        const current = markerRef.current.getLatLng()
        if (current.lat === lat && current.lng === lng) return
        markerRef.current.setLatLng([lat, lng])
        if (!map.getBounds().contains([lat, lng])) map.panTo([lat, lng])
    }, [lat, lng, ready])

    return <div ref={container} className={`isolate w-full overflow-hidden rounded-[36px] rounded-tr-[10px] rounded-bl-[10px] border-2 border-[#28A5E6] ${className}`} />
}
