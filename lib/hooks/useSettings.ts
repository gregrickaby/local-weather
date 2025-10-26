import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation,
  setTempUnit
} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {useMantineColorScheme} from '@mantine/core'

/**
 * Hook to manage settings functionality.
 *
 * Handles color scheme toggling, temperature unit changes,
 * and favorites management.
 */
export function useSettings() {
  const {
    colorScheme: mantineColorScheme,
    setColorScheme: setMantineColorScheme
  } = useMantineColorScheme()
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.preferences.favorites)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const toggleColorScheme = () => {
    const newScheme = mantineColorScheme === 'dark' ? 'light' : 'dark'
    setMantineColorScheme(newScheme)
    dispatch(setColorScheme(newScheme))
  }

  const handleTempUnitChange = (value: string) => {
    dispatch(setTempUnit(value as 'c' | 'f'))
  }

  const handleClearFavorites = () => {
    dispatch(clearFavorites())
  }

  const handleRemoveFavorite = (locationId: number) => {
    dispatch(removeFromFavorites(locationId))
  }

  const handleSelectFavorite = (favorite: Location) => {
    dispatch(setLocation(favorite))
  }

  return {
    favorites,
    tempUnit,
    mantineColorScheme,
    toggleColorScheme,
    handleTempUnitChange,
    handleClearFavorites,
    handleRemoveFavorite,
    handleSelectFavorite
  }
}
