/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimization (reduced sizes for smaller builds)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920], // Reduced sizes to save memory
    imageSizes: [16, 32, 64, 96, 128, 256], // Reduced sizes
    minimumCacheTTL: 60,
  },

  // Performance optimizations (swcMinify is default in Next.js 13+)
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },

  // Output configuration for production
  output: 'standalone',
  
  // Experimental features (disabled optimizeCss to reduce build memory usage)
  // experimental: {
  //   optimizeCss: true, // Disabled - uses more memory during build
  // },
  
  // Webpack optimizations for smaller memory footprint
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Optimize client-side bundle
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },
};

export default nextConfig;
