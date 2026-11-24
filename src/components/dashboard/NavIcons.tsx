import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function DashboardIcon({ width = 21, height = 21, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M2.75 12.3713H5.75C6.85457 12.3713 7.75 13.2668 7.75 14.3713V17.3713C7.75 18.4759 6.85457 19.3713 5.75 19.3713H2.75C1.64543 19.3713 0.75 18.4759 0.75 17.3713V14.3713C0.75 13.2668 1.64543 12.3713 2.75 12.3713ZM2.75 1.37132H5.75C6.85457 1.37132 7.75 2.26675 7.75 3.37132V6.37132C7.75 7.47589 6.85457 8.37132 5.75 8.37132H2.75C1.64543 8.37132 0.75 7.47589 0.75 6.37132V3.37132C0.75 2.26675 1.64543 1.37132 2.75 1.37132ZM16.6642 1.33579L18.7855 3.45711C19.5666 4.23816 19.5666 5.50449 18.7855 6.28553L16.6642 8.40685C15.8832 9.1879 14.6168 9.1879 13.8358 8.40685L11.7145 6.28553C10.9334 5.50449 10.9334 4.23816 11.7145 3.45711L13.8358 1.33579C14.6168 0.554738 15.8832 0.554738 16.6642 1.33579ZM13.75 12.3713H16.75C17.8546 12.3713 18.75 13.2668 18.75 14.3713V17.3713C18.75 18.4759 17.8546 19.3713 16.75 19.3713H13.75C12.6454 19.3713 11.75 18.4759 11.75 17.3713V14.3713C11.75 13.2668 12.6454 12.3713 13.75 12.3713Z" strokeWidth="1.5" stroke="currentColor" />
        </svg>
    )
}

export function UserIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M15.1631 5.4574C17.574 5.4574 19.5285 7.41615 19.5285 9.8324C19.5285 12.2486 17.574 14.2074 15.1631 14.2074C19.0206 14.2074 22.1477 16.5579 22.1477 19.4574" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
            <path d="M8.85254 14C11.2688 14 13.2275 11.7614 13.2275 9C13.2275 6.23858 11.2688 4 8.85254 4C6.43629 4 4.47754 6.23858 4.47754 9C4.47754 11.7614 6.43629 14 8.85254 14ZM8.85254 14C4.98655 14 1.85254 16.6863 1.85254 20M8.85254 14C12.7185 14 15.8525 16.6863 15.8525 20" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
        </svg>
    )
}

export function ReservationsIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M8 14H10M8 10H14M8 6H14M18 11.5V5.22C18 4.08102 18 3.51153 17.7748 3.07805C17.5851 2.71276 17.2872 2.41492 16.9219 2.22517C16.4885 2 15.919 2 14.78 2H7.22C6.08102 2 5.51153 2 5.07805 2.22517C4.71276 2.41492 4.41492 2.71276 4.22517 3.07805C4 3.51153 4 4.08102 4 5.22V16.78C4 17.919 4 18.4885 4.22517 18.9219C4.41492 19.2872 4.71276 19.5851 5.07805 19.7748C5.51153 20 6.08102 20 7.22 20H10M20 16L16.3536 19.6464C16.1583 19.8417 15.8417 19.8417 15.6464 19.6464L14 18" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
        </svg>
    )
}

export function HeartIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M11.9932 5.15567C9.9938 2.79653 6.65975 2.16192 4.15469 4.32219C1.64964 6.48246 1.29697 10.0943 3.2642 12.6493C4.89982 14.7736 9.84977 19.2538 11.4721 20.7039C11.6536 20.8661 11.7444 20.9473 11.8502 20.9791C11.9426 21.007 12.0437 21.007 12.1361 20.9791C12.2419 20.9473 12.3327 20.8661 12.5142 20.7039C14.1365 19.2538 19.0865 14.7736 20.7221 12.6493C22.6893 10.0943 22.3797 6.45974 19.8316 4.32219C17.2835 2.18465 13.9925 2.79653 11.9932 5.15567Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}

export function CommentsIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <g opacity="0.75">
                <path d="M8 10H16M8 14H12M21 12C21 16.9706 16.9706 21 12 21H3.72413C3.3743 21 3.13262 20.65 3.25656 20.3228L4.15021 17.9642C4.37943 17.3593 4.28826 16.6875 3.99225 16.1122C3.35801 14.8796 3 13.4816 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
            </g>
        </svg>
    )
}

