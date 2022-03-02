import {Center, Title} from '@mantine/core'
import Image from 'next/image'

export default function Radar({image}: {image: string}) {
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
