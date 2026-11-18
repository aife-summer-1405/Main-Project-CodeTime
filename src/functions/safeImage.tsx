'use client'

import { useEffect, useState, type ImgHTMLAttributes } from 'react'

type IProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    src?: string | null
}

const SafeImage = ({ src, alt = '', className = '', onError, ...rest }: IProps) => {
    const [failed, setFailed] = useState(false)

    useEffect(() => setFailed(false), [src])

    if (!src || failed) {
        return <div className={`${className} bg-linear-30 from-lime-400 to-green-2`} />
    }

    return (
        <img
            {...rest}
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                setFailed(true)
                onError?.(e)
            }}
        />
    )
}

export default SafeImage