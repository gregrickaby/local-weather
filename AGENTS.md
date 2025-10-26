# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

A weather application built with Next.js 16 (App Router), Mantine 8, Redux Toolkit 2, and integrates with Open-Meteo and Google Maps APIs. The app is deployed to Coolify (using Nixpacks) at <https://weather.gregrickaby.com>.

## Common Commands

### Development

```bash
npm run dev          # Start dev server (cleans .next directory first)
npm run build        # Build for production
npm run start        # Start production server
npm run format       # Format code with Prettier
```

### Validation

Run these before committing or creating PRs. Both commands must pass without errors.

```bash
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

If visual changes, you must verify using Playwright MCP at http://localhost:3000 (assume the dev server is already running)

### Testing

```bash
npm run test           # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:ui        # Run tests with UI (browser interface)
npm run test:coverage  # Generate coverage report
```

**Testing Stack:**

- **Vitest 4**: Fast test runner with native ESM support
- **React Testing Library**: Component testing utilities
- **MSW 2**: API mocking for Open-Meteo endpoints
- **@testing-library/user-event**: User interaction simulation

**Test Structure:**
Tests are located next to the files they test in `__tests__` directories:

```
components/UI/Icon/
  ├── Icon.tsx
  └── __tests__/
      └── Icon.test.tsx

lib/utils/
  ├── helpers.ts
  └── __tests__/
      └── helpers.test.ts
```

**Importing Test Utilities:**

```typescript
// Import custom render function and utilities
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import userEvent from '@testing-library/user-event'

// Available mock data
import {
  mockWeatherResponse,
  mockLocation,
  mockGeocodeResponse,
  mockAirQualityResponse,
  server // MSW server for custom handlers
} from '@/test-utils'
```

**Writing Tests:**

Unit test (pure functions):

```typescript
import {describe, it, expect} from 'vitest'
import {formatTemperature} from '../helpers'

describe('formatTemperature', () => {
  it('should format temperature in Celsius', () => {
    const result = formatTemperature('c', 25.5)
    expect(result).toBe('26°C')
  })
})
```

Component test (simple):

```typescript
import {describe, it, expect} from 'vitest'
import {render, screen} from '@/test-utils'
import Icon from '../Icon'

describe('Icon', () => {
  it('should render with default alt text', () => {
    render(<Icon icon="01d" />)
    const image = screen.getByAltText('weather icon: 01d')
    expect(image).toBeInTheDocument()
  })
})
```

Integration test (Redux-connected):

```typescript
import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Settings from '../Settings'

describe('Settings', () => {
  it('should show search history when present', async () => {
    const user = userEvent.setup()

    render(<Settings />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [mockLocation],
          mounted: true
        }
      }
    })

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Search History (1)')).toBeInTheDocument()
    })
  })
})
```

**Testing User Interactions:**

```typescript
import userEvent from '@testing-library/user-event'

