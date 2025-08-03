import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "bankguru.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        hostname: "s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
