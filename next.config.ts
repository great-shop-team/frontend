import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://www.gstatic.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https://accounts.google.com https://apis.google.com",
              "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://api-shop-p3de.onrender.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
