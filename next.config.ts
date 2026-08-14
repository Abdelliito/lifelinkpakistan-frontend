import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers configuration
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:",
          },
        ],
      },
    ];
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Rewrites for API requests
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite API calls to backend when needed
      ],
    };
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Optimization settings
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    minimumCacheTTL: 86400 * 365, // 1 year
  },

  // Disable X-Powered-By header
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
