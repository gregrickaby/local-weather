/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.weather.gov', 'radar.weather.gov']
  }
}

module.exports = nextConfig
