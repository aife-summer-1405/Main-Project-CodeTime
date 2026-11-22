
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
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

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

            const isDark = () =>
                document.documentElement.classList.contains('dark')

            const layer = L.tileLayer(tiles(isDark()), {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map)

            const updateTheme = () => {
                const dark = isDark()

                layer.setUrl(tiles(dark))

                const tileContainer = layer.getContainer()

                if (tileContainer) {
                    tileContainer.style.filter = dark
                        ? 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9)'
                        : 'none'
                }
            }

            updateTheme()

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

            observer = new MutationObserver(updateTheme)

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            })
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
