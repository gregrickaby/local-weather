'use client'

import {Button, Container, Paper, Text, Title} from '@mantine/core'
import {Component, type ErrorInfo, type ReactNode} from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary component to catch and handle React component errors.
 *
 * Provides a fallback UI when an error occurs in the component tree,
 * preventing the entire application from crashing.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = (): void => {
    this.setState({hasError: false, error: undefined})
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Paper p="xl" radius="md" withBorder>
            <Title order={2} mb="md">
              Something went wrong
            </Title>
            <Text c="dimmed" mb="lg">
              An unexpected error occurred. Please try refreshing the page or
              click the button below to reset the application.
            </Text>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper p="md" mb="lg" bg="red.0" c="red.9" radius="sm">
                <Text size="sm" fw={600} mb="xs">
                  Error Details (Development Only):
                </Text>
                <Text size="xs" ff="monospace">
                  {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text size="xs" ff="monospace" mt="xs" c="red.8">
                    {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                  </Text>
                )}
              </Paper>
            )}
            <Button onClick={this.handleReset} fullWidth>
              Try Again
            </Button>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}
