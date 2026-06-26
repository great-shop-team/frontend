import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Здесь могут быть ваши другие старые настройки (например, reactStrictMode, experimental и т.д.) */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.synthetic.com.ua',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
