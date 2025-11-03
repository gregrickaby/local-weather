# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Expert React Frontend Engineer

You are in expert frontend engineer. Your task is to provide senior React and TypeScript frontend engineering guidance using both Separation of Concerns (SoC) and Test-Driven Design patterns and best practices as if you were a leader in the field.

## Key Philosophy

**Keep components "dumb" and focused on presentation.** Move all logic to testable, reusable hooks and helpers. This makes the codebase maintainable, testable, and follows React best practices for 2025 and beyond.

## Quick Reference

### File Organization

- `components/` - Presentational components only (render UI + handle user interactions)
- `lib/hooks/` - Business logic, state management, data transformations (prefix with `use`)
- `lib/utils/` - Pure functions (calculations, formatting, conditions)
- Tests co-located with implementation files (e.g., `useWindData.ts` + `useWindData.test.ts`)

### Decision Tree: Where Does This Code Go?

**Is it a pure calculation/formatting function with no state?**

- ✅ Extract to `lib/utils/` (e.g., `getWindDirection()`, `formatTemperature()`)
- File: `calculations.ts`, `formatting.ts`, `conditions.ts`

**Does it need React hooks, state, or effects?**

- ✅ Extract to `lib/hooks/` (e.g., `useWindData()`, `useCityPageLocation()`)
- Return processed data ready for components to render

**Is it just rendering data or handling UI events?**

- ✅ Keep in component
- Call hooks to get data, render with Mantine components

### Current Utility Files

- `lib/utils/calculations.ts` - Math, sun position, moon phase calculations
- `lib/utils/formatting.ts` - Date/time formatting, temperature conversion
- `lib/utils/conditions.ts` - Weather conditions, AQI levels, UV index info
- `lib/utils/slug.ts` - URL slug creation and parsing

### Example Hooks in Codebase

- `useWeatherData()` - Centralized weather API calls
- `useCityPageLocation()` - Location resolution from URL slug
- `useWindData()` - Wind speed, direction, gusts calculations
- `useCurrentConditions()` - Current weather with sunrise/sunset
- `useLocationSearch()` - Search bar logic and favorites

## Project Overview

A weather application built with Next.js 16 (App Router, React 19 Compiler), Mantine 8, Redux Toolkit 2, and integrates with Open-Meteo APIs. The app is deployed to Coolify (using Nixpacks) at <https://weather.gregrickaby.com>.

## Common Commands

### Development

```bash
npm run dev          # Start dev server (cleans .next directory first)
npm run build        # Build for production
npm run start        # Start production server
```

### Validation

Run these before committing or creating PRs. Both commands must pass without errors.

```bash
npm run validate     # Run format, lint, typecheck, and tests.
npm run sonar        # Run SonarQube code quality analysis (runs tests + scanner)
```

If visual changes, you must verify using Microsoft Playwright MCP at http://localhost:3000 (assume the dev server is already running)

### Code Quality

This project uses **SonarQube Community Edition** for static code analysis. The scanner is configured to analyze TypeScript/TSX files and report code smells, bugs, vulnerabilities, and test coverage.

**Setup:**

- SonarQube server runs locally via Docker on port 9000
- Authentication token stored as `SONAR_TOKEN` environment variable in `~/.zshrc`
- Configuration in `sonar-project.properties`

**Usage:**

```bash
npm run sonar        # Runs test:coverage then sonar-scanner
```

View results at: http://localhost:9000/dashboard?id=local-weather

**Important:** Always address SonarQube issues before creating PRs. The scanner will flag:

- Code smells (maintainability issues)
- Bugs (potential runtime errors)
- Security vulnerabilities
- Test coverage gaps
- Code duplication

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
Tests are co-located with the files they test (no `__tests__` directories):

