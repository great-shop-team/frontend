import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Дозволяємо роботу з Google та стандартними джерелами
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com; frame-src 'self' https://accounts.google.com; connect-src 'self' https://accounts.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