export function WalletIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M20 10H16.5C16.2239 10 16 10.2239 16 10.5V14.5C16 14.7761 16.2239 15 16.5 15H20M20 10H21.5C21.7761 10 22 10.2239 22 10.5V14.5C22 14.7761 21.7761 15 21.5 15H20M20 10V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H5.2C4.0799 4 3.51984 4 3.09202 4.21799C2.71569 4.40973 2.40973 4.71569 2.21799 5.09202C2 5.51984 2 6.0799 2 7.2V16.8C2 17.9201 2 18.4802 2.21799 18.908C2.40973 19.2843 2.71569 19.5903 3.09202 19.782C3.51984 20 4.0799 20 5.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V15" strokeWidth="1.5" stroke="currentColor" />
        </svg>
    )
}

export function PropertiesIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M9.43414 5.80951L10.4779 6.85208C11.3482 7.72144 11.3482 9.13094 10.4779 10.0003L10.0081 10.4695C9.13778 11.3389 7.7267 11.3389 6.85637 10.4695L5.81265 9.42697C4.76237 8.37787 3 8.75126 3 10.2349C3 12.2328 3.8107 14.0415 5.12142 15.3508C6.43214 16.66 8.24289 17.4698 10.243 17.4698C10.5918 17.4698 10.9348 17.4452 11.2705 17.3976C12.117 17.2775 13.0113 17.4525 13.6159 18.0564L15.9101 20.348C16.7804 21.2173 18.1915 21.2173 19.0618 20.348L20.3473 19.064C21.2254 18.1868 21.2164 16.762 20.3272 15.896L18.0826 13.71C17.4554 13.0991 17.276 12.181 17.4057 11.3157C17.4586 10.9631 17.486 10.6022 17.486 10.2349C17.486 8.23705 16.6753 6.42832 15.3646 5.11906C14.0538 3.8098 12.2431 3 10.243 3C8.75768 3 8.38387 4.76041 9.43414 5.80951Z" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
        </svg>
    )
}

export function BellIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M14.8852 21C12.881 22.3333 10.2519 22.3333 8.24773 21M17.5676 2C18.9401 3.03124 20.0387 4.4075 20.7345 6M4.56658 10C4.56658 6.13401 7.70059 3 11.5666 3C15.4326 3 18.5666 6.13401 18.5666 10V12.5778C18.5666 14.1572 19.0341 15.7013 19.9102 17.0154L20.0483 17.2226C20.2699 17.5549 20.0317 18 19.6323 18H3.50084C3.10149 18 2.8633 17.5549 3.08482 17.2227L3.22298 17.0154C4.09908 15.7013 4.56658 14.1572 4.56658 12.5778V10Z" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
        </svg>
    )
}

export function UsersIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M16 20V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V20M22 20V19C22 17.3 20.9 15.9 19.4 15.3M16 4.3C17.5 4.9 18.5 6.3 18.5 8C18.5 9.7 17.5 11.1 16 11.7M9 11C10.9 11 12.5 9.4 12.5 7.5C12.5 5.6 10.9 4 9 4C7.1 4 5.5 5.6 5.5 7.5C5.5 9.4 7.1 11 9 11Z" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
        </svg>
    )
}

export function ContactIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17V7C3 6.44772 3.44772 6 4 6ZM3.5 7L12 13L20.5 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}

export function LocationIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M12 21C12 21 19 15.4 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.4 12 21 12 21ZM12 12.5C13.3807 12.5 14.5 11.3807 14.5 10C14.5 8.61929 13.3807 7.5 12 7.5C10.6193 7.5 9.5 8.61929 9.5 10C9.5 11.3807 10.6193 12.5 12 12.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}

export function CategoryIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}

export function BlogIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8L14 3ZM14 3V8H19M9 13H15M9 17H13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}
export function DiscountIcon({ width = 24, height = 24, ...props }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
            <path d="M20.59 13.41L13.42 20.58C13.05 20.95 12.55 21.16 12.02 21.16C11.5 21.16 10.99 20.95 10.62 20.58L3 13V3H13L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41ZM7.5 7.5H7.51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
        </svg>
    )
}