export interface ForecastProps {
  forecast: {
    properties: {
      periods: Object[]
    }
  }
}

export interface ForecastPeriodProps {
  name: string
  icon: string
  detailedForecast: string
}

export interface AlertProps {
  alerts: Object[]
}

export interface AlertProperties {
  properties: {
    headline: string
    description: string
    instruction: string
  }
}

export interface RadarProps {
  image: string
}

export interface WeatherData {
  weather: any
  isLoading: boolean
  isError: boolean
}

export interface FooterProps {
  updatedTime: string
  weatherStation: string
}
