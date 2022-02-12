import {Autocomplete} from '@mantine/core'
import {SewingPinFilledIcon} from '@modulz/radix-icons'
import {useState} from 'react'
import usePlaces from '~/lib/usePlaces'
import {useSearchContext} from './SearchProvider'

/**
 * Render the SearchBar component.
 *
 * @author Greg Rickaby
 * @return {Element} The SearchBar component.
 */
export default function SearchBar() {
  const search = useSearchContext()
  const [value, setValue] = useState('Bay Lake, FL')
  const {cities} = usePlaces(false, value)

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
      aria-label="Search for your location"
      data={locations}
      icon={<SewingPinFilledIcon />}
      label="Search"
      onChange={setValue}
      onItemSubmit={() => {
        search.setSearch(value)
      }}
      limit={10}
      placeholder="Search for a city"
      transition="pop-top-left"
      transitionDuration={80}
      transitionTimingFunction="ease"
      value={value}
    />
  )
}
