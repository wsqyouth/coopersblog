'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarImageProps {
  src: string
  alt: string
  className?: string
}

export default function AvatarImage({ src, alt, className }: AvatarImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={`w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center ${className || ''}`}>
        <span className="text-4xl">👨‍💻</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`rounded-full object-cover ${className || ''}`}
      onError={() => setImageError(true)}
    />
  )
}