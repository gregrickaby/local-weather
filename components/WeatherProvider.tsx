'use client'

import {useWeather} from '@/lib/hooks'
import {ChildrenProps, OpenMeteoResponse} from '@/lib/types'
import {useLocalStorage} from '@mantine/hooks'
import {createContext, useContext, useEffect, useMemo, useState} from 'react'

export interface WeatherContextProps {
  isLoading: boolean
  location: string
  setLocation: (location: string) => void
  setTempUnit: (unit: 'c' | 'f') => void
  tempUnit: string
  weather: OpenMeteoResponse | undefined
}

// Create the WeatherContext.
const WeatherContext = createContext<WeatherContextProps | undefined>(undefined)

// Create useWeatherContext hook.
export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider')
  }
  return context
}

export default function WeatherProvider({children}: Readonly<ChildrenProps>) {
  // Use useState for initial load to avoid hydration issues
  const [mounted, setMounted] = useState(false)

  const [location, setLocation] = useLocalStorage({
    key: 'location',
    defaultValue: 'Enterprise, AL',
    getInitialValueInEffect: false
  })

  const [tempUnit, setTempUnit] = useLocalStorage({
    key: 'tempUnit',
    defaultValue: 'f',
    getInitialValueInEffect: false
  })

  const {weather, isLoading} = useWeather(location)

  useEffect(() => {
    setMounted(true)
  }, [])

  const value: WeatherContextProps = useMemo(
    () => ({
      isLoading: !mounted || isLoading,
      location,
      setLocation,
      weather,
      tempUnit,
      setTempUnit
    }),
    [mounted, isLoading, location, setLocation, weather, tempUnit, setTempUnit]
  )

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}
