import { LogOut } from 'lucide-react'
import Modal from './Modal';

type Props = { open: boolean; onClose: () => void; onConfirm: () => void }

export default function LogoutModal({ open, onClose, onConfirm }: Props) {
    return (
        <Modal open={open} onClose={onClose} className='max-w-sm'>
            <div className='flex flex-col items-center gap-3 py-2 text-center'>
                <LogOut size={36} className='text-[#0087CA]' />
                <h3 className='text-sm font-bold text-[#0087CA]'>خروج از حساب</h3>
                <p className='text-xs font-bold text-[#0069A6] dark:text-[#38A9E0]'>مطمئنی میخوای از حساب خارج شی؟؟</p>

                <div className='mt-3 flex w-full gap-3'>
                    <button
                        type='button'
                        onClick={onConfirm}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#10088F] text-sm text-white transition-all duration-300 hover:opacity-90 active:scale-[0.9] dark:bg-[#0087CA]'
                    >
                        بله
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#BDBDBD] text-sm text-[#55536D] transition-all duration-300 active:scale-[0.9] dark:border-[#2A2A2A] dark:text-[#A1A1AA]'
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </Modal>
    )
}