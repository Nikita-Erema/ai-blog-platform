import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ISR revalidation для блога
  experimental: {
    // Оптимизация для production
  },
};

export default nextConfig;
