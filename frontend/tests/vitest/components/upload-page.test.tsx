import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UploadPage from "@/app/upload/[userid]/page";

// Component tests mock the API boundary; the Java backend is not required.
vi.mock("@/lib/api", () => ({ API_BASE_URL: "http://api.test" }));

const receiverId = "00000000-0000-4000-8000-000000000001";

async function renderUploadPage() {
	const user = userEvent.setup();
	const params = Promise.resolve({ userid: receiverId });
	await act(async () => {
		render(
			<Suspense fallback={<p>Loading upload room</p>}>
				<UploadPage params={params} />
			</Suspense>,
		);
	});
	await screen.findByRole("heading", {
		name: "Send your documents to the shop.",
	});
	const input = document.querySelector<HTMLInputElement>('input[type="file"]');
	if (!input) throw new Error("Upload input was not rendered");
	return { user, input };
}

describe("customer upload page", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});

	it("prevents sending when no document is selected", async () => {
		await renderUploadPage();
		expect(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		).toBeDisabled();
		expect(
			screen.getByText("Your selected files will appear here."),
		).toBeInTheDocument();
		expect(fetch).not.toHaveBeenCalled();
	});

	it("lets the customer select and remove a document", async () => {
		const { user, input } = await renderUploadPage();
		await user.upload(
			input,
			new File(["hello"], "notes.txt", { type: "text/plain" }),
		);
		expect(screen.getByText("notes.txt")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		).toBeEnabled();
		await user.click(screen.getByRole("button", { name: "Remove notes.txt" }));
		expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		).toBeDisabled();
	});

	it("sends the document to the right receiver and clears it after success", async () => {
		vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 200 }));
		const { user, input } = await renderUploadPage();
		const file = new File(["hello"], "notes.txt", { type: "text/plain" });
		await user.upload(input, file);
		await user.click(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		);
		expect(
			await screen.findByText("Files sent to the shop."),
		).toBeInTheDocument();
		expect(fetch).toHaveBeenCalledOnce();
		const [url, options] = vi.mocked(fetch).mock.calls[0];
		expect(url).toBe("http://api.test/docs/upload");
		expect(options?.method).toBe("POST");
		if (!options) throw new Error("Upload request options were not provided");
		const body = options.body as FormData;
		expect(body.get("receiverId")).toBe(receiverId);
		expect(body.get("file")).toBe(file);
		expect(body.has("note")).toBe(false);
		expect(
			screen.getByText("Your selected files will appear here."),
		).toBeInTheDocument();
	});

	it("sends the optional note with each selected file and clears it on success", async () => {
		vi.mocked(fetch).mockImplementation(async () => new Response("{}"));
		const { user, input } = await renderUploadPage();
		const note = screen.getByRole("textbox", {
			name: "Note for the shop (optional)",
		});
		await user.type(note, "  Aman, please print 2 copies  ");
		await user.upload(input, [
			new File(["first"], "first.txt", { type: "text/plain" }),
			new File(["second"], "second.txt", { type: "text/plain" }),
		]);
		await user.click(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		);
		await screen.findByText("Files sent to the shop.");
		expect(fetch).toHaveBeenCalledTimes(2);
		for (const [, options] of vi.mocked(fetch).mock.calls) {
			if (!options) throw new Error("Upload request options were not provided");
			expect((options.body as FormData).get("note")).toBe(
				"Aman, please print 2 copies",
			);
		}
		expect(note).toHaveValue("");
	});

	it("keeps the document selected and shows the backend error on failure", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ message: "Receiver not found" }), {
				status: 404,
			}),
		);
		const { user, input } = await renderUploadPage();
		const note = screen.getByRole("textbox", {
			name: "Note for the shop (optional)",
		});
		await user.type(note, "Please print 2 copies");
		await user.upload(
			input,
			new File(["hello"], "notes.txt", { type: "text/plain" }),
		);
		await user.click(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		);
		expect(await screen.findByText("Receiver not found")).toBeInTheDocument();
		expect(note).toHaveValue("Please print 2 copies");
		expect(screen.getByText("notes.txt")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		).toBeEnabled();
	});

	it("blocks duplicate submissions while the upload is pending", async () => {
		let finishUpload: (response: Response) => void = () => {};
		vi.mocked(fetch).mockImplementation(
			() =>
				new Promise<Response>((resolve) => {
					finishUpload = resolve;
				}),
		);
		const { user, input } = await renderUploadPage();
		await user.upload(
			input,
			new File(["hello"], "notes.txt", { type: "text/plain" }),
		);
		await user.click(
			screen.getByRole("button", {
				name: /Send \d+ files? to the shop|Choose documents to continue/,
			}),
		);
		const sendingButton = screen.getByRole("button", {
			name: "Sending your files…",
		});
		expect(sendingButton).toBeDisabled();
		await user.click(sendingButton);
		expect(fetch).toHaveBeenCalledOnce();
		await act(async () => {
			finishUpload(new Response("{}", { status: 200 }));
		});
		expect(
			await screen.findByText("Files sent to the shop."),
		).toBeInTheDocument();
	});
});
