import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      ? [{
          protocol: "https",
          hostname: "firebasestorage.googleapis.com",
          pathname: `/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/**`,
        }]
      : [],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
