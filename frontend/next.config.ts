import type { NextConfig } from "next";

const nextConfig: NextConfig =
	process.env.PRINTAR_E2E === "1"
		? {
				// Keep the Playwright dev server separate from the normal dev/build output.
				distDir: "dist/e2e",
			}
		: {};

export default nextConfig;
