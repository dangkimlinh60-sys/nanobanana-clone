/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep TS lenient per current project setup
  typescript: {
    ignoreBuildErrors: true,
  },
  // Avoid remote image optimization
  images: {
    unoptimized: true,
  },
  // Explicitly set workspace root to this project to avoid multi-lockfile warnings
  turbopack: {
    root: process.cwd(),
  },
  // Also set file-tracing root for `next start` warning parity
  outputFileTracingRoot: process.cwd(),
}

export default nextConfig
