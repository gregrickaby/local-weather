import {describe, it, expect} from 'vitest'
import {render, screen} from '@/test-utils'
import Footer from '../Footer'
import config from '@/lib/constants/config'

describe('Footer', () => {
  it('should render footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('should display author name with link', () => {
    render(<Footer />)
    const authorLink = screen.getByRole('link', {
      name: `visit ${config.siteAuthor} website`
    })
    expect(authorLink).toBeInTheDocument()
    expect(authorLink).toHaveAttribute('href', config.authorUrl)
    expect(authorLink).toHaveTextContent(config.siteAuthor)
  })

  it('should have rel="author" on author link', () => {
    render(<Footer />)
    const authorLink = screen.getByRole('link', {
      name: `visit ${config.siteAuthor} website`
    })
    expect(authorLink).toHaveAttribute('rel', 'author')
  })

  it('should display GitHub link', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', {
      name: 'view source code on github'
    })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', config.githubUrl)
  })

  it('should open GitHub link in new tab', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', {
      name: 'view source code on github'
    })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should contain GitHub icon', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', {
      name: 'view source code on github'
    })
    const icon = githubLink.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})
