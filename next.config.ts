import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
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
