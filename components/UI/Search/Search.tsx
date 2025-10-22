'use client'

import Settings from '@/components/UI/Settings/Settings'
import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {useGetPlacesQuery} from '@/lib/store/services/placesApi'
import {setLocation} from '@/lib/store/slices/preferencesSlice'
import {Autocomplete} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {IconHeart, IconMapPin} from '@tabler/icons-react'
import {useEffect, useState} from 'react'
import classes from './Search.module.css'

const DEFAULT_PLACES = [
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

/**
 * Search component.
 */
export default function Search() {
  const dispatch = useAppDispatch()
  const location = useAppSelector((state) => state.preferences.location)
  const searchHistory = useAppSelector(
    (state) => state.preferences.searchHistory
  )
  const [searchTerm, setSearchTerm] = useState(location)
  const [dropdownOpened, setDropdownOpened] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [debounced] = useDebouncedValue(searchTerm, 400)

  const {data: locations} = useGetPlacesQuery(debounced, {
    skip: !debounced || !isTyping
  })

  // Open dropdown when user starts typing
  useEffect(() => {
    if (isTyping) {
      setDropdownOpened(true)
    }
  }, [isTyping])

  // Priority: API results > Search history (only if typing) > Default places
  let places: string[] = DEFAULT_PLACES
  if (!!locations && locations.length > 0) {
    places = locations
  } else if (debounced && searchHistory.length > 0 && isTyping) {
    // Only show search history if user is actively searching
    places = searchHistory
  }

  const handleChange = (value: string) => {
    setSearchTerm(value)
    setIsTyping(true)
  }

  return (
    <>
      <Autocomplete
        aria-label="Enter the name of your location"
        className={classes.searchbar}
        data={places}
        dropdownOpened={dropdownOpened}
        leftSection={<IconMapPin />}
        limit={10}
        onChange={handleChange}
        onDropdownClose={() => {
          setDropdownOpened(false)
          setIsTyping(false)
        }}
        onOptionSubmit={(item) => {
          dispatch(setLocation(item))
          setDropdownOpened(false)
          setIsTyping(false)
        }}
        placeholder="Enter the name of your location"
        renderOption={({option}) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <span>{option.value}</span>
            {searchHistory.includes(option.value) && (
              <IconHeart
                size={16}
                style={{color: '#ff6b6b', marginLeft: '8px'}}
                fill="#ff6b6b"
              />
            )}
          </div>
        )}
        size="lg"
        value={searchTerm}
      />
      <Settings />
    </>
  )
}
