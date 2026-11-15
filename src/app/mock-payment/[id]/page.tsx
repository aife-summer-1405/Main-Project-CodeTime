import MockPayment from './MockPayment'

interface IProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ hotelId?: string; callback?: string }>
}

const safeCallback = (value?: string) =>
    value && value.startsWith('/') && !value.startsWith('//') ? value : '/'

const MockPaymentPage = async ({ params, searchParams }: IProps) => {
    const [{ id }, { hotelId, callback }] = await Promise.all([params, searchParams])
    if (!hotelId) return <main className='p-8 text-center'>شناسه هتل معتبر نیست.</main>

    return <MockPayment id={id} hotelId={hotelId} callback={safeCallback(callback)} />
}

export default MockPaymentPage
