"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Input } from "@/components/ui/input";

type AuthFieldProps = ComponentProps<"input"> & {
	id: string;
	label: string;
	icon: LucideIcon;
	error?: string;
	hint?: string;
};

export function AuthField({
	id,
	label,
	icon: Icon,
	error,
	hint,
	type = "text",
	...props
}: AuthFieldProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const messageId = `${id}-message`;
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-2 block text-sm font-medium text-[#24383e]"
			>
				{label}
			</label>
			<div className="relative">
				<Icon
					className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#6a797b]"
					size={17}
					aria-hidden="true"
				/>
				<Input
					{...props}
					id={id}
					type={isPassword && showPassword ? "text" : type}
					aria-invalid={Boolean(error)}
					aria-describedby={error || hint ? messageId : undefined}
					className={`h-12 rounded-lg border-[#d9ddda] bg-white pl-11 text-base text-[#17252a] shadow-none placeholder:text-[#7b8586] focus-visible:border-[#477c70] focus-visible:ring-[#477c70]/20 md:text-sm ${isPassword ? "pr-12" : "pr-3"}`}
				/>
				{isPassword && (
					<button
						type="button"
						aria-label={showPassword ? "Hide password" : "Show password"}
						aria-pressed={showPassword}
						aria-controls={id}
						disabled={props.disabled}
						onClick={() => setShowPassword((shown) => !shown)}
						className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-[#607173] hover:bg-[#f0f3ee] hover:text-[#17252a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70] disabled:opacity-50"
					>
						{showPassword ? (
							<EyeOff size={18} aria-hidden="true" />
						) : (
							<Eye size={18} aria-hidden="true" />
						)}
					</button>
				)}
			</div>
			{(error || hint) && (
				<p
					id={messageId}
					className={`mt-2 text-xs leading-relaxed ${error ? "text-red-700" : "text-[#667477]"}`}
				>
					{error || hint}
				</p>
			)}
		</div>
	);
}
