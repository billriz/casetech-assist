import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@google-cloud/discoveryengine",
    "@google-cloud/storage",
    "google-auth-library",
    "google-gax",
  ],
};

export default nextConfig;
