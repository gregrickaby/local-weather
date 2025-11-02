# Weather

A weather app using Next.js, Mantine, Redux Toolkit, and Open-Meteo API.

⛈ View your local weather forecast: <https://weather.gregrickaby.com>

## Features

- **Individual City Pages**: Each location has its own shareable URL (e.g., `/new-york-new-york-united-states`)
- **SEO Optimized**: Dynamic metadata for each city page with Open Graph support
- **Fast Navigation**: Client-side routing with Next.js App Router
- **Static Generation**: Popular cities are pre-rendered at build time
- **Smart Search**: Location autocomplete with favorites support
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Weather**: Current conditions, hourly forecast, and 10-day outlook
- **Detailed Metrics**: Temperature, wind, humidity, UV index, air quality, and more
- **Weather Radar**: Interactive map showing precipitation

## URL Structure

- `/` - Home page (redirects to last viewed or default location)
- `/{location-slug}` - City weather page
  - Example: `/chicago-illinois-united-states`
  - Example: `/new-york-new-york-united-states`

---

## Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md) to get started.

---

## Credits

- React components by [Mantine](https://mantine.dev/)
- Weather icons by [@basmilius](https://github.com/basmilius/weather-icons)
- Weather data from [Open-Meteo](https://open-meteo.com/)

---
