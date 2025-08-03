/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Removed `appDir: true,` from the `experimental` object.
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
}

export default nextConfig
