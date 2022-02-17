import {Center, SimpleGrid, Text} from '@mantine/core'
import Image from 'next/image'
import {useWeatherContext} from './WeatherProvider'

/**
 * Render the CurrentConditions component.
 *
 * @author Greg Rickaby
 * @return {Element} The CurrentConditions component.
 */
export default function CurrentConditions() {
  const {
    weather: {
      current: {
        weather: [{main, icon}],
        temp,
        dt
      },
      timezone
    }
  } = useWeatherContext()

  return (
    <SimpleGrid cols={2} style={{maxWidth: '400px'}}>
      <div>
        <Text size="xl">
          <strong>{main}</strong> as of{' '}
          {new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric'
          }).format(dt * 1000)}
        </Text>

        <Text
          component="span"
          align="center"
          variant="gradient"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          weight={700}
          style={{
            fontFamily: 'Greycliff CF, sans-serif',
            fontSize: '9rem',
            margin: 0,
            lineHeight: 1
          }}
        >
          {Math.round(temp)}°
        </Text>
      </div>
      <Center>
        <Image
          alt={main}
          height={100}
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          width={100}
        />
      </Center>
    </SimpleGrid>
  )
}
