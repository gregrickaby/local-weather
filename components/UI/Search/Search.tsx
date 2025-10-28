'use client'

import {useLocationSearch} from '@/lib/hooks/useLocationSearch'
import {ActionIcon, Autocomplete, CloseButton} from '@mantine/core'
import {IconHeart} from '@tabler/icons-react'
import {useCallback, useMemo} from 'react'
import classes from './Search.module.css'

/**
 * Search component.
 */
export default function Search() {
  const {
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
  } = useLocationSearch()

  // Convert places array to Map for O(1) lookups instead of O(n) find()
  const placesMap = useMemo(
    () => new Map(places.map((p) => [p.id.toString(), p])),
    [places]
  )

  // Memoize renderOption to prevent recreation on every render
  const renderOption = useCallback(
    (item: {option: {value: string}}) => {
      const {value} = item.option
      const loc = placesMap.get(value)
      const favorited = isFavorited(value)

      // Safety check: if location not found, just show the option value
      if (!loc) {
        return <span>{value}</span>
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
              favorited ? 'Remove from favorites' : 'Add to favorites'
            }
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(loc)
            }}
          >
            <IconHeart
              size={16}
              fill={favorited ? '#ff6b6b' : 'none'}
              style={{color: favorited ? '#ff6b6b' : 'currentColor'}}
            />
          </ActionIcon>
        </div>
      )
    },
    [placesMap, isFavorited, toggleFavorite]
  )

  return (
    <Autocomplete
      aria-label="Enter the name of your location"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={classes.searchbar}
      data={comboboxData}
      dropdownOpened={dropdownOpened}
      rightSection={
        searchTerm ? (
          <CloseButton
            aria-label="Clear search"
            onClick={handleClear}
            size="sm"
          />
        ) : null
      }
      limit={10}
      onChange={handleChange}
      onDropdownClose={handleDropdownClose}
      onOptionSubmit={handleOptionSubmit}
      placeholder="New York, NY"
      renderOption={renderOption}
      size="lg"
      value={searchTerm}
    />
  )
}
