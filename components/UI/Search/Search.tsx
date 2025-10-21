'use client'

import {useWeatherContext} from '@/components/Context/WeatherProvider/WeatherProvider'
import Settings from '@/components/UI/Settings/Settings'
import {usePlaces} from '@/lib/hooks'
import {Autocomplete} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {IconMapPin} from '@tabler/icons-react'
import {useState} from 'react'
import classes from './Search.module.css'

/**
 * Search component.
 */
export default function Search() {
  const {location, setLocation} = useWeatherContext()
  const [searchTerm, setSearchTerm] = useState(location)
  const [debounced] = useDebouncedValue(searchTerm, 400)
  const {locations} = usePlaces(debounced)

  const places =
    !!locations && locations.length > 0
      ? locations
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
    <>
      <Autocomplete
        aria-label="Enter the name of your location"
        className={classes.searchbar}
        data={places}
        leftSection={<IconMapPin />}
        limit={10}
        onChange={setSearchTerm}
        onOptionSubmit={(item) => setLocation(item)}
        placeholder="Enter the name of your location"
        size="lg"
        value={searchTerm}
      />
      <Settings />
    </>
  )
}
