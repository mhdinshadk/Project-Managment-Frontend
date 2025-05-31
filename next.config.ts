import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**', // Adjust the pathname to match your image path
      },
       {
      protocol: 'https',
      hostname: 'project-managment-backend-r4hz.onrender.com',
      pathname: '/uploads/**',
    },
    ],
  },
};

export default nextConfig;
