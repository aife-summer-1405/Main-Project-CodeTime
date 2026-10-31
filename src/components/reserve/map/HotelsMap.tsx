'use client'
import { useEffect, useRef, type MutableRefObject } from 'react'
import Link from 'next/link'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { type Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fa } from '@/lib/format'
import { Hotel } from '@/lib/Api/house'

const money = (n: number) => fa(n).replace(/٬/g, ',')
const POPUP_OFFSET = 17
const FONT = 'font-[family-name:IRANSansX,IRANSans,Vazirmatn,Tahoma,sans-serif]'

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
    ${Math.round(price / 1000).toLocaleString('fa-IR', { useGrouping: false })}
    <i class="absolute -bottom-[3px] left-1/2 box-border h-[7px] w-[7px] -translate-x-1/2 rotate-45 border-0 border-b border-r border-solid border-[#B7E4D3] bg-[#F5F5F5]"></i>
</div>`

const dot = `
<div class="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5002D] shadow-[0_0_0_3px_rgba(245,0,45,.35),0_0_0_6px_rgba(245,0,45,.16)]"></div>`

const icon = (price: number, active: boolean) =>
    L.divIcon({
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -POPUP_OFFSET],
        html: active ? dot : pin(price),
    })

type Markers = MutableRefObject<Record<string, LeafletMarker | null>>

function Controller({ hotels, selectedId, markers }: { hotels: Hotel[]; selectedId: string | null; markers: Markers }) {
    const map = useMap()

    useEffect(() => {
        const observer = new ResizeObserver(() => map.invalidateSize())
        observer.observe(map.getContainer())
        return () => observer.disconnect()
    }, [map])

    useEffect(() => {
        const hotel = hotels.find((h) => h.id === selectedId)

        if (hotel) {
            map.flyTo([hotel.location?.lat, hotel.location?.lng], Math.max(map.getZoom(), 15), { duration: 0.8 })
            markers.current[hotel.id]?.openPopup()
        } else if (hotels.length) {
            map.closePopup()
            map.fitBounds(L.latLngBounds(hotels.map((h) => [h.location?.lat, h.location?.lng] as [number, number])), {
                padding: [56, 56],
                maxZoom: 14,
            })
        }
    }, [hotels, selectedId, map, markers])

    return null
}

type Props = {
    hotels: Hotel[]
    selectedId: string | null
    onSelect: (id: string) => void
}

export default function HotelsMap({ hotels, selectedId, onSelect }: Props) {
    const markers: Markers = useRef({})

    return (
        <MapContainer
            center={[32.4279, 53.688]}
            zoom={6}
            scrollWheelZoom
            zoomControl={false}
            className={`absolute inset-0 h-full w-full `}
            style={{ fontFamily: 'IRANSans' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {hotels.map((h) => (
                <Marker
                    key={h.id}
                    position={[h.location?.lat, h.location?.lng]}
                    icon={icon(h.price, h.id === selectedId)}
                    zIndexOffset={h.id === selectedId ? 1000 : 0}
                    ref={(m) => {
                        markers.current[h.id] = m
                    }}
                    eventHandlers={{ click: () => onSelect(h.id) }}
                >
                    <Popup className={POPUP} autoPan={false} closeButton={false} minWidth={200} maxWidth={275}>
                        <div dir='rtl' className='flex gap-2'>
                            <img src={h.photos[0]} alt={h.title} className='h-[90px] w-[110px] shrink-0 rounded-lg object-cover' />

                            <div className='flex h-[90px] min-w-0 flex-1 flex-col justify-between py-[2px]'>
                                <h3 className='truncate text-base font-bold leading-[22px] text-[#060425]'>{h.title}</h3>

                                <div className='flex items-center justify-between gap-2 whitespace-nowrap'>
                                    {/* {h.discounted_price > 0 && (
                                        <span className='text-[12px] leading-none text-gray-400 line-through decoration-red-500'>
                                            {money(h.discounted_price)}تومان
                                        </span>
                                    )} */}
                                    <span className='text-[12px] leading-none text-gray-400 line-through decoration-red-500'>
                                            {money(200000)}تومان
                                        </span>
                                    <span className='text-[13px] font-bold leading-none text-[#0887CA]'>{money(h.price)} تومان</span>
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
            ))}

            <Controller hotels={hotels} selectedId={selectedId} markers={markers} />
        </MapContainer>
    )
}