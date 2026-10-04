import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL || "http://127.0.0.1:3100";

export default defineConfig({
	testDir: "./tests/playwright",
	testMatch: "**/*.spec.ts",
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: externalBaseURL
		? undefined
		: {
				command: "pnpm run dev --port 3100 --hostname 127.0.0.1",
				url: `${baseURL}/upload/00000000-0000-4000-8000-000000000001`,
				timeout: 120_000,
				reuseExistingServer: false,
				env: { PRINTAR_E2E: "1" },
			},
});
