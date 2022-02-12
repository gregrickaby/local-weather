import {Autocomplete} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {SewingPinFilledIcon} from '@modulz/radix-icons'
import {useState} from 'react'
import usePlaces from '~/lib/usePlaces'
import {useWeatherContext} from './WeatherProvider'

/**
 * Render the Search component.
 *
 * @author Greg Rickaby
 * @return {Element} The Search component.
 */
export default function Search() {
  const search = useWeatherContext()
  const [value, setValue] = useState('Bay Lake, FL')
  const [debounced] = useDebouncedValue(value, 200, {leading: true})
  const {cities} = usePlaces(false, debounced)

  const locations =
    !!cities && cities.length > 0
      ? cities
      : [
          'New York, NY',
          'Los Angeles, CA',
          'Chicago, IL',
          'Houston, TX',
          'Phoenix, AZ',
          'Philadelphia, PA',
          'San Antonio, TX',
          'San Diego, CA',
          'Dallas, TX',
          'San Jose, CA'
        ]

  return (
    <Autocomplete
      aria-label="Enter the name of your city"
      data={locations}
      icon={<SewingPinFilledIcon />}
      limit={10}
      onChange={setValue}
      onItemSubmit={() => {
        search.setSearch(value)
      }}
      placeholder="Enter the name of your city"
      size="lg"
      transition="pop-top-left"
      transitionDuration={100}
      transitionTimingFunction="ease"
      value={value}
    />
  )
}
