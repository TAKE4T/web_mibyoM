import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wpmibyo.otemae-osu.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
