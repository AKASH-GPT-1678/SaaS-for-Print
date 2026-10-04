import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
	it("keeps conditional classes only when enabled", () => {
		expect(
			cn("base", false && "hidden", { active: true, disabled: false }),
		).toBe("base active");
	});

	it("lets a caller override conflicting Tailwind styles", () => {
		expect(cn("px-4 text-red-500", "px-2 text-blue-500")).toBe(
			"px-2 text-blue-500",
		);
	});
});
