import Image from 'next/image'

interface IconProps {
  icon: string
  alt?: string
}

/**
 * Icon component with accessibility support.
 * @param icon - The icon name (without extension)
 * @param alt - Alt text for accessibility. If empty string, image is decorative.
 */
export default function Icon({icon, alt}: Readonly<IconProps>) {
  return (
    <Image
      alt={alt ?? `weather icon: ${icon}`}
      src={`/icons/${icon}.svg`}
      height="150"
      width="150"
    />
  )
}
