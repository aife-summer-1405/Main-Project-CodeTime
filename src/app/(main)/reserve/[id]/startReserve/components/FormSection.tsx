import type { ReactNode } from 'react'

const FormSection = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className='flex flex-col gap-4'>
        <h3 className='text-sm font-bold text-[#060425] dark:text-white-1'>{title}</h3>
        {children}
    </section>
)

export default FormSection