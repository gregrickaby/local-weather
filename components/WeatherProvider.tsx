import {useLocalStorageValue} from '@mantine/hooks'
import * as React from 'react'
import {createContext, useContext, useState} from 'react'
import useWeather from '~/lib/useWeather'

interface WeatherContextProps {
  isLoading: boolean
  location: string
  setLocation: (val: any) => void
  setTempUnit: (val: any) => void
  tempUnit: boolean
  weather: Record<string, any>
}

type LocationProps = 'Enterprise, AL' | 'Paris, France'

// Create the WeatherContext.
const WeatherContext = createContext({} as WeatherContextProps)

// Create useWeatherContext hook.
export const useWeatherContext = () => useContext(WeatherContext)

export default function WeatherProvider({
  children
}: React.PropsWithChildren<{}>) {
  const [location, setLocation] = useLocalStorageValue<LocationProps>({
    key: 'location',
    defaultValue: 'Enterprise, AL'
  })
  const [tempUnit, setTempUnit] = useState(false)
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
