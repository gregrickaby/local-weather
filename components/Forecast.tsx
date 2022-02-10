import {Card, SimpleGrid, Text} from '@mantine/core'
import Image from 'next/image'
import {ForecastProps, ForecastsProps} from '~/types'

/**
 * Render the Forecast component
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component properties.
 * @param  {object}  props.forecast The weather forecast data.
 * @return {Element}                The Forecast component.
 */
export default function Forecast({forecast}: ForecastProps) {
  return (
    <section>
      <h2>Forecast</h2>
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
