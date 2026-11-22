import { ListPageSkeleton } from '@/components/skeletons/DashboardSkeletons'

export default function Loading() {
    return <ListPageSkeleton columns={5} filters={1} />
}
