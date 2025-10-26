'use client'

import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {useGetPlacesQuery} from '@/lib/store/services/placesApi'
import {
  addToFavorites,
  removeFromFavorites,
  setLocation
} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {ActionIcon, Autocomplete, ComboboxItem} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {IconHeart, IconMapPin} from '@tabler/icons-react'
import {useEffect, useState} from 'react'
import classes from './Search.module.css'

// Default locations with coordinates
const DEFAULT_PLACES: Location[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.71427,
    longitude: -74.00597,
    admin1: 'New York',
    country: 'United States',
    display: 'New York, New York, United States'
  },
  {
    id: 5368361,
    name: 'Los Angeles',
    latitude: 34.05223,
    longitude: -118.24368,
    admin1: 'California',
    country: 'United States',
    display: 'Los Angeles, California, United States'
  },
  {
    id: 4887398,
    name: 'Chicago',
    latitude: 41.85003,
    longitude: -87.65005,
    admin1: 'Illinois',
    country: 'United States',
    display: 'Chicago, Illinois, United States'
  }
]

/**
 * Search component.
 */
export default function Search() {
  const dispatch = useAppDispatch()
  const location = useAppSelector((state) => state.preferences.location)
  const favorites = useAppSelector((state) => state.preferences.favorites)
  const [searchTerm, setSearchTerm] = useState(location.display)
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

  // Priority: API results > Favorites (only if typing) > Default places
  let places: Location[] = DEFAULT_PLACES
  if (!!locations && locations.length > 0) {
    places = locations
  } else if (debounced && favorites.length > 0 && isTyping) {
    // Only show favorites if user is actively searching
    places = favorites
  }

  // Convert locations to combobox items (display strings)
  const comboboxData: ComboboxItem[] = places
    .filter((loc) => loc?.id && loc?.display)
    .map((loc) => ({
      value: loc.id.toString(),
      label: loc.display
    }))

  const handleChange = (value: string) => {
    setSearchTerm(value)
    setIsTyping(true)
  }

  return (
    <Autocomplete
      aria-label="Enter the name of your location"
      className={classes.searchbar}
      data={comboboxData}
      dropdownOpened={dropdownOpened}
      leftSection={<IconMapPin />}
      limit={10}
      onChange={handleChange}
      onDropdownClose={() => {
        setDropdownOpened(false)
        setIsTyping(false)
      }}
      onOptionSubmit={(selectedValue) => {
        // Find the location object by ID
        const selectedLocation = places.find(
          (loc) => loc.id.toString() === selectedValue
        )
        if (selectedLocation) {
          dispatch(setLocation(selectedLocation))
          setSearchTerm(selectedLocation.display)
        }
        setDropdownOpened(false)
        setIsTyping(false)
      }}
      placeholder="Enter the name of your location"
      renderOption={({option}) => {
        const loc = places.find((l) => l?.id?.toString() === option.value)
        const isFavorited = favorites.some(
          (f) => f?.id?.toString() === option.value
        )

        // Safety check: if location not found, just show the option value
        if (!loc) {
          return <span>{option.value}</span>
        }

        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              gap: '8px'
            }}
          >
            <span style={{flex: 1}}>{loc.display}</span>
            <ActionIcon
              size="sm"
              variant="subtle"
              aria-label={
                isFavorited ? 'Remove from favorites' : 'Add to favorites'
              }
              onClick={(e) => {
                e.stopPropagation()
                if (isFavorited) {
                  dispatch(removeFromFavorites(loc.id))
                } else {
                  dispatch(addToFavorites(loc))
                }
              }}
            >
              <IconHeart
                size={16}
                fill={isFavorited ? '#ff6b6b' : 'none'}
                style={{color: isFavorited ? '#ff6b6b' : 'currentColor'}}
              />
            </ActionIcon>
          </div>
        )
      }}
      size="lg"
      value={searchTerm}
    />
  )
}
