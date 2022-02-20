import Image from 'next/image'

/**
 * Render the Icon component
 *
 * @author Greg Rickaby
 * @param  {object}  props      The component attributes as props.
 * @param  {string}  props.icon icon code.
 * @return {Element}            The Icon component.
 */
export default function Icon({icon}) {
  return <Image alt="" src={`/icons/${icon}.svg`} height={150} width={150} />
}
