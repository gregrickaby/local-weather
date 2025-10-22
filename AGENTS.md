# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

A weather application built with Next.js 15 (App Router), Mantine UI, and integrates with Open-Meteo and Google Maps APIs. The app is deployed to Coolify (using Nixpacks) at <https://weather.gregrickaby.com>.

## Common Commands

### Development

```bash
npm run dev          # Start dev server (cleans .next directory first)
npm run build        # Build for production
npm run start        # Start production server
npm run format       # Format code with Prettier
```

### Validation

Run these before committing or creating PRs:

```bash
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

Both commands must pass without errors.

### Local Testing

The app uses standard Next.js dev server. Edge Functions can be tested locally with `npm run dev`.

## Required Environment Variables

Create `.env` from `.env.example`:

- `GOOGLE_MAPS_API_KEY` - For geocoding and Places Autocomplete

**Note:** Weather data comes from Open-Meteo, which is free and requires no API key.

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **UI**: Mantine v8 component library. Use Mantine primitives. Fetch official docs: <https://mantine.dev/llms.txt>
- **SWR**: For data fetching

### Data Flow

1. **User Input** → Search component queries `/api/places` for location autocomplete (Google Places API)
2. **Location Selection** → Dispatched to Redux store, saved to localStorage via middleware
3. **Weather Fetch** → RTK Query fetches from `/api/weather` (geocodes location via Google Maps API, then fetches forecast from Open-Meteo API)
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

**Component Structure**

- `app/layout.tsx` - Root layout with Mantine provider and StoreProvider
- `app/page.tsx` - Client component assembling all UI components
- `components/` - Presentational components (Header, Search, CurrentConditions, Forecast, Alerts, etc.)
- `components/Providers/StoreProvider.tsx` - Redux store provider
- All components consume state via Redux hooks (`useAppSelector`, `useAppDispatch`)

### TypeScript Configuration

- Uses path alias `@/*` mapping to project root
- `strict: false` in tsconfig.json
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
  - Peer review
- Uses Lefthook for git hooks (see `.lefthook.yml` if present)

## Deployment

- Deployed to Coolify at <https://weather.gregrickaby.com>
- Uses Nixpacks for building and deployment
- Pushes to `main` branch trigger automatic deployments

## API Integration Notes

- Open-Meteo: Free weather API, no key required. Returns current conditions, hourly forecasts (up to 16 days), and daily forecasts. Uses WMO weather codes for conditions.
- Google Maps: Requires Geocoding API and Places API to be enabled with proper restrictions. API key must have "None" or "IP addresses" restriction (not "Websites") for server-side usage.
- Weather icons mapped from WMO codes to existing icon set via `getWeatherInfo()` helper in `lib/helpers.ts`
