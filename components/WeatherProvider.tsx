import {createContext, useContext, useState} from 'react'
import useWeather from '~/lib/useWeather'

// Create the WeatherContext.
const WeatherContext = createContext(null)

// Create useWeatherContext hook.
export const useWeatherContext = () => useContext(WeatherContext)

/**
 * Render the WeatherProvider component.
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component attributes as props.
 * @param  {any}     props.children The children to render.
 * @return {Element}                The WeatherProvider component.
 */
export default function WeatherProvider({children}) {
  const [location, setLocation] = useState('Bay Lake, FL')
  const {weather, isLoading} = useWeather(location)

  return (
    <WeatherContext.Provider
      value={{isLoading, location, setLocation, weather}}
    >
      {children}
    </WeatherContext.Provider>
  )
}
