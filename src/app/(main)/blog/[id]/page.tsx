import { Suspense } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import BlogDetail from '@/components/blog/detail/BlogDetail'
import { BlogDetailSkeleton } from '@/components/blog/BlogSkeletons'
import { categoryLabel, getBlogById, getCategoryById, getRelatedBlogs } from '@/lib/Api/blog'

interface IParams {
    params: Promise<{
        id: string
    }>
}

async function BlogContent({ params }: IParams) {
    await connection()

    const { id } = await params

    const blog = await getBlogById(id).catch((error) => {
        const status = error?.response?.status
        if (status === 400 || status === 404) notFound()
        throw error
    })

    const [category, related] = await Promise.all([
        getCategoryById(blog.category_id),
        getRelatedBlogs(blog),
    ])

    return <BlogDetail blog={blog} categoryName={categoryLabel(category?.name)} related={related} />
}

export default function BlogDetailPage({ params }: IParams) {
    return (
        <Suspense fallback={<BlogDetailSkeleton />}>
            <BlogContent params={params} />
        </Suspense>
    )
}
