import { ArrowLeft, Check, FileText, Printer, QrCode } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PrintarLogo } from "@/components/brand/PrintarLogo";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: ReactNode }) {
	return (
		<div className={styles.shell}>
			<div className={styles.main}>
				<header className={styles.header}>
					<PrintarLogo />
					<Link href="/" className={styles.back}>
						<ArrowLeft size={14} aria-hidden="true" /> Back to home
					</Link>
				</header>
				<main className={styles.formArea}>
					<div className={styles.formContent}>{children}</div>
				</main>
				<footer className={styles.footer}>
					Built for the work behind every print.
				</footer>
			</div>
			<aside className={styles.aside} aria-label="About Printar">
				<div className={styles.asideContent}>
					<p className={styles.eyebrow}>A little less counter chaos</p>
					<h2 className={styles.headline}>
						Good prints start
						<br />
						with a <span>simpler workflow.</span>
					</h2>
					<p className={styles.description}>
						Give customer files a place of their own. Receive documents through
						a QR code and keep the next print within reach.
					</p>
					<div className={styles.illustration} aria-hidden="true">
						<div className={styles.uploadBadge}>
							<QrCode size={18} /> Scan &amp; send
						</div>
						<div className={styles.document}>
							<div className={styles.documentHeader}>
								<FileText size={18} /> Customer document
							</div>
							<div className={styles.documentLine} />
							<div className={styles.documentLine} />
							<div className={styles.documentLine} />
							<div className={styles.documentLine} />
							<div className={styles.documentFooter}>
								<Check size={13} /> File received
							</div>
						</div>
						<div className={styles.printBadge}>
							<Printer size={17} /> Next up: print
						</div>
					</div>
					<ol className={styles.steps}>
						{[
							["01", "Share your QR", "One place to send files."],
							["02", "Receive documents", "Less searching through chats."],
							["03", "Get to printing", "Keep the counter moving."],
						].map(([number, title, text]) => (
							<li key={number}>
								<p className={styles.stepNumber}>{number}</p>
								<p className={styles.stepTitle}>{title}</p>
								<p className={styles.stepText}>{text}</p>
							</li>
						))}
					</ol>
				</div>
			</aside>
		</div>
	);
}
