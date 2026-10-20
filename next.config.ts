import type { NextConfig } from "next";

// Static export for GitHub Pages. For a project site served from
// https://<user>.github.io/<repo>, set NEXT_PUBLIC_BASE_PATH=/<repo> at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
