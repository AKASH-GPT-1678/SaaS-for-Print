import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
	title: "Create account | Printar",
	description:
		"Create your Printar account and simplify your printing workflow.",
};

export default function RegisterPage() {
	return (
		<AuthShell>
			<RegisterForm />
		</AuthShell>
	);
}
