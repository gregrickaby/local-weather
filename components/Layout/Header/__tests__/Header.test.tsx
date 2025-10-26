import {describe, it, expect} from 'vitest'
import {render, screen} from '@/test-utils'
import Header from '../Header'
import config from '@/lib/constants/config'

describe('Header', () => {
  it('should render header element', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('should display site name as h1', () => {
    render(<Header />)
    const heading = screen.getByRole('heading', {level: 1})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(config.siteName)
  })

  it('should render title from config', () => {
    render(<Header />)
    expect(screen.getByText(config.siteName)).toBeInTheDocument()
  })
})
