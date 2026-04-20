import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'canvas'],
  turbopack: {},
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
