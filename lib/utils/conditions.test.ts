import {describe, expect, it} from 'vitest'
import {
  getAQIDescription,
  getAQILevel,
  getFeelsLikeDescription,
  getHumidityDescription,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getPressureDescription,
  getUVInfo,
  getVisibilityDescription,
  getWeatherInfo,
  getWindDirection
} from './conditions'

describe('getWeatherInfo', () => {
  it('should return correct info for clear sky (day)', () => {
    const result = getWeatherInfo(
      0,
      '2025-01-15T12:00:00',
      '2025-01-15T07:00:00',
      '2025-01-15T18:00:00'
    )
    expect(result.description).toBe('Clear sky')
    expect(result.icon).toBe('01d')
  })

  it('should return correct info for clear sky (night)', () => {
    const result = getWeatherInfo(
      0,
      '2025-01-15T20:00:00',
      '2025-01-15T07:00:00',
      '2025-01-15T18:00:00'
    )
    expect(result.description).toBe('Clear sky')
    expect(result.icon).toBe('01n')
  })

  it('should return correct info for rain', () => {
    const result = getWeatherInfo(61)
    expect(result.description).toBe('Slight rain')
    expect(result.icon).toBe('10d') // defaults to day
  })

  it('should return correct info for thunderstorm', () => {
    const result = getWeatherInfo(95)
    expect(result.description).toBe('Thunderstorm')
    expect(result.icon).toBe('11d')
  })

  it('should handle unknown codes', () => {
    const result = getWeatherInfo(999)
    expect(result.description).toBe('Unknown')
    expect(result.icon).toBe('01d')
  })
})

describe('getWindDirection', () => {
  it('should return N for 0 degrees', () => {
    expect(getWindDirection(0)).toBe('N')
  })

  it('should return NE for 45 degrees', () => {
    expect(getWindDirection(45)).toBe('NE')
  })

  it('should return E for 90 degrees', () => {
    expect(getWindDirection(90)).toBe('E')
  })

  it('should return SE for 135 degrees', () => {
    expect(getWindDirection(135)).toBe('SE')
  })

  it('should return S for 180 degrees', () => {
    expect(getWindDirection(180)).toBe('S')
  })

  it('should return SW for 225 degrees', () => {
    expect(getWindDirection(225)).toBe('SW')
  })

  it('should return W for 270 degrees', () => {
    expect(getWindDirection(270)).toBe('W')
  })

  it('should return NW for 315 degrees', () => {
    expect(getWindDirection(315)).toBe('NW')
  })

  it('should wrap around at 360 degrees to N', () => {
    expect(getWindDirection(360)).toBe('N')
  })
})

describe('getUVInfo', () => {
  it('should return Low for UV index 0-2', () => {
    expect(getUVInfo(0).level).toBe('Low')
    expect(getUVInfo(2).level).toBe('Low')
  })

  it('should return Moderate for UV index 3-5', () => {
    expect(getUVInfo(3).level).toBe('Moderate')
    expect(getUVInfo(5).level).toBe('Moderate')
  })

  it('should return High for UV index 6-7', () => {
    expect(getUVInfo(6).level).toBe('High')
    expect(getUVInfo(7).level).toBe('High')
  })

  it('should return Very High for UV index 8-10', () => {
    expect(getUVInfo(8).level).toBe('Very High')
    expect(getUVInfo(10).level).toBe('Very High')
  })

  it('should return Extreme for UV index 11+', () => {
    expect(getUVInfo(11).level).toBe('Extreme')
    expect(getUVInfo(15).level).toBe('Extreme')
  })
})

describe('getAQILevel', () => {
  it('should return Good for AQI 0-50', () => {
    const result = getAQILevel(30)
    expect(result.level).toBe('Good')
    expect(result.color).toBe('green')
  })

  it('should return Moderate for AQI 51-100', () => {
    const result = getAQILevel(75)
    expect(result.level).toBe('Moderate')
    expect(result.color).toBe('yellow')
  })

  it('should return Unhealthy for Sensitive for AQI 101-150', () => {
    const result = getAQILevel(125)
    expect(result.level).toBe('Unhealthy for Sensitive')
    expect(result.color).toBe('orange')
  })

  it('should return Unhealthy for AQI 151-200', () => {
    const result = getAQILevel(175)
    expect(result.level).toBe('Unhealthy')
    expect(result.color).toBe('red')
  })

  it('should return Very Unhealthy for AQI 201-300', () => {
    const result = getAQILevel(250)
    expect(result.level).toBe('Very Unhealthy')
    expect(result.color).toBe('grape')
  })

  it('should return Hazardous for AQI 301+', () => {
    const result = getAQILevel(350)
    expect(result.level).toBe('Hazardous')
    expect(result.color).toBe('red.9')
  })
})

describe('getAQIDescription', () => {
  it('should return correct description for good air quality', () => {
    expect(getAQIDescription(30)).toBe('Air quality is satisfactory')
  })

  it('should return correct description for hazardous air quality', () => {
    expect(getAQIDescription(350)).toBe(
      'Health warning of emergency conditions'
    )
  })
})

describe('getHumidityDescription', () => {
  it('should return Dry conditions for humidity < 30%', () => {
    expect(getHumidityDescription(20)).toBe('Dry conditions')
  })

  it('should return Comfortable for humidity 30-59%', () => {
    expect(getHumidityDescription(45)).toBe('Comfortable')
  })

  it('should return Slightly humid for humidity 60-79%', () => {
    expect(getHumidityDescription(70)).toBe('Slightly humid')
  })

  it('should return Very humid for humidity 80%+', () => {
    expect(getHumidityDescription(85)).toBe('Very humid')
  })
})

