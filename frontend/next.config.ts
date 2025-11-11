import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.mibyo.otemae-osu.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
