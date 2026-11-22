/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_DIST_DIR lets a production build run alongside `next dev` without sharing .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin", "jwks-rsa"],
  },
};

module.exports = nextConfig;
