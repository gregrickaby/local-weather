import {setupServer} from 'msw/node'
import {handlers} from './handlers'

/**
 * MSW server instance for Node.js test environment
 *
 * This configures MSW to intercept HTTP requests in tests.
 *
 * @see https://mswjs.io/docs/integrations/node
 */
export const server = setupServer(...handlers)
