'use client'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const FALLBACK: [number, number] = [35.6892, 51.389]

type Props = { lat?: number; lng?: number; title: string }

export default function MortgageMap({ lat, lng, title }: Props) {
    const ok = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    const center: [number, number] = ok ? [Number(lat), Number(lng)] : FALLBACK

    return (
        <MapContainer center={center} zoom={ok ? 15 : 10} scrollWheelZoom={false} className='h-full w-full'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {ok && (
                <CircleMarker center={center} radius={9} pathOptions={{ color: '#0887CA', fillColor: '#0887CA', fillOpacity: 0.9, weight: 3 }}>
                    <Popup>{title}</Popup>
                </CircleMarker>
            )}
        </MapContainer>
    )
}
