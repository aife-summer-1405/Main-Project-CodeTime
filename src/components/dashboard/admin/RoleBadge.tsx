import { roleLabels, type Role } from '@/lib/dashboard/config'

const styles: Record<Role, string> = {
    admin: 'bg-[#FDE8EC] text-[#ED053F] dark:bg-[#3A1620]',
    seller: 'bg-[#E8E7F8] text-[#10088F] dark:bg-[#1C1C3A] dark:text-[#8F8BFF]',
    buyer: 'bg-[#E6F1F6] text-[#0087CA] dark:bg-[#1C1C1C]',
}

export default function RoleBadge({ role }: { role: Role }) {
    return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] ${styles[role]}`}>{roleLabels[role]}</span>
}
