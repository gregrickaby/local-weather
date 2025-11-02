import Image from 'next/image'
import {memo} from 'react'

interface IconProps {
  icon: string
  alt?: string
}

/**
 * Icon component with accessibility support.
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 * @param icon - The icon name (without extension)
 * @param alt - Alt text for accessibility. If empty string, image is decorative.
 */
function Icon({icon, alt}: Readonly<IconProps>) {
  return (
    <Image
      alt={alt ?? `weather icon: ${icon}`}
      src={`/icons/${icon}.svg`}
      height="150"
      width="150"
    />
  )
}

export default memo(Icon)
