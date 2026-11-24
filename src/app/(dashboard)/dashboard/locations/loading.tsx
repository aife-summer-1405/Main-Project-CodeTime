import { ListPageSkeleton } from '@/components/skeletons/DashboardSkeletons'

export default function Loading() {
    return <ListPageSkeleton columns={4} search filters={1} />
}
