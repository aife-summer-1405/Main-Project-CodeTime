import { Suspense } from 'react'
import type { Metadata } from 'next'
import BlogListPage from '@/components/blog/BlogListPage'
import { BlogListSkeleton } from '@/components/blog/BlogSkeletons'

export const metadata: Metadata = { title: 'وبلاگ' }

export default function Page() {
    return (
        <Suspense fallback={<BlogListSkeleton />}>
            <BlogListPage />
        </Suspense>
    )
}
