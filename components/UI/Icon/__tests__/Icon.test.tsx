import {describe, it, expect} from 'vitest'
import {render, screen} from '@/test-utils'
import Icon from '../Icon'

describe('Icon', () => {
  it('should render with default alt text', () => {
    render(<Icon icon="01d" />)
    const image = screen.getByAltText('weather icon: 01d')
    expect(image).toBeInTheDocument()
  })

  it('should render with custom alt text', () => {
    render(<Icon icon="01d" alt="Clear sky day" />)
    const image = screen.getByAltText('Clear sky day')
    expect(image).toBeInTheDocument()
  })

  it('should use correct icon path', () => {
    render(<Icon icon="10d" />)
    const image = screen.getByAltText('weather icon: 10d') as HTMLImageElement
    expect(image.src).toContain('/icons/10d.svg')
  })

  it('should have correct dimensions', () => {
    render(<Icon icon="01d" />)
    const image = screen.getByAltText('weather icon: 01d')
    expect(image).toHaveAttribute('height', '150')
    expect(image).toHaveAttribute('width', '150')
  })
})
