import Image from 'next/future/image'

/**
 * Icon component.
 */
export default function Icon({icon}: {icon: string}) {
  return <Image alt="" src={`/icons/${icon}.svg`} height="150" width="150" />
}
