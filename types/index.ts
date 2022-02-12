export interface AlertProps {
  alerts: Object[]
}

export interface AlertsProps {
  properties: {
    headline: string
    description: string
    instruction: string
  }
}

export interface PlacesData {
  cities: any
  isLoading: boolean
  isError: boolean
}

export interface FooterProps {
  updatedTime: string
  weatherStation: string
}

export interface ForecastProps {
  forecast: Object[]
  location: {
    city: string
    state: string
  }
}

export interface ForecastsProps {
  name: string
  icon: string
  detailedForecast: string
}

export interface RadarProps {
  image: string
}

export interface WeatherData {
  weather: any
  isLoading: boolean
  isError: boolean
}