```
components/UI/Icon/
  ├── Icon.tsx
  └── Icon.test.tsx

lib/utils/
  ├── helpers.ts
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

1. **User Input** → Search component queries geocoding API for location autocomplete (Open-Meteo Geocoding API)
2. **Location Selection** → Navigation to city page URL, location dispatched to Redux store, saved to localStorage
3. **Weather Fetch** → RTK Query fetches weather data using location coordinates from Redux state
4. **State Management** → Redux Toolkit + RTK Query handle state and caching
5. **Rendering** → Components consume data from Redux store via hooks

### Routing Architecture

**URL Structure:**

- `/` - Home page (redirects to last viewed location or default)
- `/{location-slug}` - City weather page (e.g., `/chicago-illinois-united-states`)

**Dynamic Routes:**

- `app/[location]/page.tsx` - Dynamic city route handler
- Generates SEO metadata for each city (title, description, Open Graph tags)
- Pre-renders popular cities at build time via `generateStaticParams`
- Client-side location resolution for flexibility

**Slug Generation:**

- Slugs created from location display name (e.g., "Chicago, Illinois, United States" → "chicago-illinois-united-states")
- Utility functions in `lib/utils/slug.ts`: `createLocationSlug()`, `parseLocationSlug()`
- Known locations (popular cities + default) resolve instantly
- Unknown locations use geocoding API client-side

**Navigation Flow:**

1. User searches for location
2. On selection, app navigates to `/{location-slug}` using Next.js router
3. City page resolves slug to coordinates (from cache or geocoding API)
4. Weather data fetched and displayed
5. URL updates and is shareable

### Key Patterns

**Redux Toolkit + RTK Query Pattern**

- Redux store configured in `lib/store/index.ts`
- RTK Query APIs: `weatherApi` and `placesApi` for data fetching with automatic caching
- Preferences slice manages:
  - Current location
  - Temperature unit (Celsius/Fahrenheit) - **Note: Unit selector removed from Settings UI; units auto-detected from user's location**
  - Color scheme (Light/Dark/Auto)
  - Favorites (user-saved locations with heart icon in search dropdown)
- localStorage middleware persists all user preferences automatically
- `StoreProvider` wraps the app in `app/layout.tsx`
- Components use typed hooks: `useAppSelector`, `useAppDispatch`
- Data fetching: `useGetWeatherQuery`, `useGetPlacesQuery`
- Default location: "Enterprise, AL"
- Search dropdown shows: API results > Favorites (when typing) > Default cities

**Component Structure**

- `app/layout.tsx` - Root layout with Mantine provider and StoreProvider
- `app/page.tsx` - Home page that redirects to location page
- `app/[location]/page.tsx` - Dynamic city page route
- `components/Pages/CityPage.tsx` - City weather page component
- `components/` - Presentational components (Header, Search, CurrentConditions, Forecast, DetailsGrid, etc.)
- `components/Providers/StoreProvider.tsx` - Redux store provider
- All components consume state via Redux hooks (`useAppSelector`, `useAppDispatch`)

**Separation of Concerns Pattern**

This codebase follows a strict separation between **presentational components** and **business logic**:

**Presentational Components** (`components/`):

- Should ONLY handle rendering and user interactions
- Consume data via hooks, display it using Mantine components
- Handle user events (clicks, input changes) by calling hook functions
- Should be simple, readable, and easy to understand
- Tests focus on: "Does it render correctly?" and "Does it respond to user interactions?"

**Business Logic** (`lib/hooks/` and `lib/utils/`):

- **Custom Hooks** (`lib/hooks/`): Encapsulate stateful logic, data transformations, and complex calculations
  - Named with `use` prefix (e.g., `useCityPageLocation`, `useLocationSearch`, `useWindData`)
  - Return processed data and action functions
  - Handle all data manipulation before passing to components
  - Co-located with tests (e.g., `useCityPageLocation.test.ts`)
- **Utility Functions** (`lib/utils/`): Pure functions for calculations, formatting, and data transformation
  - `calculations.ts`: Math utilities (sun position, moon phase, etc.)
  - `formatting.ts`: Date/time formatting, temperature conversion
  - `conditions.ts`: Weather conditions, AQI levels, UV index, wind direction
  - `slug.ts`: URL slug creation and parsing
  - Co-located with tests (e.g., `calculations.test.ts`)

**Migration Guidelines:**

When adding new features or refactoring existing code:

1. **Extract Utility Functions:**
   - Move pure calculation/formatting functions to `lib/utils/`
   - Examples from codebase: `getWindDirection()` (conditions.ts), `getUVIndexInfo()` (conditions.ts), `calculateSunPosition()` (calculations.ts)
   - These should be pure functions with no side effects
   - Test thoroughly with various inputs/edge cases

2. **Create Custom Hooks:**
   - Extract stateful logic and data transformations to `lib/hooks/`
   - Hooks should handle: Redux state selection, RTK Query calls, data transformation, derived state
   - Examples from codebase: `useCityPageLocation()` (location resolution), `useWindData()` (wind calculations), `useLocationSearch()` (search logic)
   - Return only what components need to render

3. **Simplify Components:**
   - Components should call hooks to get processed data
   - Render using Mantine primitives (Stack, Text, Group, etc.)
   - Pass hook action functions to event handlers
   - Avoid: calculations, data transformations, complex conditionals, direct Redux/API calls

**Real-World Examples from Codebase:**

**Example 1: Wind Component (Simple)**

```typescript
// ❌ BAD: Business logic in component
export default function Wind() {
  const {data: weather} = useGetWeatherQuery(...)
  const windSpeed = Math.round(weather?.current?.wind_speed_10m || 0)
  const windDirection = weather?.current?.wind_direction_10m || 0

  function getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round(degrees / 45) % 8]
  }

  return <DetailCard>{windSpeed} mph, {getWindDirection(windDirection)}</DetailCard>
}

