import { expect, test } from "@playwright/test";

test("sign-in validates fields, handles errors, and opens the workspace", async ({
	page,
}) => {
	let attempts = 0;
	await page.route("**/auth/login", async (route) => {
		attempts += 1;
		expect(route.request().postDataJSON()).toEqual({
			username: "cityprint",
			password: "printar-password",
		});
		await route.fulfill({
			status: attempts === 1 ? 401 : 200,
			json:
				attempts === 1
					? { message: "Invalid username or password" }
					: {
							token: "test-token",
							userid: "00000000-0000-4000-8000-000000000001",
						},
		});
	});
	await page.goto("/login");
	await page.getByRole("button", { name: "Sign in", exact: true }).click();
	await expect(
		page.getByText("Enter your username.", { exact: true }),
	).toBeVisible();
	await expect(page.getByLabel("Username", { exact: true })).toBeFocused();
	expect(attempts).toBe(0);
	await page.getByLabel("Username", { exact: true }).fill("cityprint");
	await page.getByLabel("Password", { exact: true }).fill("printar-password");
	await page.getByRole("button", { name: "Show password" }).click();
	await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
		"type",
		"text",
	);
	await page.getByRole("button", { name: "Hide password" }).click();
	await page.getByLabel("Password", { exact: true }).press("Enter");
	await expect(
		page.getByRole("form", { name: "Sign in" }).getByRole("alert"),
	).toHaveText("Invalid username or password");
	await expect(
		page.getByRole("button", { name: "Sign in", exact: true }),
	).toBeEnabled();
	await page.getByLabel("Password", { exact: true }).press("Enter");
	await expect(page).toHaveURL(/\/dashboard$/);
	expect(attempts).toBe(2);
});

test("registration validates locally and confirms account creation on sign-in", async ({
	page,
}) => {
	let attempts = 0;
	await page.route("**/auth/register", async (route) => {
		attempts += 1;
		expect(route.request().postDataJSON()).toEqual({
			username: "cityprint",
			email: "owner@example.com",
			password: "printar-password",
		});
		await route.fulfill({
			status: attempts === 1 ? 400 : 200,
			json:
				attempts === 1
					? { message: "Username is already taken" }
					: { success: true },
		});
	});
	await page.goto("/register");
	await page.getByLabel("Username", { exact: true }).fill("a");
	await page.getByLabel("Email address").fill("invalid-email");
	await page.getByLabel("Password", { exact: true }).fill("short");
	await page
		.getByRole("button", { name: "Create account", exact: true })
		.click();
	await expect(
		page.getByText("Use a username between 3 and 50 characters."),
	).toBeVisible();
	await expect(page.getByText("Enter a valid email address.")).toBeVisible();
	await expect(
		page.getByText("Use a password between 8 and 72 characters."),
	).toBeVisible();
	expect(attempts).toBe(0);
	await page.getByLabel("Username", { exact: true }).fill("cityprint");
	await page.getByLabel("Email address").fill("owner@example.com");
	await page.getByLabel("Password", { exact: true }).fill("printar-password");
	await page.getByLabel("Password", { exact: true }).press("Enter");
	await expect(
		page.getByRole("form", { name: "Create account" }).getByRole("alert"),
	).toHaveText("Username is already taken");
	await page
		.getByRole("button", { name: "Create account", exact: true })
		.click();
	await expect(page).toHaveURL(/\/login\?registered=1$/);
	await expect(page.getByRole("status")).toHaveText(
		"Your account is ready. Sign in with your new username and password.",
	);
	expect(attempts).toBe(2);
});

test("auth pages fit desktop and mobile screens", async ({
	page,
}, testInfo) => {
	for (const viewport of [
		{ name: "desktop", width: 1440, height: 960 },
		{ name: "mobile", width: 390, height: 844 },
	]) {
		await page.setViewportSize({
			width: viewport.width,
			height: viewport.height,
		});
		for (const [path, heading] of [
			["/login", "Welcome back."],
			["/register", "Start with Printar."],
		]) {
			await page.goto(path);
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
			await expect(page.getByLabel("Username", { exact: true })).toBeVisible();
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= window.innerWidth,
				),
			).toBe(true);
			const panel = page.getByRole("complementary", { name: "About Printar" });
			if (viewport.name === "mobile") await expect(panel).toBeHidden();
			else await expect(panel).toBeVisible();
			await page.screenshot({
				path: testInfo.outputPath(`${path.slice(1)}-${viewport.name}.png`),
				fullPage: true,
			});
		}
	}
	await page.setViewportSize({ width: 320, height: 568 });
	for (const path of ["/login", "/register"]) {
		await page.goto(path);
		await expect(page.getByLabel("Username", { exact: true })).toBeVisible();
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
	}
});
