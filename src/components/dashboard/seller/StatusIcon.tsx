const icons = {
    success: { src: '/images/success.png', alt: 'تایید شده' },
    pending: { src: '/images/Frame 24.png', alt: 'در انتظار' },
    cancel: { src: '/images/Frame 25.png', alt: 'ناموفق' },
}

export type StatusKind = keyof typeof icons

export default function StatusIcon({ kind }: { kind: StatusKind }) {
    const { src, alt } = icons[kind]
    return <img src={src} alt={alt} title={alt} className='h-5 w-5 object-contain' />
}
