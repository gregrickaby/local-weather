export interface WeatherResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: {
    st
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather: [
      {
        rain: number
        id: number
        main: string
        description: string
        icon: string
      }
    ]
    rain: {
      '1h': number
    }
  }
  hourly: [
    {
      dt: number
      temp: number
      feels_like: number
      pressure: number
      humidity: number
      dew_point: number
      uvi: number
      clouds: number
      visibility: number
      wind_speed: number
      wind_deg: number
      wind_gust: number
      weather: [
        {
          id: number
          main: string
          description: string
          icon: string
        }
      ]
      pop: number
      rain: {
        '1h': number
      }
    }
  ]
  daily: [
    {
      dt: number
      sunrise: number
      sunset: number
      moonrise: number
      moonset: number
      moon_phase: number
      temp: {
        day: number
        min: number
        max: number
        night: number
        eve: number
        morn: number
      }
      feels_like: {
        day: number
        night: number
        eve: number
        morn: number
      }
      pressure: number
      humidity: number
      dew_point: number
      wind_speed: number
      wind_deg: number
      wind_gust: number
      weather: [
        {
          id: number
          main: string
          description: string
          icon: string
        }
      ]
      clouds: number
      pop: number
      rain: number
      uvi: number
    }
  ]
  alerts: [
    {
      sender_name: string
      event: string
      start: number
      end: number
      description: string
      tags: [string]
    }
  ]
}

export interface GeocodeResponse {
  results: [
    {
      address_components: [
        {
          long_name: string
          short_name: string
          types: [string, string]
        },
        {
          long_name: string
          short_name: string
          types: [string, string]
        },
        {
          long_name: string
          short_name: string
          types: [string, string]
        },
        {
          long_name: string
          short_name: string
          types: [string, string]
        },
        {
          long_name: string
          short_name: string
          types: [string]
        }
      ]
      formatted_address: string
      geometry: {
        bounds: {
          northeast: {
            lat: number
            lng: number
          }
          southwest: {
            lat: number
            lng: number
          }
        }
        location: {
          lat: number
          lng: number
        }
        location_type: string
        viewport: {
          northeast: {
            lat: number
            lng: number
          }
          southwest: {
            lat: number
            lng: number
          }
        }
      }
      place_id: string
      types: [string, string]
    }
  ]
  status: string
}

export interface IpDataResponse {
  ip: string
  is_eu: boolean
  city: string
  region: string
  region_code: string
  country_name: string
  country_code: string
  continent_name: string
  continent_code: string
  latitude: number
  longitude: number
  postal: string
  calling_code: string
  flag: string
  emoji_flag: string
  emoji_unicode: string
  asn: {
    asn: string
    name: string
    domain: string
    route: string
    type: string
  }
  languages: [
    {
      name: string
      native: string
      code: string
    }
  ]
  currency: {
    name: string
    code: string
    symbol: string
    native: string
    plural: string
  }
  time_zone: {
    name: string
    abbr: string
    offset: string
    is_dst: boolean
    current_time: string
  }
  threat: {
    is_tor: boolean
    is_proxy: boolean
    is_anonymous: boolean
    is_known_attacker: boolean
    is_known_abuser: boolean
    is_threat: boolean
    is_bogon: boolean
  }
  count: string
}

export interface PlacesData {
  locations: string[]
  isLoading: boolean
  isError: boolean
}

export interface WeatherData {
  weather: WeatherResponse
  isLoading: boolean
  isError: boolean
}

export interface WeatherContextProps {
  isLoading: boolean
  location: string
  setLocation: any // eslint-disable-line @typescript-eslint/no-explicit-any
  setTempUnit: (tempUnit: boolean) => void
  tempUnit: boolean
  weather: WeatherResponse
}
