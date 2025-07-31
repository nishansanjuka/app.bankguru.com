import type { NextConfig } from "next";
// Optional: create a custom agent to use in fetch (for development with self-signed certs)
// if (process.env.NODE_ENV === "development") {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // globally bypass SSL verification (use with care)
// }

const nextConfig: NextConfig = {
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
    ],
  },
  webpack(config, { isServer }) {
    // This is optional unless you're using custom https.Agent in server-only code
    if (isServer) {
      config.resolve.alias["https-agent"] = require.resolve("https");
    }
    return config;
  },
};

export default nextConfig;