it('should handle click', async () => {
  const user = userEvent.setup()
  render(<Button />)
  await user.click(screen.getByRole('button'))
  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

**Testing Async Operations:**

```typescript
it('should load data', async () => {
  render(<WeatherComponent />)
  await waitFor(() => {
    expect(screen.getByText('Temperature: 72°F')).toBeInTheDocument()
  })
})
```

**Overriding MSW Handlers:**

```typescript
import {server} from '@/test-utils'
import {http, HttpResponse} from 'msw'

it('should handle API error', async () => {
  server.use(
    http.get('https://api.open-meteo.com/v1/forecast', () => {
      return HttpResponse.json({error: 'Server error'}, {status: 500})
    })
  )
  // Your test code...
})
```

**Best Practices:**

1. Test behavior, not implementation (test what users see/do)
2. Use semantic queries: `getByRole`, `getByLabelText` over `getByTestId`
3. Wait for async updates: Use `waitFor`, `findBy*` for async operations
4. Always use `userEvent.setup()` for interactions
5. MSW automatically resets handlers between tests
6. Test accessibility using ARIA roles and labels in queries
7. Avoid `container.querySelector()` - use Testing Library queries instead

**Important Implementation Details:**

- **OpenMeteo SDK Mocking**: The `openmeteo` npm package uses FlatBuffers, not JSON. MSW cannot intercept these requests, so we use `vi.mock('openmeteo')` in `vitest.setup.ts` to mock the entire module with a FlatBuffer-like structure
- **Environment Variables in Tests**: Use `vi.stubEnv()` and `vi.unstubAllEnvs()` instead of directly modifying `process.env` (TypeScript prevents direct assignment)
- **Mantine Components**: Require `ResizeObserver` polyfill (included in `vitest.setup.ts`)
- **Error Boundary Testing**: Test by creating a component that throws errors conditionally, then wrapping it in the ErrorBoundary

**Debugging:**

```typescript
// View DOM
screen.debug()  // entire document
screen.debug(screen.getByRole('button'))  // specific element

// Or use test UI
npm run test:ui  // Opens browser interface
```

## Required Environment Variables

**No environment variables required!** All APIs used in this project are free and require no authentication:

- **Weather Data**: Open-Meteo API (free, no key needed)
- **Geocoding/Location Search**: Open-Meteo Geocoding API (free, no key needed)

## Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router). Use Next.js Devtools MCP.
- **UI**: Mantine 8 UI library. Use Mantine primitives. Fetch official docs: <https://mantine.dev/llms.txt>
- **State Management**: Redux Toolkit 2. Use Context7 "Redux Toolkit"
- **Data Fetching**: RTK Query 2. Use Context7 "Redux Toolkit"
- **Cache Components**: Enabled for optimized server-side rendering and component caching
- **Experimental Features**:
  - Turbopack filesystem caching for faster dev builds (`turbopackFileSystemCacheForDev`)
  - Optimized package imports for Mantine and Tabler Icons

### Data Flow

1. **User Input** → Search component queries `/api/places` for location autocomplete (Open-Meteo Geocoding API)
2. **Location Selection** → Dispatched to Redux store, saved to localStorage via middleware
3. **Weather Fetch** → RTK Query fetches from `/api/weather` (geocodes location via Open-Meteo Geocoding API, then fetches forecast from Open-Meteo Weather API)
4. **State Management** → Redux Toolkit + RTK Query handle state and caching
5. **Rendering** → Components consume data from Redux store via hooks

### Key Patterns

**Redux Toolkit + RTK Query Pattern**

- Redux store configured in `lib/store/index.ts`
- RTK Query APIs: `weatherApi` and `placesApi` for data fetching with automatic caching
- Preferences slice manages:
  - Current location
  - Temperature unit (Celsius/Fahrenheit)
  - Color scheme (Light/Dark/Auto)
  - Search history (last 10 searches)
- localStorage middleware persists all user preferences automatically
- `StoreProvider` wraps the app in `app/layout.tsx`
- Components use typed hooks: `useAppSelector`, `useAppDispatch`
- Data fetching: `useGetWeatherQuery`, `useGetPlacesQuery`
- Default location: "Enterprise, AL"
- Search dropdown shows: API results > Search history > Default cities

- **Component Structure**

- `app/layout.tsx` - Root layout with Mantine provider and StoreProvider
- `app/page.tsx` - Client component assembling all UI components
- `components/` - Presentational components (Header, Search, CurrentConditions, Forecast, DetailsGrid, etc.)
- `components/Providers/StoreProvider.tsx` - Redux store provider
- All components consume state via Redux hooks (`useAppSelector`, `useAppDispatch`)

### TypeScript Configuration

- Uses path alias `@/*` mapping to project root
- `strict: true` in tsconfig.json (strict mode enabled for type safety)
- Type definitions in `lib/types.d.ts` for API responses (OpenMeteoResponse, etc.)
- Redux types auto-generated from RTK Query

### Styling

- Mantine UI components with custom theme (`lib/theme.ts`)
- CSS Modules for component-specific styles (e.g., `Page.module.css`)
- PostCSS with Mantine preset and simple-vars plugin
- Auto color scheme support (light/dark mode) persisted via Redux

## Git Workflow

- PRs must be made against `main` branch
- Must pass before submitting:
  - `npm run lint` - ESLint validation
  - `npm run typecheck` - TypeScript type checking
  - `npm run build && npm start` - Build verification
  - Verify visual changes with Playwright MCP against http://localhost:3000
  - Peer review
- Uses Lefthook for git hooks (see `lefthook.yml` if present)

## Deployment

- Deployed to Coolify at <https://weather.gregrickaby.com>
- Uses Nixpacks for building and deployment
- Pushes to `main` branch trigger automatic deployments

## API Integration Notes

- **Open-Meteo Weather API**: Free weather API, no key required. Returns current conditions, hourly forecasts (up to 16 days), and daily forecasts. Uses WMO weather codes for conditions.
- **Open-Meteo Geocoding API**: Free geocoding and location search API, no key required. Returns lat/lng coordinates and location details including city name, admin regions, and country.
- Weather icons mapped from WMO codes to existing icon set via `getWeatherInfo()` helper in `lib/helpers.ts`
- Location search results formatted as: `"{name}, {admin1}, {country}"` (e.g., "Enterprise, Alabama, United States")
