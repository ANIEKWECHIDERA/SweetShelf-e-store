import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sweetshelf/shared-types", "@sweetshelf/shared-ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },

};

export default nextConfig;
