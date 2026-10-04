import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Keep the Playwright dev server separate from the normal dev/build output.
    distDir : process.env.PRINTAR_E2E === "1" ? "dist/e2e" : "dist"

 
}

export default nextConfig;
