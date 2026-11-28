"use client";

import {
	Check,
	FileText,
	LockKeyhole,
	Plus,
	ShieldCheck,
	X,
} from "lucide-react";
import React, { use, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const Page = ({ params }: { params: Promise<{ userid: string }> }) => {
	const { userid } = use(params);

	const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
	const [note, setNote] = useState("");
	const [uploading, setUploading] = useState(false);
	const [status, setStatus] = useState("");
	const [sent, setSent] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;

		if (!selectedFiles?.length) return;

		// convert FileList → array and store
		setFiles((prev) => [
			...prev,
			...Array.from(selectedFiles, (file) => ({
				id: crypto.randomUUID(),
				file,
			})),
		]);
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((entry) => entry.id !== id));
	};
	const sendFiles = async () => {
		if (files.length === 0 || uploading) return;
		const trimmedNote = note.trim();
		setStatus("");
		setSent(false);
		setUploading(true);
		try {
			for (const { file } of files) {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("receiverId", userid);
				if (trimmedNote) formData.append("note", trimmedNote);

				const response = await fetch(`${API_BASE_URL}/docs/upload`, {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const payload = await response.json().catch(() => null);
					throw new Error(payload?.message || "Failed to upload");
				}
			}

			setFiles([]);
			setNote("");
			setStatus("Files sent to the shop.");
			setSent(true);
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Failed to upload");
		} finally {
			setUploading(false);
		}
	};
	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<main className="min-h-[100svh] bg-[#f6f7f1] font-sans text-[#173138]">
			<div
				className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-72 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute -right-20 -top-36 size-80 rounded-full bg-[#e4eddf]" />
				<div className="absolute -left-24 top-24 size-48 rounded-full bg-[#edf0e5]" />
			</div>
			<div className="relative mx-auto flex min-h-[100svh] w-full max-w-xl flex-col px-5 pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pb-10">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<span className="grid size-9 place-items-center rounded-xl bg-[#173f37] text-white">
							<FileText size={18} strokeWidth={2.2} />
						</span>
						<span className="text-lg font-semibold tracking-tight">
							Printar
						</span>
					</div>
					<div className="inline-flex items-center gap-1.5 rounded-full border border-[#dce5d8] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#527066]">
						<LockKeyhole size={13} /> Private upload
					</div>
				</header>

				<section className="mt-10 flex flex-1 flex-col sm:mt-14">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8377]">
						A simpler handoff
					</p>
					<h1 className="mt-3 max-w-sm text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl">
						Send your documents{" "}
						<span className="text-[#608773]">to the shop.</span>
					</h1>
					<p className="mt-3 max-w-sm text-sm leading-6 text-[#657775]">
						Choose your files and add a note if there’s anything the shop should
						know.
					</p>

					<input
						ref={inputRef}
						type="file"
						multiple
						accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
						onChange={handleFileChange}
						className="sr-only"
					/>
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className="mt-7 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#a9bca8] bg-white/80 px-5 py-5 text-center shadow-[0_8px_28px_rgba(31,59,45,0.04)] transition hover:border-[#668a75] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
					>
						<span className="grid size-11 place-items-center rounded-full bg-[#e8efe4] text-[#285747]">
							<Plus size={22} />
						</span>
						<span className="mt-3 text-sm font-semibold">
							{files.length ? "Add more documents" : "Choose documents"}
						</span>
						<span className="mt-1 text-xs text-[#75847d]">
							PDF, Word, Excel, PowerPoint, TXT or CSV
						</span>
					</button>

					<div className="mt-7">
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-sm font-semibold">Your documents</h2>
							<span className="rounded-full bg-[#e8eee4] px-2.5 py-1 text-xs font-medium text-[#587164]">
								{files.length} {files.length === 1 ? "file" : "files"}
							</span>
						</div>
						{files.length === 0 ? (
							<div className="flex items-center gap-3 rounded-xl border border-[#e3e8de] bg-white/65 px-4 py-4">
								<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f0f2eb] text-[#8a9b8e]">
									<FileText size={17} />
								</span>
								<p className="text-sm text-[#75817a]">
									Your selected files will appear here.
								</p>
							</div>
						) : (
							<ul className="space-y-2">
								{files.map(({ id, file }) => (
									<li
										key={id}
										className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e3e8de] bg-white px-3 py-3"
									>
										<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf2e9] text-[#587b68]">
											<FileText size={17} />
										</span>
										<span className="min-w-0 flex-1">
											<span className="block truncate text-sm font-medium">
												{file.name}
											</span>
											<span className="mt-0.5 block text-xs text-[#7d8982]">
												{(file.size / 1024).toFixed(0)} KB
											</span>
										</span>
										<button
											type="button"
											onClick={() => removeFile(id)}
											disabled={uploading}
											aria-label={`Remove ${file.name}`}
											className="grid size-10 shrink-0 place-items-center rounded-full text-[#788780] hover:bg-[#f4f5f0] focus-visible:outline-2 focus-visible:outline-[#477c70] disabled:opacity-40"
										>
											<X size={18} />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="mt-6">
						<label htmlFor="shop-note" className="text-sm font-semibold">
							Note for the shop{" "}
							<span className="font-normal text-[#7d8982]">(optional)</span>
						</label>
						<textarea
							id="shop-note"
							rows={2}
							maxLength={300}
							placeholder="e.g. Print 2 copies"
							value={note}
							disabled={uploading}
							onChange={(event) => setNote(event.target.value)}
							className="mt-2 block min-h-14 w-full resize-y rounded-xl border border-[#dce4d9] bg-white px-4 py-3 text-base text-[#173138] placeholder:text-[#9aa69d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70] disabled:bg-[#f0f2ed]"
						/>
					</div>

					<div className="mt-auto pt-7">
						<div className="mb-3 flex items-center justify-center gap-2 text-xs text-[#7b8b81]">
							<ShieldCheck size={15} className="text-[#62836e]" />
							<span>Your files go directly to the print shop.</span>
						</div>
						{status && (
							<p
								role="status"
								className={`mb-3 flex items-center justify-center gap-2 text-sm ${sent ? "text-[#28704e]" : "text-[#a14f40]"}`}
							>
								{sent && <Check size={16} />} {status}
							</p>
						)}
					</div>
				</section>
			</div>
			<div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e2e7de] bg-[#f8f8f3]/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mx-auto sm:w-full sm:max-w-xl sm:border-0 sm:bg-transparent sm:px-8 sm:pb-8 sm:pt-0 sm:backdrop-blur-none">
				<button
					type="button"
					onClick={sendFiles}
					disabled={files.length === 0 || uploading}
					className="mx-auto flex min-h-14 w-full max-w-xl items-center justify-center rounded-2xl bg-[#173f37] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(23,63,55,0.17)] transition hover:bg-[#245347] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70] disabled:cursor-not-allowed disabled:bg-[#c7d0c8] disabled:shadow-none"
				>
					{uploading
						? "Sending your files…"
						: files.length
							? `Send ${files.length} ${files.length === 1 ? "file" : "files"} to the shop`
							: "Choose documents to continue"}
				</button>
			</div>
		</main>
	);
};

export default Page;

// simple inline styles
