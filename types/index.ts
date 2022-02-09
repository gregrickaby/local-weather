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

export interface FooterProps {
  updatedTime: string
  weatherStation: string
}

export interface ForecastProps {
  forecast: Object[]
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
