/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.weather.gov', 'radar.weather.gov', 'openweathermap.org'],
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig
