"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { setToken, setUserId } from "@/app/redux/redux-setup";
import { Button } from "@/components/ui/button";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppDispatch } from "@/lib/hooks";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";

export function LoginForm({ registered = false }: { registered?: boolean }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		username?: string;
		password?: string;
	}>({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const submitting = useRef(false);
	const dispatch = useAppDispatch();
	const router = useRouter();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submitting.current) return;
		const nextErrors = {
			username: username.trim() ? undefined : "Enter your username.",
			password: password.trim() ? undefined : "Enter your password.",
		};
		setErrors(nextErrors);
		setError("");
		const firstInvalid = nextErrors.username
			? "login-username"
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
				username: username.trim(),
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
			dispatch(setToken(data.token));
			dispatch(setUserId(data.userid));
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
						message="Your account is ready. Sign in with your new username and password."
					/>
				)}
				<AuthField
					id="login-username"
					name="username"
					label="Username"
					placeholder="Your username"
					icon={UserRound}
					autoComplete="username"
					autoCapitalize="none"
					spellCheck={false}
					required
					value={username}
					disabled={loading}
					error={errors.username}
					onChange={(event) => {
						setUsername(event.target.value);
						setErrors((previous) => ({ ...previous, username: undefined }));
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
