"use client";

import {
	ArrowLeft,
	ArrowUpRight,
	Copy,
	Download,
	Eye,
	Pause,
	Pencil,
	Play,
	Plus,
	QrCode,
	Search,
	Trash2,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import CheckoutButton from "@/app/components/CheckoutButton";
import { getApiErrorMessage } from "@/lib/api";
import useQRCodes, { type SavedQr } from "@/lib/use-qr-code";
import { useAuthStore } from "@/stores/auth-store";
import styles from "./qr-manager.module.css";

type Code = {
	id: string;
	name: string;
	location: string;
	active: boolean;
	created: string;
	image?: string | null;
	qrCodeUrl?: string | null;
	paymentStatus?: SavedQr["paymentStatus"];
	generatedAt?: string | null;
};

function toCode(qr: SavedQr): Code {
	return {
		...qr,
		location: "Document upload",
		created: qr.createdAt.slice(0, 10),
	};
}

export default function QrManager() {
	const token = useAuthStore((s) => s.token);
	const hydrated = useAuthStore((s) => s.isHydrated);
	const router = useRouter();
	const [codes, setCodes] = useState<Code[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [loadError, setLoadError] = useState("");
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [notice, setNotice] = useState("");
	const [modal, setModal] = useState<"create" | "view" | null>(null);
	const [selected, setSelected] = useState<Code | null>(null);
	const [name, setName] = useState("");
	const dialog = useRef<HTMLDialogElement>(null);
	const {
		getQrCodes,
		createQr,
		resumeCheckout,
		retryGeneration,
		busy,
		error,
		progress,
	} = useQRCodes();
	async function refreshCodes() {
		try {
			const saved = await getQrCodes();
			setCodes(saved.map(toCode));
			setLoaded(true);
			setLoadError("");
		} catch (err) {
			setLoadError(
				getApiErrorMessage(err, "Could not load your QR collection."),
			);
		}
	}
	useEffect(() => {
		if (!hydrated || !token) return;
		let cancelled = false;
		const controller = new AbortController();
		void getQrCodes(controller.signal)
			.then((saved) => {
				if (!cancelled) {
					setCodes(saved.map(toCode));
					setLoaded(true);
					setLoadError("");
				}
			})
			.catch((err) => {
				if (!cancelled)
					setLoadError(
						getApiErrorMessage(err, "Could not load your QR collection."),
					);
			});
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [hydrated, token, getQrCodes]);
	useEffect(() => {
		if (hydrated && !token) router.replace("/login");
	}, [hydrated, token, router]);
	useEffect(() => {
		if (modal) dialog.current?.showModal();
		else dialog.current?.close();
	}, [modal]);
	const active = codes.filter((c) => c.active).length;
	const visible = codes.filter(
		(c) =>
			`${c.name} ${c.location}`.toLowerCase().includes(search.toLowerCase()) &&
			(filter === "all" || c.active === (filter === "active")),
	);
	function open(mode: typeof modal, code: Code | null = null) {
		setSelected(code);
		setName(code?.name ?? "");
		setModal(mode);
	}
	async function submitQr() {
		if (
			!dialog.current?.querySelector("form")?.reportValidity() ||
			!name.trim() ||
			busy
		)
			return;
		// Close the native dialog so the existing Razorpay checkout can receive input.
		setModal(null);
		dialog.current?.close();
		await createQr(name.trim());
		await refreshCodes();
	}
	function download() {
		if (!selected?.image) return;
		const anchor = document.createElement("a");
		anchor.href = selected.image;
		anchor.download = `printar-qr-${selected.id}.png`;
		anchor.click();
		setNotice("QR image downloaded.");
	}
	if (!hydrated || !token)
		return <main className={styles.page}>Loading your workspace…</main>;
	return (
		<main className={styles.page}>
			<Script
				src="https://checkout.razorpay.com/v1/checkout.js"
				onError={() =>
					setLoadError(
						"Payment checkout could not load. Please refresh and try again.",
					)
				}
			/>
			<div className={styles.topbar}>
				<Link href="/dashboard">
					<ArrowLeft size={16} /> Back to dashboard
				</Link>
				<span>
					YOUR WORKSPACE <span>/</span> QR CODES
				</span>
			</div>
			<div className={styles.container}>
				<header className={styles.header}>
					<div>
						<p className={styles.eyebrow}>A SMALL CODE. A SIMPLER HANDOFF.</p>
						<h1>
							Manage your <em>QR codes.</em>
						</h1>
						<p>Every counter, window, and touchpoint. All in one place.</p>
					</div>
					<button
						type="button"
						className={styles.primary}
						disabled={busy}
						onClick={() => open("create")}
					>
						<Plus size={18} /> Create QR code
					</button>
				</header>
				{(error || loadError) && (
					<div className={styles.error} role="alert">
						{error || loadError}
						<button
							type="button"
							onClick={() => void refreshCodes()}
							disabled={busy}
						>
							Refresh collection
						</button>
					</div>
				)}
				<p role="status" className={styles.notice}>
					{progress ||
						(!loaded && !loadError ? "Loading your QR collection…" : "")}
				</p>
				<section className={styles.stats} aria-label="QR summary">
					{[
						["Total QR codes", codes.length, "Your collection"],
						["Active", active, "Ready to share"],
						[
							"Not active",
							codes.length - active,
							"Paused or awaiting completion",
						],
					].map(([label, count, description]) => (
						<div key={label}>
							<span>{label}</span>
							<strong>{count}</strong>
							<small>{description}</small>
						</div>
					))}
					<aside>
						<QrCode size={27} />
						<div>
							<strong>Your shop’s front door.</strong>
							<p>Place a code where customers can easily find it.</p>
						</div>
					</aside>
				</section>
				<section
					className={styles.collection}
					aria-labelledby="collection-title"
				>
					<div className={styles.collectionHeading}>
						<div>
							<h2 id="collection-title">
								Your QR collection <span>{codes.length}</span>
							</h2>
							<p>A dedicated code for each place you share it.</p>
						</div>
						<label className={styles.search}>
							<Search size={17} />
							<input
								aria-label="Search QR codes"
								placeholder="Search by name or placement"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</label>
					</div>
					<div className={styles.filters}>
						{["all", "active", "paused"].map((value) => (
							<button
								type="button"
								key={value}
								aria-pressed={filter === value}
								onClick={() => setFilter(value)}
							>
								{value === "all" ? "All codes" : value}
							</button>
						))}
					</div>
					<div className={styles.grid}>
						{visible.map((code) => (
							<article className={styles.card} key={code.id}>
								<div className={styles.cardTop}>
									<span className={code.active ? styles.active : styles.paused}>
										{code.active
											? "Active"
											: code.paymentStatus === "PAID"
												? "Ready to generate"
												: "Payment pending"}
									</span>
									<button
										type="button"
										aria-label={`Edit ${code.name}`}
										disabled
										title="Editing saved codes is coming soon"
									>
										<Pencil size={16} />
									</button>
								</div>
								<button
									type="button"
									className={styles.preview}
									aria-label={`Preview ${code.name}`}
									disabled={!code.image}
									onClick={() => open("view", code)}
								>
									{code.image ? (
										<Image
											src={code.image}
											width={128}
											height={128}
											alt={`Upload QR for ${code.name}`}
											unoptimized
										/>
									) : (
										<QrCode size={80} />
									)}
									<span>
										{code.image
											? "SCAN TO SEND DOCUMENTS"
											: "COMPLETE PAYMENT TO GENERATE"}
									</span>
								</button>
								<div className={styles.cardBody}>
									<h3>{code.name}</h3>
									<p>{code.location || "No placement added"}</p>
									<div className={styles.metadata}>
										<span>Created {code.created}</span>
										<span>Document upload</span>
									</div>
									<div className={styles.cardActions}>
										{!code.image ? (
											<>
												<button
													type="button"
													disabled={busy}
													onClick={async () => {
														await retryGeneration(code.id);
														await refreshCodes();
													}}
												>
													{code.paymentStatus === "PAID"
														? "Generate QR"
														: "Check payment"}
												</button>
												{code.paymentStatus === "PENDING" && (
													<button
														type="button"
														disabled={busy}
														onClick={async () => {
															await resumeCheckout(code.id);
															await refreshCodes();
														}}
													>
														Resume checkout
													</button>
												)}
											</>
										) : (
											<button type="button" onClick={() => open("view", code)}>
												<Eye size={16} /> View code
											</button>
										)}
										<button
											type="button"
											disabled
											title="Pausing saved codes is coming soon"
											aria-label={`${code.active ? "Pause" : "Activate"} ${code.name}`}
										>
											{code.active ? <Pause size={16} /> : <Play size={16} />}
										</button>
										<button
											type="button"
											disabled
											title="Deleting saved codes is coming soon"
											className={styles.danger}
											aria-label={`Delete ${code.name}`}
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							</article>
						))}
						{loaded && (!codes.length || (!search && filter === "all")) && (
							<button
								type="button"
								className={styles.addCard}
								disabled={busy}
								onClick={() => open("create")}
							>
								<span>
									<Plus size={24} />
								</span>
								<strong>
									{codes.length ? "Add another QR code" : "No QR codes yet"}
								</strong>
								<p>
									{codes.length
										? "Create a code for another spot in your shop."
										: "Create your first QR code for customers to send documents."}
								</p>
								<b>
									Create QR code <ArrowUpRight size={16} />
								</b>
							</button>
						)}
					</div>
					{codes.length > 0 && visible.length === 0 && (
						<div className={styles.empty}>
							<QrCode size={32} />
							<h3>No matching codes</h3>
							<p>Try a different search or filter.</p>
						</div>
					)}
				</section>
				<footer className={styles.footer}>
					<QrCode size={18} />
					<p>
						<strong>Make it easy to scan.</strong> Place your printed code at
						eye level, keep the area well lit, and leave space around its edges.
					</p>
					<span>PRINTAR / QR WORKSPACE</span>
				</footer>
				<p className={styles.notice} role="status">
					{notice}
				</p>
			</div>
			<dialog
				ref={dialog}
				className={styles.dialog}
				onCancel={() => setModal(null)}
				onClose={() => setModal(null)}
			>
				<button
					type="button"
					className={styles.close}
					aria-label="Close dialog"
					onClick={() => setModal(null)}
				>
					<X size={20} />
				</button>
				{modal === "create" && (
					<form
						onSubmit={(event) => {
							event.preventDefault();
							void submitQr();
						}}
					>
						<p className={styles.eyebrow}>YOUR NEXT TOUCHPOINT</p>
						<h2>Create a QR code</h2>
						<p>Give this code a name that is easy to recognise.</p>
						<label>
							Name
							<input
								autoFocus
								required
								maxLength={80}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Front counter"
							/>
						</label>
						<small>
							Continue to payment. Your QR is generated after payment is
							verified. The amount is shown in checkout.
						</small>
						<CheckoutButton
							className={styles.primary}
							disabled={busy}
							label="Pay & create QR"
							onPayment={submitQr}
						/>
					</form>
				)}
				{modal === "view" && selected && (
					<div>
						<p className={styles.eyebrow}>QR PREVIEW</p>
						<h2>{selected.name}</h2>
						<p>{selected.location}</p>
						<div className={styles.largeQr}>
							{selected.image && (
								<Image
									src={selected.image}
									width={220}
									height={220}
									alt={`Upload QR for ${selected.name}`}
									unoptimized
								/>
							)}
						</div>
						<p>Customers can scan this code to send documents to your shop.</p>
						<div className={styles.dialogActions}>
							<button
								type="button"
								className={styles.primary}
								onClick={download}
							>
								<Download size={16} /> Download QR PNG
							</button>
							<button
								type="button"
								disabled={!selected.qrCodeUrl}
								onClick={async () => {
									if (!selected.qrCodeUrl) return;
									try {
										await navigator.clipboard.writeText(selected.qrCodeUrl);
										setNotice("Shop upload link copied.");
									} catch {
										setNotice(
											"Clipboard unavailable. Please try again in a supported browser.",
										);
									}
								}}
							>
								<Copy size={16} /> Copy upload link
							</button>
						</div>
					</div>
				)}
			</dialog>
		</main>
	);
}
