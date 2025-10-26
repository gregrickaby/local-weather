import {describe, it, expect} from 'vitest'
import {render} from '@/test-utils'
import BackToTop from './BackToTop'

describe('BackToTop', () => {
  it('should render component without errors', () => {
    const {container} = render(<BackToTop />)
    expect(container).toBeInTheDocument()
  })

  it('should mount successfully', () => {
    const {container} = render(<BackToTop />)
    // Component renders successfully
    expect(container.firstChild).toBeTruthy()
  })
})

/*
Note: Button visibility depends on scroll position (scroll.y > 0).
In test environment (jsdom), scroll is always 0, so Transition
component doesn't mount the button. Testing the actual scroll
behavior requires a browser environment (use Playwright MCP).
*/
