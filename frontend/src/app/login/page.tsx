import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
	title: "Sign in | Printar",
	description: "Sign in to your Printar workspace.",
};

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ registered?: string }>;
}) {
	const { registered } = await searchParams;
	return (
		<AuthShell>
			<LoginForm registered={registered === "1"} />
		</AuthShell>
	);
}
