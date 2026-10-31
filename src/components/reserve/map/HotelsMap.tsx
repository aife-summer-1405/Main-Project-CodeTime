'use client'
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import Link from 'next/link'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { type Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fa } from '@/lib/format'
import { Hotel } from '@/lib/Api/house'

const money = (n: number) => fa(n).replace(/٬/g, ',')
const POPUP_OFFSET = 17
const FONT = 'font-[family-name:IRANSansX,IRANSans,Vazirmatn,Tahoma,sans-serif]'

// مرکز فرضی (وسط ایران) برای هتل‌هایی که مختصات ندارن
const FALLBACK: [number, number] = [32.4279, 53.688]

const coords = (h: Hotel): [number, number] => {
    const lat = Number(h.location?.lat)
    const lng = Number(h.location?.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng]

    
    let seed = 0
    for (const ch of String(h.id)) seed = (seed * 31 + ch.charCodeAt(0)) % 9973
    const angle = (seed % 360) * (Math.PI / 180)
    const radius = 0.05 + (seed % 50) / 1000 

    return [FALLBACK[0] + Math.sin(angle) * radius, FALLBACK[1] + Math.cos(angle) * radius]
}

const isSelected = (id: string | number, selectedId: string | number | null) =>
    selectedId !== null && selectedId !== undefined && String(id) === String(selectedId)

const POPUP = [
    'hotel-popup !mb-0',
    '[&_.leaflet-popup-content]:m-1',
    '[&_.leaflet-popup-tip-container]:hidden',
    '[&_.leaflet-popup-content-wrapper]:relative',
    '[&_.leaflet-popup-content-wrapper]:p-0',
    '[&_.leaflet-popup-content-wrapper]:rounded-xl',
    '[&_.leaflet-popup-content-wrapper]:bg-[#F5F5F5]',
    '[&_.leaflet-popup-content-wrapper]:shadow-[0_2px_12px_rgba(0,0,0,.14)]',
    '[&_.leaflet-popup-content-wrapper]:after:content-[""]',
    '[&_.leaflet-popup-content-wrapper]:after:absolute',
    '[&_.leaflet-popup-content-wrapper]:after:top-[calc(100%-1px)]',
    '[&_.leaflet-popup-content-wrapper]:after:left-1/2',
    '[&_.leaflet-popup-content-wrapper]:after:-ml-[5px]',
    '[&_.leaflet-popup-content-wrapper]:after:border-solid',
    '[&_.leaflet-popup-content-wrapper]:after:border-transparent',
    '[&_.leaflet-popup-content-wrapper]:after:border-x-[13px]',
    '[&_.leaflet-popup-content-wrapper]:after:border-t-[12px]',
    '[&_.leaflet-popup-content-wrapper]:after:border-b-0',
    '[&_.leaflet-popup-content-wrapper]:after:border-t-[#F5F5F5]',
].join(' ')

const pin = (price: number) => `
<div class="absolute flex h-[30px] w-[30px] items-center justify-center box-border rounded-full border border-[#B7E4D3] bg-[#F5F5F5] text-[8px] font-bold leading-none text-[#0887CA] shadow-[0_1px_4px_rgba(0,0,0,.12)] ${FONT} [transform:translate(-50%,calc(-100%_-_4px))]">
    ${Math.round((Number(price) || 0) / 1000).toLocaleString('fa-IR', { useGrouping: false })}
    <i class="absolute -bottom-[3px] left-1/2 box-border h-[7px] w-[7px] -translate-x-1/2 rotate-45 border-0 border-b border-r border-solid border-[#B7E4D3] bg-[#F5F5F5]"></i>
</div>`

const dot = `
<div class="absolute h-2 w-2 translate-x-[12px] translate-y-[0px] rounded-full bg-[#F5002D] shadow-[0_0_0_3px_rgba(245,0,45,.35),0_0_0_6px_rgba(245,0,45,.16)]"></div>`

const icon = (price: number, active: boolean) =>
    L.divIcon({
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -POPUP_OFFSET],
        html: active ? dot : pin(price),
    })

