import { ListPageSkeleton } from '@/components/skeletons/DashboardSkeletons'

export default function Loading() {
    return <ListPageSkeleton columns={3} search filters={0} />
}
