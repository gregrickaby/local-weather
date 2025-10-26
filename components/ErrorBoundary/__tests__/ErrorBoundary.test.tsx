import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {render, screen} from '@/test-utils'
import {useState} from 'react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '../ErrorBoundary'

// Component that throws an error when shouldThrow prop is true
function ThrowError({shouldThrow}: {shouldThrow: boolean}) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>Child component</div>
}

// Wrapper component with state control
function TestWrapperComponent() {
  const [shouldThrow, setShouldThrow] = useState(true)

  return (
    <div>
      <button type="button" onClick={() => setShouldThrow(false)}>
        Fix Error
      </button>
      <ErrorBoundary>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  )
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests to avoid cluttering test output
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should display error UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByText(/An unexpected error occurred/i)
    ).toBeInTheDocument()
  })

  it('should display "Try Again" button in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', {name: 'Try Again'})).toBeInTheDocument()
  })

  it('should reset error state when "Try Again" is clicked', async () => {
    const user = userEvent.setup()

    render(<TestWrapperComponent />)

    // Verify error UI is shown initially
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // First, fix the underlying error by clicking "Fix Error" button
    await user.click(screen.getByRole('button', {name: 'Fix Error'}))

    // Now click "Try Again" to reset the error boundary
    const tryAgainButton = screen.getByRole('button', {name: 'Try Again'})
    await user.click(tryAgainButton)

    // After clicking Try Again, the error boundary should reset and children should render
    expect(screen.getByText('Child component')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('should display error details in development mode', () => {
    // Set NODE_ENV to development
    vi.stubEnv('NODE_ENV', 'development')

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    // Check for error details section
    expect(
      screen.getByText('Error Details (Development Only):')
    ).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()

    vi.unstubAllEnvs()
  })

  it('should not display error details in production mode', () => {
    // Set NODE_ENV to production
    vi.stubEnv('NODE_ENV', 'production')

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    // Error details should not be present
    expect(
      screen.queryByText('Error Details (Development Only):')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument()

    // But error UI should still be shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    vi.unstubAllEnvs()
  })

  it('should call componentDidCatch when error occurs', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    )

    // componentDidCatch should have been called (console.error called in dev mode)
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })
})
