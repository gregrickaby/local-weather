import {render, screen} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import Icon from './Icon'

describe('Icon', () => {
  it('should render with default alt text', () => {
    render(<Icon icon="clear-day" />)
    const image = screen.getByAltText('weather icon: clear-day')
    expect(image).toBeInTheDocument()
  })

  it('should render with custom alt text', () => {
    render(<Icon icon="clear-day" alt="Clear sky day" />)
    const image = screen.getByAltText('Clear sky day')
    expect(image).toBeInTheDocument()
  })

  it('should use correct icon path', () => {
    render(<Icon icon="rain" />)
    const image = screen.getByAltText('weather icon: rain')
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('/icons/rain.svg')
    )
  })

  it('should have correct dimensions', () => {
    render(<Icon icon="clear-day" />)
    const image = screen.getByAltText('weather icon: clear-day')
    expect(image).toHaveAttribute('height', '150')
    expect(image).toHaveAttribute('width', '150')
  })
})
