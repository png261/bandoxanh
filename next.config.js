/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Support for environment variables
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  async redirects() {
    return [
      {
        source: '/calories',
        destination: '/scan?tab=calories',
        permanent: true,
      },
      {
        source: '/identify',
        destination: '/scan?tab=waste',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
