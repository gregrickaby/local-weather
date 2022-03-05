import {useLocalStorageValue} from '@mantine/hooks'
import * as React from 'react'
import {createContext, useContext, useState} from 'react'
import {WeatherResponse} from '~/lib/types'
import useWeather from '~/lib/useWeather'

interface WeatherContextProps {
  isLoading: boolean
  location: string
  setLocation: any // eslint-disable-line @typescript-eslint/no-explicit-any
  setTempUnit: (tempUnit: boolean) => void
  tempUnit: boolean
  weather: WeatherResponse
}

// Create the WeatherContext.
const WeatherContext = createContext({} as WeatherContextProps)

// Create useWeatherContext hook.
export const useWeatherContext = () => useContext(WeatherContext)

export default function WeatherProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [location, setLocation] = useLocalStorageValue({
    key: 'location',
    defaultValue: 'Enterprise, AL'
  })
  const [tempUnit, setTempUnit] = useState(true)
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
