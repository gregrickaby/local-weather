import {createContext, useContext, useEffect, useState} from 'react'
import useWeather from '~/lib/useWeather'

// Create the WeatherContext.
const WeatherContext = createContext(null)

// Create useWeatherContext hook.
export const useWeatherContext = () => useContext(WeatherContext)

/**
 * Render the WeatherProvider component.
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component properties.
 * @param  {any}     props.children The children to render.
 * @return {Element}                The WeatherProvider component.
 */
export default function WeatherProvider({children}) {
  const [search, setSearch] = useState('Bay Lake, FL')
  const [coordinates, setCoordinates] = useState()
  const [loading, setLoading] = useState(true)
  const {weather, isLoading} = useWeather(loading, coordinates)

  /**
   * Convert city and state into lat/lng coordinates.
   *
   * @param {string} search The city and state to convert.
   */
  async function getCoordinates(search: string) {
    setLoading(true)
    const response = await fetch(
      `/api/geocoding?address=${JSON.stringify(search)}`
    )
    const coordinates = await response.json()
    setCoordinates(coordinates)
    setLoading(false)
  }

  /**
   * Get coordinates when search changes.
   */
  useEffect(() => {
    getCoordinates(search)
  }, [search])

  return (
    <WeatherContext.Provider value={{isLoading, search, setSearch, weather}}>
      {children}
    </WeatherContext.Provider>
  )
}
