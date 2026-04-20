import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle pdf-parse and canvas dependencies
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  serverExternalPackages: ['pdf-parse'],
  turbopack: {},
};

export default nextConfig;
