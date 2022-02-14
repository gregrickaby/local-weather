import {Center, Title} from '@mantine/core'
import Image from 'next/image'
import {RadarProps} from '~/types'

/**
 * Render the Radar component.
 *
 * @author Greg Rickaby
 * @param  {object}  props       The component attributes as props.
 * @param  {object}  props.image The radar image data.
 * @return {Element}             The Radar component.
 */
export default function Radar({image}: RadarProps) {
  return (
    <section>
      <Title order={2} align="center" my="lg">
        Radar
      </Title>
      <Center>
        <Image
          alt="Radar image loop"
          height={550}
          loading="lazy"
          src={`https://radar.weather.gov/ridge/lite/${image}_loop.gif`}
          width={600}
        />
      </Center>
    </section>
  )
}
