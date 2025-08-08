import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[{
        protocol: 'https',
        hostname: '**', // Matches all hostnames
        port: '',
        pathname: '/**', // Matches all paths
      },]
  }
};

export default nextConfig;

