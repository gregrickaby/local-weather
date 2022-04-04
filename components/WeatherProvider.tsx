import {useLocalStorage} from '@mantine/hooks'
import {createContext, useContext} from 'react'
import {WeatherContextProps} from '~/lib/types'
import useWeather from '~/lib/useWeather'

// Create the WeatherContext.
const WeatherContext = createContext({} as WeatherContextProps)

// Create useWeatherContext hook.
export const useWeatherContext = () => useContext(WeatherContext)

export default function WeatherProvider({
  children
}: {
  children: React.ReactNode
}) {
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
