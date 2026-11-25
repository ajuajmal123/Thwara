import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy.pdf',
        permanent: true,
      },
    ]
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
