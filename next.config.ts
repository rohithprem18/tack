import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shakes these per-icon/per-component so dev compiles and the
  // client bundle stay small instead of pulling in the whole library.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
