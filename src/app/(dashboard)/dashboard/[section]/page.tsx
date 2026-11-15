import { notFound } from 'next/navigation'
import { currentRole, menus } from '@/lib/dashboard/config'

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params
    const item = menus[currentRole].find(({ href }) => href === `/dashboard/${section}`)

    if (!item) notFound()

    return <h1 className='text-base font-bold text-[#0087CA]'>{item.label}</h1>
}
