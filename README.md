# Weather

A weather app using Next.js, Mantine, Redux Toolkit, and Open-Meteo API.

⛈ View your local weather forecast: <https://weather.gregrickaby.com>

## Features

- **Individual City Pages**: Each location has its own shareable URL with SEO-friendly path segments
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
- `/forecast/{city}/{state}/{country}/{lat}/{lon}` - City weather page with coordinate path segments
  - Example: `/forecast/chicago/illinois/united-states/41.88/-87.63`
  - Example: `/forecast/new-york/new-york/united-states/40.71/-74.01`
  - Example: `/forecast/enterprise/alabama/united-states/31.32/-85.86`
  - Coordinates are rounded to 2 decimal places for clean URLs (~1km precision)
  - Each segment is URL-friendly (lowercase, hyphens instead of spaces)

---

## Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md) to get started.

---

## Credits

- React components by [Mantine](https://mantine.dev/)
- Weather icons by [@basmilius](https://github.com/basmilius/weather-icons)
- Weather data from [Open-Meteo](https://open-meteo.com/)

---
