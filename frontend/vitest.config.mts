import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/vitest/setup.ts"],
		include: ["tests/vitest/**/*.test.{ts,tsx}"],
		clearMocks: true,
		restoreMocks: true,
	},
});