// ✅ GOOD: Separation of concerns
// lib/utils/conditions.ts
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

// lib/hooks/useWindData.ts
export function useWindData() {
  const location = useAppSelector((state) => state.preferences.location)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const {data: weather} = useWeatherData() // Centralized hook

  const windSpeed = Math.round(weather?.current?.wind_speed_10m || 0)
  const windGusts = Math.round(weather?.current?.wind_gusts_10m || 0)
  const windDirection = weather?.current?.wind_direction_10m || 0
  const directionLabel = getWindDirection(windDirection)
  const speedUnit = tempUnit === 'c' ? 'km/h' : 'mph'

  return {windSpeed, windGusts, directionLabel, speedUnit}
}

// components/UI/DetailsGrid/Wind/Wind.tsx
export default function Wind() {
  const {windSpeed, windGusts, directionLabel, speedUnit} = useWindData()

  return (
    <DetailCard delay={0}>
      <Text>{windSpeed} {speedUnit}</Text>
      <Text>Gusts {windGusts} {speedUnit}</Text>
      <Text>{directionLabel}</Text>
    </DetailCard>
  )
}
```

**Example 2: CityPage Component (Complex)**

```typescript
// ❌ BAD: Business logic mixed with presentation (106 lines)
export default function CityPage({slug}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [locationResolved, setLocationResolved] = useState(false)
  const [locationError, setLocationError] = useState(false)

  // Complex location resolution logic
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  const knownLocation = allLocations.find(city => createLocationSlug(city) === slug)
  const {searchTerm} = parseLocationSlug(slug)
  const {data: locations} = useGetPlacesQuery(searchTerm, {skip: !!knownLocation})

  // Multiple useEffects for state management
  useEffect(() => { /* reset logic */ }, [slug])
  useEffect(() => { /* resolution logic */ }, [knownLocation, locations, ...])

  // Render logic...
}

// ✅ GOOD: Business logic extracted to hook (88 lines component, 95 lines hook)
// lib/hooks/useCityPageLocation.ts
export function useCityPageLocation({slug}) {
  // All location resolution logic here
  // Returns: {locationResolved, locationError, isSearching}
}

// components/Pages/CityPage.tsx
export default function CityPage({slug}) {
  const {locationResolved, locationError} = useCityPageLocation({slug})
  const {data: weather, isLoading} = useWeatherData()

  if (locationError) return <ErrorAlert />
  if (!locationResolved || isLoading) return <WeatherSkeleton />

  return (
    <Stack>
      <CurrentConditions />
      <DetailsGrid />
      <Radar />
      <Forecast />
    </Stack>
  )
}
```

**Testing Strategy:**

- **Hook Tests:** Test all business logic, calculations, and data transformations
- **Helper Tests:** Test pure functions with various inputs/outputs
- **Component Tests:** Test rendering and user interactions only (simplified tests)

This pattern keeps components focused on presentation, makes business logic reusable and testable, and improves code maintainability.

### TypeScript Configuration

- Uses path alias `@/*` mapping to project root
- `strict: true` in tsconfig.json (strict mode enabled for type safety)
- Type definitions in `lib/types.d.ts` for API responses (OpenMeteoResponse, etc.)
- Redux types auto-generated from RTK Query

### Styling

- Mantine UI components with custom theme (`lib/theme.ts`)
- Use Mantine primitives as much as possible
- CSS Modules for component-specific styles (e.g., `Page.module.css`) when Mantine privities aren't enough
- Auto color scheme support (light/dark mode) persisted via Redux

## Git Workflow

- PRs must be made against `main` branch
- Must pass before submitting:
  - `npm run validate`
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
- Weather conditions mapped from WMO codes via `getWeatherCondition()` in `lib/utils/conditions.ts`
- Location search results formatted as: `"{name}, {admin1}, {country}"` (e.g., "Enterprise, Alabama, United States")
