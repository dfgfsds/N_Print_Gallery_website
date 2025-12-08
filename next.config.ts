import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ disables eslint errors during build
  },
};

export default nextConfig;
