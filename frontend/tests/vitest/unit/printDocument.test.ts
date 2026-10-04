import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { printDocument } from "@/lib/printDocument";

describe("printDocument", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal(
			"URL",
			Object.assign(class extends URL {}, {
				createObjectURL: vi.fn().mockReturnValue("blob:http://localhost/print"),
				revokeObjectURL: vi.fn(),
			}),
		);
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		document
			.querySelectorAll('iframe[title="Print document"]')
			.forEach((frame) => {
				frame.remove();
			});
	});

	function loadedFrame() {
		const iframe = document.querySelector<HTMLIFrameElement>(
			'iframe[title="Print document"]',
		);
		if (!iframe?.contentWindow) throw new Error("Print frame was not created");
		const focus = vi
			.spyOn(iframe.contentWindow, "focus")
			.mockImplementation(() => {});
		const print = vi
			.spyOn(iframe.contentWindow, "print")
			.mockImplementation(() => {});
		iframe.dispatchEvent(new Event("load"));
		return { iframe, focus, print };
	}

	it("waits for the document to load before requesting print", () => {
		printDocument("/document.pdf");
		const { focus, print } = loadedFrame();
		expect(print).not.toHaveBeenCalled();
		vi.advanceTimersByTime(500);
		expect(focus).toHaveBeenCalledOnce();
		expect(print).toHaveBeenCalledOnce();
	});

	it("releases its own Blob URL and frame after the print request", () => {
		const blob = new Blob(["document"], { type: "application/pdf" });
		printDocument(blob);
		const { iframe } = loadedFrame();
		expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
		expect(URL.revokeObjectURL).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1_500);
		expect(iframe.isConnected).toBe(false);
		expect(URL.revokeObjectURL).toHaveBeenCalledWith(
			"blob:http://localhost/print",
		);
	});

	it("leaves caller-owned Blob URLs available for preview reuse", () => {
		printDocument("blob:http://localhost/caller-owned");
		const { iframe } = loadedFrame();
		vi.advanceTimersByTime(1_500);
		expect(iframe.isConnected).toBe(false);
		expect(URL.createObjectURL).not.toHaveBeenCalled();
		expect(URL.revokeObjectURL).not.toHaveBeenCalled();
	});
});
