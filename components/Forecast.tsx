import {Card, SimpleGrid, Text, Title} from '@mantine/core'
import Image from 'next/image'

interface ForecastProps {
  forecast: Object[]
  location: {
    city: string
    state: string
  }
}

interface ForecastsProps {
  name: string
  icon: string
  detailedForecast: string
}

/**
 * Render the Forecast component
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component attributes as props.
 * @param  {object}  props.forecast The weather forecast data.
 * @param  {object}  props.location The location: city and state.
 * @return {Element}                The Forecast component.
 */
export default function Forecast({forecast, location}: ForecastProps) {
  return (
    <section>
      <Title order={2} align="center" my="lg">
        Forecast for {location?.city}, {location?.state}
      </Title>
      <SimpleGrid
        breakpoints={[
          {maxWidth: 'xs', cols: 1},
          {maxWidth: 'sm', cols: 2},
          {maxWidth: 'md', cols: 3},
          {maxWidth: 'xl', cols: 4}
        ]}
      >
        {forecast?.map(
          ({name, icon, detailedForecast}: ForecastsProps, index: number) => (
            <Card shadow="sm" padding="xl" key={index}>
              <Image
                alt={name}
                height="86"
                loading="lazy"
                src={icon}
                width="86"
              />
              <Text weight={700}>{name}</Text>
              <Text>{detailedForecast}</Text>
            </Card>
          )
        )}
      </SimpleGrid>
    </section>
  )
}
