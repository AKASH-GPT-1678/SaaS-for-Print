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
	await screen.findByRole("heading", { name: "Upload Room" });
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
		expect(screen.getByRole("button", { name: "Send Files" })).toBeDisabled();
		expect(screen.getByText("No files selected")).toBeInTheDocument();
		expect(fetch).not.toHaveBeenCalled();
	});

	it("lets the customer select and remove a document", async () => {
		const { user, input } = await renderUploadPage();
		await user.upload(
			input,
			new File(["hello"], "notes.txt", { type: "text/plain" }),
		);
		expect(screen.getByText("notes.txt")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Send Files" })).toBeEnabled();
		await user.click(screen.getByRole("button", { name: "Remove" }));
		expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Send Files" })).toBeDisabled();
	});

	it("sends the document to the right receiver and clears it after success", async () => {
		vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 200 }));
		const { user, input } = await renderUploadPage();
		const file = new File(["hello"], "notes.txt", { type: "text/plain" });
		await user.upload(input, file);
		await user.click(screen.getByRole("button", { name: "Send Files" }));
		expect(
			await screen.findByText("Files sent successfully."),
		).toBeInTheDocument();
		expect(fetch).toHaveBeenCalledOnce();
		const [url, options] = vi.mocked(fetch).mock.calls[0];
		expect(url).toBe("http://api.test/docs/upload");
		expect(options?.method).toBe("POST");
		const body = options?.body as FormData;
		expect(body.get("receiverId")).toBe(receiverId);
		expect(body.get("file")).toBe(file);
		expect(screen.getByText("No files selected")).toBeInTheDocument();
	});

	it("keeps the document selected and shows the backend error on failure", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ message: "Receiver not found" }), {
				status: 404,
			}),
		);
		const { user, input } = await renderUploadPage();
		await user.upload(
			input,
			new File(["hello"], "notes.txt", { type: "text/plain" }),
		);
		await user.click(screen.getByRole("button", { name: "Send Files" }));
		expect(await screen.findByText("Receiver not found")).toBeInTheDocument();
		expect(screen.getByText("notes.txt")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Send Files" })).toBeEnabled();
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
		await user.click(screen.getByRole("button", { name: "Send Files" }));
		const sendingButton = screen.getByRole("button", { name: "Sending..." });
		expect(sendingButton).toBeDisabled();
		await user.click(sendingButton);
		expect(fetch).toHaveBeenCalledOnce();
		await act(async () => {
			finishUpload(new Response("{}", { status: 200 }));
		});
		expect(
			await screen.findByText("Files sent successfully."),
		).toBeInTheDocument();
	});
});
