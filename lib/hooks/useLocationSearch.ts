import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {useGetPlacesQuery} from '@/lib/store/services/placesApi'
import {
  addToFavorites,
  removeFromFavorites,
  setLocation
} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import type {ComboboxItem} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {useEffect, useState} from 'react'

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
 * Hook to manage location search functionality.
 *
 * Handles search input, API querying, dropdown state, and location selection.
 * Manages search results prioritization: API results > Favorites > Defaults.
 */
export function useLocationSearch() {
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

  const handleClear = () => {
    setSearchTerm('')
    setIsTyping(false)
    setDropdownOpened(false)
  }

  const handleDropdownClose = () => {
    setDropdownOpened(false)
    setIsTyping(false)
  }

  const handleOptionSubmit = (selectedValue: string) => {
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
  }

  const isFavorited = (locationId: string) => {
    return favorites.some((f) => f?.id?.toString() === locationId)
  }

  const toggleFavorite = (loc: Location) => {
    if (isFavorited(loc.id.toString())) {
      dispatch(removeFromFavorites(loc.id))
    } else {
      dispatch(addToFavorites(loc))
    }
  }

  return {
    searchTerm,
    dropdownOpened,
    comboboxData,
    places,
    handleChange,
    handleClear,
    handleDropdownClose,
    handleOptionSubmit,
    isFavorited,
    toggleFavorite
  }
}
