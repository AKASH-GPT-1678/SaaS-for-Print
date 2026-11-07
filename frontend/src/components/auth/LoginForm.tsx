"use client";

import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";

export function LoginForm({ registered = false }: { registered?: boolean }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const submitting = useRef(false);
	const login = useAuthStore((state) => state.login);
	const router = useRouter();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submitting.current) return;
		const emailInput = event.currentTarget.elements.namedItem(
			"email",
		) as HTMLInputElement;
		const nextErrors = {
			email:
				email.trim() && emailInput.validity.valid
					? undefined
					: "Enter a valid email address.",
			password: password.trim() ? undefined : "Enter your password.",
		};
		setErrors(nextErrors);
		setError("");
		const firstInvalid = nextErrors.email
			? "login-email"
			: nextErrors.password
				? "login-password"
				: null;
		if (firstInvalid) {
			document.getElementById(firstInvalid)?.focus();
			return;
		}
		submitting.current = true;
		setLoading(true);
		try {
			const { data } = await api.post("/auth/login", {
				email: email.trim().toLowerCase(),
				password,
			});
			if (
				typeof data.token !== "string" ||
				!data.token ||
				typeof data.userid !== "string" ||
				!data.userid
			) {
				setError("We couldn't sign you in. Please try again.");
				return;
			}
			login(data.token, data.userid);
			router.replace("/dashboard");
		} catch (err: unknown) {
			setError(
				getApiErrorMessage(err, "We couldn't sign you in. Please try again."),
			);
		} finally {
			submitting.current = false;
			setLoading(false);
		}
	}

	return (
		<>
			<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b786b]">
				Your shop, a little simpler
			</p>
			<h1 className="text-4xl font-semibold tracking-[-1.5px] text-[#17252a] sm:text-[42px]">
				Welcome back.
			</h1>
			<p className="mt-3 text-sm leading-7 text-[#667477]">
				Sign in to your Printar workspace and pick up where you left off.
			</p>
			<form
				onSubmit={handleSubmit}
				noValidate
				aria-label="Sign in"
				aria-busy={loading}
				className="mt-8 space-y-5"
			>
				{registered && (
					<AuthFeedback
						kind="success"
						message="Your account is ready. Sign in with your email and password."
					/>
				)}
				<AuthField
					id="login-email"
					name="email"
					label="Email address"
					placeholder="Your email address"
					icon={Mail}
					type="email"
					autoComplete="email"
					autoCapitalize="none"
					spellCheck={false}
					required
					value={email}
					disabled={loading}
					error={errors.email}
					onChange={(event) => {
						setEmail(event.target.value);
						setErrors((previous) => ({ ...previous, email: undefined }));
						setError("");
					}}
				/>
				<AuthField
					id="login-password"
					name="password"
					label="Password"
					placeholder="Your password"
					icon={LockKeyhole}
					type="password"
					autoComplete="current-password"
					required
					value={password}
					disabled={loading}
					error={errors.password}
					onChange={(event) => {
						setPassword(event.target.value);
						setErrors((previous) => ({ ...previous, password: undefined }));
						setError("");
					}}
				/>
				{error && <AuthFeedback message={error} />}
				<Button
					type="submit"
					disabled={loading}
					className="h-12 w-full rounded-lg bg-[#173e35] text-sm font-medium text-white hover:bg-[#245347] focus-visible:ring-[#477c70]/30"
				>
					{loading ? "Signing in…" : "Sign in"}
					<ArrowRight size={17} aria-hidden="true" />
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-[#667477]">
				New to Printar?{" "}
				<Link
					href="/register"
					className="font-semibold text-[#275e4c] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#477c70]"
				>
					Create an account
				</Link>
			</p>
		</>
	);
}
