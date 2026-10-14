import Link from "next/link";
import styles from "./printar-logo.module.css";

/** Shared vector wordmark for the landing page and authentication pages. */
export function PrintarLogo() {
	return (
		<Link href="/" aria-label="Printar home" className={styles.logo}>
			<span className={styles.mark}>
				<svg
					viewBox="0 0 280 318"
					width="24"
					height="24"
					fill="currentColor"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M136 6L256 73L264 78L268 85L267 137L132 60L125 61L93 79L71 98L69 117L73 131L81 148L92 160L101 160L114 149L144 94L151 92L268 161L267 231L141 305L125 301L11 235L6 228L6 175L141 252L149 251L179 234L202 215L205 207L203 187L193 164L181 152L173 152L163 159L130 218L123 220L6 151L8 80L136 6Z" />
				</svg>
			</span>
			<span>
				Printar<span className={styles.dot}>.</span>
			</span>
		</Link>
	);
}
