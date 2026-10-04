import { expect, test } from "@playwright/test";

test("customer can select and remove a document in the upload room", async ({
	page,
}) => {
	await page.goto("/upload/00000000-0000-4000-8000-000000000001");
	await expect(
		page.getByRole("heading", { name: "Upload Room" }),
	).toBeVisible();
	const sendButton = page.getByRole("button", { name: "Send Files" });
	await expect(sendButton).toBeDisabled();

	await page.locator('input[type="file"]').setInputFiles({
		name: "notes.txt",
		mimeType: "text/plain",
		buffer: Buffer.from("Printar browser smoke test"),
	});
	await expect(page.getByText("notes.txt", { exact: true })).toBeVisible();
	await expect(sendButton).toBeEnabled();

	await page.getByRole("button", { name: "Remove" }).click();
	await expect(
		page.getByText("No files selected", { exact: true }),
	).toBeVisible();
	await expect(sendButton).toBeDisabled();
});
