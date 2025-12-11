const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Hide X-Powered-By header for security
  poweredByHeader: false,

  // Compress output
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Optimize packages - tree shake large libraries
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@mui/icons-material',
      '@mui/material',
      'recharts',
    ],
  },

  // Image optimization (enable for Vercel)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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

  // Add caching headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Reduce bundle size by not including source maps in production
  productionBrowserSourceMaps: false,
};

module.exports = withBundleAnalyzer(nextConfig);
