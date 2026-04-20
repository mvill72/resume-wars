import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ['pdf-parse', 'canvas'],
  webpack: (config, { isServer }) => {
    // Handle pdf-parse and canvas dependencies
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
