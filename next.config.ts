// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ['images.unsplash.com'],
//   },
// };
// module.exports = nextConfig;
// export default nextConfig;
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
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000", // Assuming API might be here just in case
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "armored-api.qubyt.codes",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
