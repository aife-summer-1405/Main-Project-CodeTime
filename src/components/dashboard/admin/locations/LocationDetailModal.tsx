'use client'

import { toFaDigits } from '@/lib/format'
import type { AdminLocation } from '@/lib/Api/dashboard/admin/locations'
import Modal from '../../components/Modal'
import MapPicker from '../../common/MapPicker'

type Props = { location: AdminLocation | null; onClose: () => void }

const cell = 'flex min-w-0 flex-col gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'

export default function LocationDetailModal({ location, onClose }: Props) {
    return (
        <Modal open={!!location} onClose={onClose} title='جزئیات مکان' className='max-w-xl'>
            {location && (
                <div className='flex flex-col gap-4'>
                    <div className='grid gap-3 sm:grid-cols-3'>
                        <div className={cell}>
                            <span className='text-[10px] text-[#8A8997]'>نام منطقه</span>
                            <span className='truncate text-xs font-bold text-[#060425] dark:text-white'>{location.areaName || '—'}</span>
                        </div>
                        <div className={cell}>
                            <span className='text-[10px] text-[#8A8997]'>عرض جغرافیایی</span>
                            <span dir='ltr' className='truncate text-right text-xs font-bold text-[#060425] dark:text-white'>
                                {toFaDigits(location.lat)}
                            </span>
                        </div>
                        <div className={cell}>
                            <span className='text-[10px] text-[#8A8997]'>طول جغرافیایی</span>
                            <span dir='ltr' className='truncate text-right text-xs font-bold text-[#060425] dark:text-white'>
                                {toFaDigits(location.lng)}
                            </span>
                        </div>
                    </div>

                    <MapPicker key={location.id} value={[location.lat, location.lng]} className='h-80' />
                </div>
            )}
        </Modal>
    )
}
