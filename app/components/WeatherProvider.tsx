'use client'

import {useLocalStorage} from '@mantine/hooks'
import {createContext, useContext} from 'react'
import {useWeather} from '~/lib/hooks'
import {ChildrenProps, WeatherResponse} from '~/lib/types'

export interface WeatherContextProps {
  isLoading: boolean
  location: string
  setLocation: (location: string) => void
  setTempUnit: (unit: 'c' | 'f') => void
  tempUnit: string
  weather: WeatherResponse
}

// Create the WeatherContext.
const WeatherContext = createContext({} as WeatherContextProps)

// Create useWeatherContext hook.
export function useWeatherContext() {
  return useContext(WeatherContext)
}

export default function WeatherProvider({children}: ChildrenProps) {
  const [location, setLocation] = useLocalStorage({
    key: 'location',
    defaultValue: 'Enterprise, AL'
  })

  const [tempUnit, setTempUnit] = useLocalStorage({
    key: 'tempUnit',
    defaultValue: 'f'
  })

  const {weather, isLoading} = useWeather(location)

  return (
    <WeatherContext.Provider
      value={{
        isLoading,
        location,
        setLocation,
        weather,
        tempUnit,
        setTempUnit
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}
