import {describe, expect, it} from 'vitest'
import {
  calculateSunPosition,
  getAQIDescription,
  getAQILevel,
  getHumidityDescription,
  getUVInfo,
  getWindDirection
} from './weather-helpers'

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

  it('should round to nearest direction', () => {
    expect(getWindDirection(22)).toBe('N') // Closer to 0 (22.5 is the boundary)
    expect(getWindDirection(23)).toBe('NE') // Closer to 45
    expect(getWindDirection(67)).toBe('NE') // Closer to 45
    expect(getWindDirection(68)).toBe('E') // Closer to 90 (67.5 is the boundary)
  })
})

describe('getUVInfo', () => {
  it('should return Low for UV index 0-2', () => {
    expect(getUVInfo(0)).toEqual({
      level: 'Low',
      description: 'Low for the rest of the day'
    })
    expect(getUVInfo(2)).toEqual({
      level: 'Low',
      description: 'Low for the rest of the day'
    })
  })

  it('should return Moderate for UV index 3-5', () => {
    expect(getUVInfo(3)).toEqual({
      level: 'Moderate',
      description: 'Some protection required'
    })
    expect(getUVInfo(5)).toEqual({
      level: 'Moderate',
      description: 'Some protection required'
    })
  })

  it('should return High for UV index 6-7', () => {
    expect(getUVInfo(6)).toEqual({
      level: 'High',
      description: 'Protection essential'
    })
    expect(getUVInfo(7)).toEqual({
      level: 'High',
      description: 'Protection essential'
    })
  })

  it('should return Very High for UV index 8-10', () => {
    expect(getUVInfo(8)).toEqual({
      level: 'Very High',
      description: 'Extra protection needed'
    })
    expect(getUVInfo(10)).toEqual({
      level: 'Very High',
      description: 'Extra protection needed'
    })
  })

  it('should return Extreme for UV index 11+', () => {
    expect(getUVInfo(11)).toEqual({
      level: 'Extreme',
      description: 'Stay inside if possible'
    })
    expect(getUVInfo(15)).toEqual({
      level: 'Extreme',
      description: 'Stay inside if possible'
    })
  })
})

describe('getAQILevel', () => {
  it('should return Good (green) for AQI 0-50', () => {
    expect(getAQILevel(0)).toEqual({level: 'Good', color: 'green'})
    expect(getAQILevel(50)).toEqual({level: 'Good', color: 'green'})
  })

  it('should return Moderate (yellow) for AQI 51-100', () => {
    expect(getAQILevel(51)).toEqual({level: 'Moderate', color: 'yellow'})
    expect(getAQILevel(100)).toEqual({level: 'Moderate', color: 'yellow'})
  })

  it('should return Unhealthy for Sensitive (orange) for AQI 101-150', () => {
    expect(getAQILevel(101)).toEqual({
      level: 'Unhealthy for Sensitive',
      color: 'orange'
    })
    expect(getAQILevel(150)).toEqual({
      level: 'Unhealthy for Sensitive',
      color: 'orange'
    })
  })

  it('should return Unhealthy (red) for AQI 151-200', () => {
    expect(getAQILevel(151)).toEqual({level: 'Unhealthy', color: 'red'})
    expect(getAQILevel(200)).toEqual({level: 'Unhealthy', color: 'red'})
  })

  it('should return Very Unhealthy (grape) for AQI 201-300', () => {
    expect(getAQILevel(201)).toEqual({level: 'Very Unhealthy', color: 'grape'})
    expect(getAQILevel(300)).toEqual({level: 'Very Unhealthy', color: 'grape'})
  })

  it('should return Hazardous (red.9) for AQI 301+', () => {
    expect(getAQILevel(301)).toEqual({level: 'Hazardous', color: 'red.9'})
    expect(getAQILevel(500)).toEqual({level: 'Hazardous', color: 'red.9'})
  })
})

describe('getAQIDescription', () => {
  it('should return satisfactory message for AQI 0-50', () => {
    expect(getAQIDescription(0)).toBe('Air quality is satisfactory')
    expect(getAQIDescription(50)).toBe('Air quality is satisfactory')
  })

  it('should return acceptable message for AQI 51-100', () => {
    expect(getAQIDescription(51)).toBe('Acceptable for most people')
    expect(getAQIDescription(100)).toBe('Acceptable for most people')
  })

  it('should return sensitive groups message for AQI 101-150', () => {
    expect(getAQIDescription(101)).toBe('Unhealthy for sensitive groups')
    expect(getAQIDescription(150)).toBe('Unhealthy for sensitive groups')
  })

  it('should return everyone affected message for AQI 151-200', () => {
    expect(getAQIDescription(151)).toBe('Everyone may experience effects')
    expect(getAQIDescription(200)).toBe('Everyone may experience effects')
  })

  it('should return health alert message for AQI 201-300', () => {
    expect(getAQIDescription(201)).toBe('Health alert: everyone affected')
    expect(getAQIDescription(300)).toBe('Health alert: everyone affected')
  })

  it('should return emergency warning for AQI 301+', () => {
    expect(getAQIDescription(301)).toBe(
      'Health warning of emergency conditions'
    )
    expect(getAQIDescription(500)).toBe(
      'Health warning of emergency conditions'
    )
  })
})

describe('getHumidityDescription', () => {
  it('should return Dry conditions for humidity < 30%', () => {
    expect(getHumidityDescription(0)).toBe('Dry conditions')
    expect(getHumidityDescription(29)).toBe('Dry conditions')
  })

  it('should return Comfortable for humidity 30-59%', () => {
    expect(getHumidityDescription(30)).toBe('Comfortable')
    expect(getHumidityDescription(59)).toBe('Comfortable')
  })

  it('should return Slightly humid for humidity 60-79%', () => {
    expect(getHumidityDescription(60)).toBe('Slightly humid')
    expect(getHumidityDescription(79)).toBe('Slightly humid')
  })

  it('should return Very humid for humidity 80%+', () => {
    expect(getHumidityDescription(80)).toBe('Very humid')
    expect(getHumidityDescription(100)).toBe('Very humid')
  })
})

describe('calculateSunPosition', () => {
  it('should return 50 when parameters are missing', () => {
    expect(calculateSunPosition()).toBe(50)
    expect(calculateSunPosition('2025-01-26T12:00:00')).toBe(50)
    expect(
      calculateSunPosition('2025-01-26T12:00:00', '2025-01-26T06:00:00')
    ).toBe(50)
  })

  it('should return 0 when current time is before sunrise', () => {
    const result = calculateSunPosition(
      '2025-01-26T05:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(0)
  })

  it('should return 100 when current time is after sunset', () => {
    const result = calculateSunPosition(
      '2025-01-26T19:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(100)
  })

  it('should return 50 when current time is at midday (halfway)', () => {
    const result = calculateSunPosition(
      '2025-01-26T12:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(50)
  })

  it('should return 25 when current time is at quarter day', () => {
    const result = calculateSunPosition(
      '2025-01-26T09:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(25)
  })

  it('should return 75 when current time is at three-quarter day', () => {
    const result = calculateSunPosition(
      '2025-01-26T15:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(75)
  })
})
