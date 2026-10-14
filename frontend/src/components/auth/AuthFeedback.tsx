import { CircleAlert, CircleCheck } from "lucide-react";

export function AuthFeedback({
	message,
	kind = "error",
}: {
	message: string;
	kind?: "error" | "success";
}) {
	const Icon = kind === "error" ? CircleAlert : CircleCheck;
	return (
		<div
			role={kind === "error" ? "alert" : "status"}
			className={`flex items-start gap-2.5 rounded-lg border p-3 text-sm leading-relaxed ${kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-[#d1e1cf] bg-[#edf5ea] text-[#305b3b]"}`}
		>
			<Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
			<p>{message}</p>
		</div>
	);
}
