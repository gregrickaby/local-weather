export interface ChildrenProps {
  children: React.ReactNode
}

export interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country: string
  display: string // Formatted display string like "Enterprise, Alabama, United States"
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
    uv_index: number
    visibility: number
    pressure_msl: number
    dew_point_2m: number
    cloud_cover: number
    rain: number
    showers: number
    snowfall: number
    snow_depth: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    weather_code: number[]
    wind_speed_10m: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    precipitation_probability_max: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max: number[]
  }
}

export interface AirQualityResponse {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    us_aqi: number
    pm2_5: number
    pm10: number
    european_aqi: number
  }
}

export interface OpenMeteoGeocodeResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  timezone?: string
  feature_code: string
  country_code: string
  country: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
  population?: number
}

export interface OpenMeteoGeocodeResponse {
  results?: OpenMeteoGeocodeResult[]
  generationtime_ms: number
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
