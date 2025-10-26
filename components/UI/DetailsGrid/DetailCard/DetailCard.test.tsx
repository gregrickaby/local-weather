import {describe, it, expect} from 'vitest'
import {render, screen} from '@/test-utils'
import DetailCard from './DetailCard'

describe('DetailCard', () => {
  it('should render children content', () => {
    render(
      <DetailCard>
        <div>Test Content</div>
      </DetailCard>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <DetailCard>
        <h3>Title</h3>
        <p>Description</p>
      </DetailCard>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should accept delay prop', () => {
    render(
      <DetailCard delay={200}>
        <div>Delayed Content</div>
      </DetailCard>
    )
    expect(screen.getByText('Delayed Content')).toBeInTheDocument()
  })

  it('should render without delay prop (default)', () => {
    render(
      <DetailCard>
        <div>No Delay</div>
      </DetailCard>
    )
    expect(screen.getByText('No Delay')).toBeInTheDocument()
  })
})
