export default function Bone({ className = '' }: { className?: string }) {
    return <div aria-hidden='true' className={`animate-pulse rounded-lg bg-[#E9EEF1] dark:bg-[#242424] ${className}`} />
}
