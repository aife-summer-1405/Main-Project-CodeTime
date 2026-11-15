'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function DashboardTemplate({ children }: { children: ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className='min-w-0'>
            {children}
        </motion.div>
    )
}