type Markers = MutableRefObject<Record<string, LeafletMarker | null>>

function Controller({
    hotels,
    selectedId,
    markers,
}: {
    hotels: Hotel[]
    selectedId: string | number | null
    markers: Markers
}) {
    const map = useMap()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const check = () => {
            map.invalidateSize()
            const size = map.getSize()
            setReady(size.x > 0 && size.y > 0)
        }

        check()
        const observer = new ResizeObserver(check)
        observer.observe(map.getContainer())
        return () => observer.disconnect()
    }, [map])

    useEffect(() => {
        if (!ready) return

        const hotel = hotels.find((h) => isSelected(h.id, selectedId))

        if (hotel) {
            map.flyTo(coords(hotel), Math.max(map.getZoom(), 15), { duration: 0.8 })
            markers.current[hotel.id]?.openPopup()
        } else if (hotels.length) {
            map.closePopup()
            const bounds = L.latLngBounds(hotels.map(coords))
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14 })
            }
        }
    }, [hotels, selectedId, map, markers, ready])

    return null
}

type Props = {
    hotels: Hotel[]
    selectedId: string | number | null
    onSelect: (id:any) => void
}

export default function HotelsMap({ hotels, selectedId, onSelect }: Props) {
    const markers: Markers = useRef({})

    return (
        <MapContainer
            center={FALLBACK}
            zoom={6}
            scrollWheelZoom
            zoomControl={false}
            className='absolute inset-0 h-full w-full'
            style={{ fontFamily: 'IRANSans' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {hotels.map((h) => {
                const active = isSelected(h.id, selectedId)

                return (
                    <Marker
                        key={h.id}
                        position={coords(h)}
                        icon={icon(h.price, active)}
                        zIndexOffset={active ? 1000 : 0}
                        ref={(m) => {
                            markers.current[h.id] = m
                        }}
                        eventHandlers={{ click: () => onSelect(h.id) }}
                    >
                        <Popup className={POPUP} autoPan={false} closeButton={false} minWidth={200} maxWidth={300}>
                            {/* عرض ثابت و ریسپانسیو: روی موبایل هیچ‌وقت از صفحه بیرون نمی‌زنه */}
                            <div dir='rtl' className='flex w-[min(272px,calc(100vw-96px))] gap-2'>
                                {h.photos?.[0] ? (
                                    <img
                                        src={h.photos[0]}
                                        alt={h.title}
                                        className='h-[90px] w-[84px] shrink-0 rounded-lg object-cover min-[400px]:w-[110px]'
                                    />
                                ) : (
                                    <div className='h-[90px] w-[84px] shrink-0 rounded-lg bg-gray-200 min-[400px]:w-[110px]' />
                                )}

                                <div className='flex h-[90px] min-w-0 flex-1 flex-col justify-between overflow-hidden py-[2px]'>
                                    <h3 className='truncate text-sm font-bold leading-[22px] text-[#060425] min-[400px]:text-base'>
                                        {h.title}
                                    </h3>

                                    <div className='flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-0.5'>
                                        {/* {h.discounted_price > 0 && (
                                            <span className='text-[12px] leading-none text-gray-400 line-through decoration-red-500'>
                                                {money(h.discounted_price)}تومان
                                            </span>
                                        )} */}
                                        <span className='whitespace-nowrap text-[11px] leading-none text-gray-400 line-through decoration-red-500 min-[400px]:text-[12px]'>
                                            {money(200000)}تومان
                                        </span>
                                        <span className='whitespace-nowrap text-[12px] font-bold leading-none text-[#0887CA] min-[400px]:text-[13px]'>
                                            {money(h.price)} تومان
                                        </span>
                                    </div>

                                    <Link
                                        href={`/hotels/${h.id}`}
                                        className='flex h-6 items-center justify-center rounded-[8px] border border-[#0887CA] text-xs leading-none !text-[#0887CA] transition hover:bg-[#0887CA]/10'
                                    >
                                        جزییات رزرو
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}

            <Controller hotels={hotels} selectedId={selectedId} markers={markers} />
        </MapContainer>
    )
}