"use client";

import {
	ArrowDownToLine,
	ArrowLeft,
	ArrowUpRight,
	Check,
	FileText,
	Inbox,
	MessageSquareText,
	Printer,
	Search,
	ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { printDocument } from "@/lib/printDocument";
import {
	connectSocket,
	disconnectSocket,
	type FileNotification,
} from "@/lib/socket";
import { useAuthStore } from "@/stores/auth-store";

type InboxItem = {
	file: FileNotification;
	receivedAt: number;
	fileUrl: string;
};

const ChatPage = () => {
	const userId = useAuthStore((state) => state.userId);
	const token = useAuthStore((state) => state.token);
	return (
		<FileInbox key={token ? userId : null} userId={userId} token={token} />
	);
};

function FileInbox({
	userId,
	token,
}: {
	userId: string | null;
	token: string | null;
}) {
	const [items, setItems] = useState<InboxItem[]>([]);
	const [connected, setConnected] = useState(false);
	const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
	const objectUrls = useRef(new Set<string>());

	useEffect(() => {
		if (!userId || !token) return;

		connectSocket(
			userId,
			token,
			(file) => {
				const bytes = Uint8Array.from(atob(file.fileData), (char) =>
					char.charCodeAt(0),
				);
				const blob = new Blob([bytes], { type: file.contentType });
				const fileUrl = URL.createObjectURL(blob);
				objectUrls.current.add(fileUrl);
				setItems((current) => {
					if (
						current.some((item) => item.file.documentId === file.documentId)
					) {
						URL.revokeObjectURL(fileUrl);
						objectUrls.current.delete(fileUrl);
						return current;
					}
					return [
						{
							file,
							receivedAt: Date.now(),
							fileUrl,
						},
						...current,
					];
				});
				setSelectedUrl(file.documentId);
			},
			setConnected,
		);

		return () => {
			setConnected(false);
			disconnectSocket();
			for (const fileUrl of objectUrls.current) URL.revokeObjectURL(fileUrl);
			objectUrls.current.clear();
		};
	}, [userId, token]);

	const filteredItems = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return items;
		return items.filter(({ file }) =>
			`${file.fileName} ${file.note ?? ""}`.toLowerCase().includes(query),
		);
	}, [items, search]);

	const selectedItem =
		filteredItems.find((item) => item.file.documentId === selectedUrl) ??
		filteredItems[0] ??
		null;

	function openItem(item: InboxItem) {
		setSelectedUrl(item.file.documentId);
		setMobileDetailOpen(true);
	}

	return (
		<main className="min-h-screen bg-[#f2f4ef] p-3 font-sans text-[#173138] sm:p-5 lg:p-7">
			<div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1480px] flex-col overflow-hidden rounded-2xl border border-[#dfe6dc] bg-[#fafbf8] shadow-[0_18px_60px_rgba(27,52,43,0.08)]">
				<header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-7">
					<div className="flex items-center gap-3">
						<span className="grid size-10 place-items-center rounded-xl bg-[#173f37] text-white">
							<MessageSquareText size={19} />
						</span>
						<div>
							<p className="text-[15px] font-semibold tracking-tight">
								Printar
							</p>
							<p className="text-xs text-[#788780]">Shop inbox</p>
						</div>
					</div>
					<div className="flex items-center gap-2 rounded-full bg-[#eef3ec] px-3 py-2 text-xs font-medium text-[#486b59]">
						<span className="relative flex size-2">
							{connected && (
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#59a174] opacity-40 motion-reduce:animate-none" />
							)}
							<span
								className={`relative inline-flex size-2 rounded-full ${connected ? "bg-[#4f9569]" : "bg-[#b38b4b]"}`}
							/>
						</span>
						{connected ? "Live inbox" : "Connecting"}
					</div>
				</header>

				<div className="grid min-h-[calc(100vh-8rem)] flex-1 grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)]">
					<aside
						className={`flex min-h-0 flex-col border-r border-[#e4e9e1] bg-white ${mobileDetailOpen ? "hidden md:flex" : "flex"}`}
						aria-label="Incoming documents"
					>
						<div className="border-b border-[#edf0eb] px-5 pb-4 pt-6 sm:px-6">
							<div className="flex items-end justify-between gap-3">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#829087]">
										Your workspace
									</p>
									<h1 className="mt-1 text-2xl font-semibold tracking-tight">
										Inbox
									</h1>
								</div>
								<span className="rounded-full bg-[#e9efe5] px-2.5 py-1 text-xs font-semibold text-[#456955]">
									{items.length}
								</span>
							</div>
							<label className="mt-5 flex h-11 items-center gap-2.5 rounded-xl border border-[#e1e7df] bg-[#f8f9f6] px-3.5 text-[#78877d] focus-within:border-[#91aa98] focus-within:ring-2 focus-within:ring-[#dce8dc]">
								<Search size={16} aria-hidden="true" />
								<input
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Search files or notes"
									aria-label="Search files or notes"
									className="min-w-0 flex-1 bg-transparent text-sm text-[#173138] outline-none placeholder:text-[#9aa59e]"
								/>
							</label>
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto">
							{filteredItems.length ? (
								<ul>
									{filteredItems.map((item) => {
										const selected =
											selectedItem?.file.documentId === item.file.documentId;
										return (
											<li key={item.file.documentId}>
												<button
													type="button"
													onClick={() => openItem(item)}
													aria-current={selected ? "true" : undefined}
													className={`flex w-full items-start gap-3.5 border-b border-[#edf0eb] px-5 py-4 text-left transition hover:bg-[#f7f9f5] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#477c70] sm:px-6 ${selected ? "bg-[#f0f5ee]" : "bg-white"}`}
												>
													<span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#dce9dc] text-sm font-semibold text-[#365e4a]">
														<FileText size={18} />
													</span>
													<span className="min-w-0 flex-1">
														<span className="flex items-center justify-between gap-2">
															<span className="truncate text-sm font-semibold">
																"Customer upload"
															</span>
															<time className="shrink-0 text-[11px] text-[#89958d]">
																{formatTime(item.receivedAt)}
															</time>
														</span>
														<span className="mt-1 block truncate text-[13px] text-[#52645b]">
															{item.file.note?.trim() || item.file.fileName}
														</span>
														<span className="mt-1.5 flex items-center gap-1 text-[11px] text-[#87938b]">
															<Check size={13} className="text-[#4d8a64]" />
															Document received
														</span>
													</span>
												</button>
											</li>
										);
									})}
								</ul>
							) : (
								<div className="flex min-h-72 flex-col items-center justify-center px-8 text-center">
									<span className="grid size-14 place-items-center rounded-2xl bg-[#eef3eb] text-[#66816d]">
										<Inbox size={25} />
									</span>
									<h2 className="mt-4 text-sm font-semibold">
										{items.length ? "No matching files" : "Your inbox is ready"}
									</h2>
									<p className="mt-1.5 max-w-[240px] text-xs leading-5 text-[#7d8b82]">
										{items.length
											? "Try another file name or customer note."
											: "New customer uploads will appear here as soon as they arrive."}
									</p>
								</div>
							)}
						</div>
						<div className="flex items-center gap-2 border-t border-[#edf0eb] px-5 py-3 text-[11px] text-[#839087] sm:px-6">
							<ShieldCheck size={14} className="text-[#688371]" />
							Live files are visible to your shop account
						</div>
					</aside>

					<section
						className={`min-h-[70vh] flex-col bg-[#f5f7f2] md:flex ${mobileDetailOpen ? "flex" : "hidden"}`}
						aria-label="Selected customer upload"
					>
						{selectedItem ? (
							<>
								<div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#e4e9e1] bg-white px-4 sm:px-7">
									<button
										type="button"
										onClick={() => setMobileDetailOpen(false)}
										className="grid size-10 place-items-center rounded-full text-[#587066] hover:bg-[#f1f4ef] focus-visible:outline-2 focus-visible:outline-[#477c70] md:hidden"
										aria-label="Back to inbox"
									>
										<ArrowLeft size={19} />
									</button>
									<span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dce9dc] text-[#365e4a]">
										<FileText size={18} />
									</span>
									<div className="min-w-0 flex-1">
										<h2 className="truncate text-sm font-semibold">
											"Customer upload"
										</h2>
										<p className="text-xs text-[#839087]">
											Received {formatDateTime(selectedItem.receivedAt)}
										</p>
									</div>
									<span className="hidden items-center gap-1.5 rounded-full bg-[#eef3eb] px-3 py-1.5 text-[11px] font-medium text-[#55715e] sm:inline-flex">
										<span className="size-1.5 rounded-full bg-[#59936c]" />
										New upload
									</span>
								</div>

								<div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
									<div className="mb-6 text-center text-[11px] text-[#89958d]">
										{formatDateTime(selectedItem.receivedAt)}
									</div>
									<div className="ml-auto w-full max-w-[620px]">
										{selectedItem.file.note?.trim() ? (
											<div className="ml-auto mb-5 max-w-[88%] rounded-2xl rounded-br-sm bg-[#dfeedd] px-4 py-3.5 text-sm leading-6 text-[#254638] shadow-[0_2px_8px_rgba(30,58,43,0.04)]">
												<p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718979]">
													Message from customer
												</p>
												<p className="whitespace-pre-wrap break-words">
													{selectedItem.file.note}
												</p>
											</div>
										) : (
											<p className="mb-5 text-right text-xs text-[#8a968d]">
												Customer didn’t add a note
											</p>
										)}

										<article className="rounded-2xl border border-[#e0e7dd] bg-white p-4 shadow-[0_8px_26px_rgba(33,58,45,0.05)] sm:p-5">
											<div className="flex items-center gap-3">
												<span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#edf3e9] text-[#51745f]">
													<FileText size={22} />
												</span>
												<div className="min-w-0 flex-1">
													<h3 className="truncate text-sm font-semibold">
														{selectedItem.file.fileName}
													</h3>
													<p className="mt-1 text-xs text-[#859188]">
														{selectedItem.file.contentType} ·{" "}
														{formatFileSize(selectedItem.file.fileSize)}
													</p>
												</div>
											</div>
											<div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#edf0eb] pt-4">
												<a
													href={selectedItem.fileUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#173f37] px-3 text-sm font-medium text-white transition hover:bg-[#245347] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
												>
													<ArrowUpRight size={16} /> Open document
												</a>
												<a
													href={selectedItem.fileUrl}
													download={selectedItem.file.fileName}
													className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dce5da] bg-white px-3 text-sm font-medium text-[#466151] transition hover:bg-[#f5f8f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
												>
													<ArrowDownToLine size={16} /> Download
												</a>
											</div>
										</article>
									</div>
									<div className="mt-auto flex items-center justify-center gap-2 pt-10 text-xs text-[#8a968d]">
										<ShieldCheck size={14} /> Customer details stay private
									</div>
								</div>
								<div className="border-t border-[#e4e9e1] bg-white px-4 py-3 sm:px-7">
									{supportsBrowserPrint(selectedItem.file.fileName) ? (
										<button
											type="button"
											onClick={() => printDocument(selectedItem.fileUrl)}
											className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#dce5da] bg-white text-sm font-semibold text-[#365d4a] transition hover:bg-[#f5f8f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
										>
											<Printer size={17} /> Print document
										</button>
									) : (
										<p className="py-2 text-center text-xs text-[#718078]">
											Download this file to print it in its document app.
										</p>
									)}
								</div>
							</>
						) : (
							<div className="hidden flex-1 flex-col items-center justify-center px-8 text-center md:flex">
								<span className="grid size-16 place-items-center rounded-2xl bg-[#e8efe5] text-[#6b8671]">
									<MessageSquareText size={28} />
								</span>
								<h2 className="mt-4 text-base font-semibold">
									Choose a customer upload
								</h2>
								<p className="mt-2 max-w-xs text-sm leading-6 text-[#7d8b82]">
									Select an item from your inbox to view its note and document.
								</p>
							</div>
						)}
					</section>
				</div>
			</div>
		</main>
	);
}

function formatTime(timestamp: number) {
	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	}).format(timestamp);
}

function formatDateTime(timestamp: number) {
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(timestamp);
}

function supportsBrowserPrint(fileName: string) {
	return /\.(pdf|png|txt|csv)$/i.test(fileName);
}

function formatFileSize(bytes: number) {
	if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default ChatPage;
