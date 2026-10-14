"use client";

import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api, getApiErrorMessage } from "@/lib/api";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";

type Field = "username" | "email" | "password";

export function RegisterForm() {
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const submitting = useRef(false);
	const router = useRouter();

	function updateField(field: Field, value: string) {
		setValues((previous) => ({ ...previous, [field]: value }));
		setErrors((previous) => ({ ...previous, [field]: undefined }));
		setError("");
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submitting.current) return;
		const username = values.username.trim();
		const email = values.email.trim();
		const nextErrors: Partial<Record<Field, string>> = {};
		if (username.length < 3 || username.length > 50)
			nextErrors.username = "Use a username between 3 and 50 characters.";
		if (
			!email ||
			!(event.currentTarget.elements.namedItem("email") as HTMLInputElement)
				.validity.valid
		)
			nextErrors.email = "Enter a valid email address.";
		if (
			!values.password.trim() ||
			values.password.length < 8 ||
			values.password.length > 72
		)
			nextErrors.password = "Use a password between 8 and 72 characters.";
		setErrors(nextErrors);
		setError("");
		const firstInvalid = (["username", "email", "password"] as const).find(
			(field) => nextErrors[field],
		);
		if (firstInvalid) {
			document.getElementById(`register-${firstInvalid}`)?.focus();
			return;
		}
		submitting.current = true;
		setLoading(true);
		try {
			const { data } = await api.post("/auth/register", {
				username,
				email,
				password: values.password,
			});
			if (data.success === true) router.replace("/login?registered=1");
			else
				setError(
					data.message || "We couldn't create your account. Please try again.",
				);
		} catch (err: unknown) {
			setError(
				getApiErrorMessage(
					err,
					"We couldn't create your account. Please try again.",
				),
			);
		} finally {
			submitting.current = false;
			setLoading(false);
		}
	}

	return (
		<>
			<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b786b]">
				Make room for better printing
			</p>
			<h1 className="text-4xl font-semibold tracking-[-1.5px] text-[#17252a] sm:text-[42px]">
				Start with Printar.
			</h1>
			<p className="mt-3 text-sm leading-7 text-[#667477]">
				Create your account. Bring customer documents into one workspace.
			</p>
			<form
				onSubmit={handleSubmit}
				noValidate
				aria-label="Create account"
				aria-busy={loading}
				className="mt-8 space-y-5"
			>
				<AuthField
					id="register-username"
					name="username"
					label="Username"
					placeholder="e.g. cityprint"
					icon={UserRound}
					autoComplete="username"
					autoCapitalize="none"
					spellCheck={false}
					required
					maxLength={50}
					value={values.username}
					disabled={loading}
					error={errors.username}
					hint="You'll use this to sign in. Choose 3–50 characters."
					onChange={(event) => updateField("username", event.target.value)}
				/>
				<AuthField
					id="register-email"
					name="email"
					label="Email address"
					placeholder="you@example.com"
					type="email"
					icon={Mail}
					autoComplete="email"
					autoCapitalize="none"
					spellCheck={false}
					required
					value={values.email}
					disabled={loading}
					error={errors.email}
					onChange={(event) => updateField("email", event.target.value)}
				/>
				<AuthField
					id="register-password"
					name="password"
					label="Password"
					placeholder="Create a password"
					type="password"
					icon={LockKeyhole}
					autoComplete="new-password"
					required
					maxLength={72}
					value={values.password}
					disabled={loading}
					error={errors.password}
					hint="Use 8–72 characters. You can show it to double-check."
					onChange={(event) => updateField("password", event.target.value)}
				/>
				{error && <AuthFeedback message={error} />}
				<Button
					type="submit"
					disabled={loading}
					className="h-12 w-full rounded-lg bg-[#173e35] text-sm font-medium text-white hover:bg-[#245347] focus-visible:ring-[#477c70]/30"
				>
					{loading ? "Creating your account…" : "Create account"}
					<ArrowRight size={17} aria-hidden="true" />
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-[#667477]">
				Already have an account?{" "}
				<Link
					href="/login"
					className="font-semibold text-[#275e4c] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#477c70]"
				>
					Sign in
				</Link>
			</p>
		</>
	);
}