describe('getPressureDescription', () => {
  it('should return High pressure for 1020+ hPa', () => {
    expect(getPressureDescription(1025)).toBe('High pressure')
  })

  it('should return Normal pressure for 1010-1019 hPa', () => {
    expect(getPressureDescription(1013)).toBe('Normal pressure')
  })

  it('should return Low pressure for 1000-1009 hPa', () => {
    expect(getPressureDescription(1005)).toBe('Low pressure')
  })

  it('should return Very low pressure for < 1000 hPa', () => {
    expect(getPressureDescription(990)).toBe('Very low pressure')
  })
})

describe('getVisibilityDescription', () => {
  describe('metric (kilometers)', () => {
    it('should return "Excellent visibility" for 16+ km', () => {
      expect(getVisibilityDescription(16, true)).toBe('Excellent visibility')
    })

    it('should return "Very good visibility" for 10-15 km', () => {
      expect(getVisibilityDescription(12, true)).toBe('Very good visibility')
    })

    it('should return "Good visibility" for 5-9 km', () => {
      expect(getVisibilityDescription(7, true)).toBe('Good visibility')
    })

    it('should return "Moderate visibility" for 2-4 km', () => {
      expect(getVisibilityDescription(3, true)).toBe('Moderate visibility')
    })

    it('should return "Poor visibility" for < 2 km', () => {
      expect(getVisibilityDescription(1, true)).toBe('Poor visibility')
    })
  })

  describe('imperial (miles)', () => {
    it('should return "Excellent visibility" for 10+ miles', () => {
      expect(getVisibilityDescription(10, false)).toBe('Excellent visibility')
    })

    it('should return "Very good visibility" for 6-9 miles', () => {
      expect(getVisibilityDescription(7, false)).toBe('Very good visibility')
    })

    it('should return "Good visibility" for 3-5 miles', () => {
      expect(getVisibilityDescription(4, false)).toBe('Good visibility')
    })

    it('should return "Moderate visibility" for 1-2 miles', () => {
      expect(getVisibilityDescription(1.5, false)).toBe('Moderate visibility')
    })

    it('should return "Poor visibility" for < 1 mile', () => {
      expect(getVisibilityDescription(0.5, false)).toBe('Poor visibility')
    })
  })
})

describe('getFeelsLikeDescription', () => {
  it('should return similar for < 2° difference', () => {
    expect(getFeelsLikeDescription(72, 72)).toBe(
      'Similar to actual temperature'
    )
    expect(getFeelsLikeDescription(73, 72)).toBe(
      'Similar to actual temperature'
    )
  })

  it('should return warmer description for positive difference', () => {
    expect(getFeelsLikeDescription(75, 72)).toBe('Feels 3° warmer')
  })

  it('should return much warmer for > 5° difference', () => {
    expect(getFeelsLikeDescription(80, 72)).toBe(
      'Feels much warmer (8° warmer)'
    )
  })

  it('should return cooler description for negative difference', () => {
    expect(getFeelsLikeDescription(68, 72)).toBe('Feels 4° cooler')
  })

  it('should return much cooler for > 5° difference', () => {
    expect(getFeelsLikeDescription(64, 72)).toBe(
      'Feels much cooler (8° cooler)'
    )
  })
})

describe('getMoonPhaseName', () => {
  it('should return "New Moon" for phase 0', () => {
    expect(getMoonPhaseName(0)).toBe('New Moon')
  })

  it('should return "Waxing Crescent" for phase 0.1', () => {
    expect(getMoonPhaseName(0.1)).toBe('Waxing Crescent')
  })

  it('should return "First Quarter" for phase 0.25', () => {
    expect(getMoonPhaseName(0.25)).toBe('First Quarter')
  })

  it('should return "Waxing Gibbous" for phase 0.35', () => {
    expect(getMoonPhaseName(0.35)).toBe('Waxing Gibbous')
  })

  it('should return "Full Moon" for phase 0.5', () => {
    expect(getMoonPhaseName(0.5)).toBe('Full Moon')
  })

  it('should return "Waning Gibbous" for phase 0.6', () => {
    expect(getMoonPhaseName(0.6)).toBe('Waning Gibbous')
  })

  it('should return "Last Quarter" for phase 0.75', () => {
    expect(getMoonPhaseName(0.75)).toBe('Last Quarter')
  })

  it('should return "Waning Crescent" for phase 0.85', () => {
    expect(getMoonPhaseName(0.85)).toBe('Waning Crescent')
  })
})

describe('getMoonPhaseEmoji', () => {
  it('should return correct emoji for New Moon', () => {
    expect(getMoonPhaseEmoji(0)).toBe('🌑')
  })

  it('should return correct emoji for Waxing Crescent', () => {
    expect(getMoonPhaseEmoji(0.1)).toBe('🌒')
  })

  it('should return correct emoji for First Quarter', () => {
    expect(getMoonPhaseEmoji(0.25)).toBe('🌓')
  })

  it('should return correct emoji for Waxing Gibbous', () => {
    expect(getMoonPhaseEmoji(0.35)).toBe('🌔')
  })

  it('should return correct emoji for Full Moon', () => {
    expect(getMoonPhaseEmoji(0.5)).toBe('🌕')
  })

  it('should return correct emoji for Waning Gibbous', () => {
    expect(getMoonPhaseEmoji(0.6)).toBe('🌖')
  })

  it('should return correct emoji for Last Quarter', () => {
    expect(getMoonPhaseEmoji(0.75)).toBe('🌗')
  })

  it('should return correct emoji for Waning Crescent', () => {
    expect(getMoonPhaseEmoji(0.85)).toBe('🌘')
  })
})
