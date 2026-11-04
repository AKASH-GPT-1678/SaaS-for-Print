"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Download,
  Eye,
  Plus,
  QrCode,
  Search,
  Trash2,
  X,
  Pause,
  Play,
  Pencil,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api";
import styles from "./qr-manager.module.css";
import useQRCodes, { type SavedQr } from "@/lib/use-qr-code";
import CheckoutButton from "@/app/components/CheckoutButton";
type Code = {
  id: string;
  name: string;
  location: string;
  active: boolean;
  created: string;
  demo?: boolean;
  image?: string | null;
  qrCodeUrl?: string | null;
  paymentStatus?: SavedQr["paymentStatus"];
  generatedAt?: string | null;
};
const examples: Code[] = [
  {
    id: "demo-counter",
    demo: true,
    name: "Main counter",
    location: "At the checkout desk",
    active: true,
    created: "2026-10-27",
  },
  {
    id: "demo-window",
    demo: true,
    name: "Shop window",
    location: "For customers walking in",
    active: true,
    created: "2026-10-26",
  },
  {
    id: "demo-spare",
    demo: true,
    name: "Spare counter",
    location: "Ready for the next busy day",
    active: false,
    created: "2026-10-25",
  },
];

// Deliberately illustrative: demo artwork must not be mistaken for a live upload code.
function DemoQr() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Illustrative QR pattern, not scannable"
      fill="currentColor"
    >
      <rect width="120" height="120" fill="white" />
      {[
        [10, 10],
        [78, 10],
        [10, 78],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="32" height="32" rx="2" />
          <rect x={x + 5} y={y + 5} width="22" height="22" fill="white" />
          <rect x={x + 10} y={y + 10} width="12" height="12" />
        </g>
      ))}
      {Array.from({ length: 225 }, (_, i) => {
        const x = 10 + (i % 15) * 7;
        const y = 10 + Math.floor(i / 15) * 7;
        return (x < 45 && y < 45) ||
          (x > 73 && y < 45) ||
          (x < 45 && y > 73) ||
          (i * 17 + Math.floor(i / 15) * 13) % 7 > 3 ? null : (
          <rect key={i} x={x} y={y} width="5" height="5" />
        );
      })}
    </svg>
  );
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
  const [modal, setModal] = useState<
    "create" | "edit" | "view" | "delete" | null
  >(null);
  const [selected, setSelected] = useState<Code | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const { getQrCodes, createQr, resumeCheckout, retryGeneration, busy, error, progress } = useQRCodes();
  const demoMode = loaded && codes.every(c => c.demo);
  function toCode(qr: SavedQr): Code {
    return { ...qr, location: "Document upload", created: qr.createdAt.slice(0, 10) };
  }
  async function refreshCodes() {
    try {
      const saved = await getQrCodes();
      setCodes(saved.length ? saved.map(toCode) : examples);
      setLoaded(true); setLoadError("");
    } catch (err) { setLoadError(getApiErrorMessage(err, "Could not load your QR collection.")); }
  }
  useEffect(() => {
    if (!hydrated || !token) return;
    let cancelled = false;
    const controller = new AbortController();
    void getQrCodes(controller.signal).then(saved => {
      if (!cancelled) { setCodes(saved.length ? saved.map(toCode) : examples); setLoaded(true); setLoadError(""); }
    }).catch(err => { if (!cancelled) setLoadError(getApiErrorMessage(err, "Could not load your QR collection.")); });
    return () => { cancelled = true; controller.abort(); };
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
    setLocation(code?.location ?? "");
    setModal(mode);
  }
  async function submitQr() {
    if (!dialog.current?.querySelector("form")?.reportValidity() || !name.trim() || busy) return;
    if (modal === "edit" && selected) {
      setCodes(codes.map(c => c.id === selected.id ? { ...c, name: name.trim() } : c));
      setNotice("Demo collection updated."); setModal(null); return;
    }
    // Close the native dialog so the existing Razorpay checkout can receive input.
    setModal(null); dialog.current?.close();
    await createQr(name.trim());
    await refreshCodes();
  }
  function download() {
    if (selected?.image) {
      const anchor = document.createElement("a");
      anchor.href = selected.image; anchor.download = `printar-qr-${selected.id}.png`; anchor.click();
      setNotice("QR image downloaded."); return;
    }
    const svg = artwork.current?.querySelector("svg");
    if (!svg) return;
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "printar-demo-qr-not-scannable.svg";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Demo artwork downloaded. It is not a live QR code.");
  }
  if (!hydrated || !token)
    return <main className={styles.page}>Loading your workspace…</main>;
  return (
    <main className={styles.page}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onError={() => setLoadError("Payment checkout could not load. Please refresh and try again.")} />
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
          <button className={styles.primary} disabled={busy} onClick={() => open("create")}>
            <Plus size={18} /> Create QR code
          </button>
        </header>
        {demoMode && <div className={styles.demo}>
          <span className={styles.dot} />
          <strong>Demo workspace</strong>
          <span>
            Sample cards are shown until you create a paid QR. Creating a new code opens real payment checkout.
          </span>
        </div>}
        {(error || loadError) && <div className={styles.error} role="alert">{error || loadError}<button onClick={() => void refreshCodes()} disabled={busy}>Refresh collection</button></div>}
        <p role="status" className={styles.notice}>{progress || (!loaded && !loadError ? "Loading your QR collection…" : "")}</p>
        <section className={styles.stats} aria-label="QR summary">
          {[
            ["Total QR codes", codes.length, "Your collection"],
            ["Active", active, demoMode ? "Ready to share · demo" : "Ready to share"],
            ["Not active", codes.length - active, "Paused or awaiting completion"],
          ].map(([label, count, description]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{String(count).padStart(2, "0")}</strong>
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
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {value === "all" ? "All codes" : value}
              </button>
            ))}
            <span>{demoMode ? "DEMO DATA · SAMPLE CARDS" : "YOUR SAVED QR CODES"}</span>
          </div>
          <div className={styles.grid}>
            {visible.map((code) => (
              <article className={styles.card} key={code.id}>
                <div className={styles.cardTop}>
                  <span className={code.active ? styles.active : styles.paused}>
                    {code.demo ? (code.active ? "Active" : "Paused") : code.active ? "Active" : code.paymentStatus === "PAID" ? "Ready to generate" : "Payment pending"}
                  </span>
                  <button
                    aria-label={`Edit ${code.name}`}
                    disabled={!code.demo || busy}
                    title={!code.demo ? "Editing saved codes is coming soon" : undefined}
                    onClick={() => open("edit", code)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <button
                  className={styles.preview}
                  aria-label={`Preview ${code.name}`}
                  disabled={!code.demo && !code.image}
                  onClick={() => open("view", code)}
                >
                  {code.demo ? <DemoQr /> : code.image ? <img src={code.image} width={128} height={128} alt={`Upload QR for ${code.name}`} /> : <QrCode size={80} />}
                  <span>{code.demo ? "ILLUSTRATIVE QR · DEMO" : code.image ? "SCAN TO SEND DOCUMENTS" : "COMPLETE PAYMENT TO GENERATE"}</span>
                </button>
                <div className={styles.cardBody}>
                  <h3>{code.name}</h3>
                  <p>{code.location || "No placement added"}</p>
                  <div className={styles.metadata}>
                    <span>Created {code.created}</span>
                    <span>Document upload</span>
                  </div>
                  <div className={styles.cardActions}>
                    {(!code.demo && !code.image) ? <>
                      <button disabled={busy} onClick={async () => { await retryGeneration(code.id); await refreshCodes(); }}>{code.paymentStatus === "PAID" ? "Generate QR" : "Check payment"}</button>
                      {code.paymentStatus === "PENDING" && <button disabled={busy} onClick={async () => { await resumeCheckout(code.id); await refreshCodes(); }}>Resume checkout</button>}
                    </> : <button onClick={() => open("view", code)}>
                      <Eye size={16} /> View code
                    </button>}
                    <button
                      disabled={!code.demo || busy}
                      title={!code.demo ? "Pausing saved codes is coming soon" : undefined}
                      onClick={() => {
                        setCodes(
                          codes.map((c) =>
                            c.id === code.id ? { ...c, active: !c.active } : c,
                          ),
                        );
                        setNotice(
                          `${code.name} ${code.active ? "paused" : "activated"} in this demo.`,
                        );
                      }}
                      aria-label={`${code.active ? "Pause" : "Activate"} ${code.name}`}
                    >
                      {code.active ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      disabled={!code.demo || busy}
                      title={!code.demo ? "Deleting saved codes is coming soon" : undefined}
                      className={styles.danger}
                      onClick={() => open("delete", code)}
                      aria-label={`Delete ${code.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!search && filter === "all" && (
              <button className={styles.addCard} disabled={busy} onClick={() => open("create")}>
                <span>
                  <Plus size={24} />
                </span>
                <strong>One more place to connect.</strong>
                <p>
                  Create a QR for another counter,
                  <br />a window, or a printed sign.
                </p>
                <b>
                  Create QR code <ArrowUpRight size={16} />
                </b>
              </button>
            )}
          </div>
          {visible.length === 0 && (
            <div className={styles.empty}>
              <QrCode size={32} />
              <h3>
                {codes.length
                  ? "No matching codes"
                  : "A fresh start for your collection"}
              </h3>
              <p>
                {codes.length
                  ? "Try a different search or filter."
                  : "Create your first QR code using the button above."}
              </p>
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
          className={styles.close}
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <X size={20} />
        </button>
        {(modal === "create" || modal === "edit") && (
          <form
            onSubmit={(event) => { event.preventDefault(); void submitQr(); }}
          >
            <p className={styles.eyebrow}>YOUR NEXT TOUCHPOINT</p>
            <h2>{modal === "edit" ? "Edit QR details" : "Create a QR code"}</h2>
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
              {modal === "edit" ? "Changes apply to this sample card only." : "Continue to payment. Your QR is generated after payment is verified. The amount is shown in checkout."}
            </small>
            {modal === "edit" ? <button className={styles.primary} type="submit">Save changes</button> :
              <CheckoutButton className={styles.primary} disabled={busy} label="Pay & create QR" onPayment={submitQr} />}
          </form>
        )}
        {modal === "view" && selected && (
          <div>
            <p className={styles.eyebrow}>QR PREVIEW</p>
            <h2>{selected.name}</h2>
            <p>{selected.location}</p>
            <div ref={artwork} className={styles.largeQr}>
              {selected.image ? <img src={selected.image} width={220} height={220} alt={`Upload QR for ${selected.name}`} /> : <DemoQr />}
            </div>
            <p>{selected.demo ? "Illustrative artwork — not scannable." : "Customers can scan this code to send documents to your shop."}</p>
            <div className={styles.dialogActions}>
              <button className={styles.primary} onClick={download}>
                <Download size={16} /> {selected.demo ? "Download demo SVG" : "Download QR PNG"}
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      selected.qrCodeUrl || `https://example.com/demo/${selected.id}`,
                    );
                    setNotice(
                      selected.demo ? "Example link copied. This is not a live upload link." : "Shop upload link copied.",
                    );
                  } catch {
                    setNotice(
                      "Clipboard unavailable. Please try again in a supported browser.",
                    );
                  }
                }}
              >
                <Copy size={16} /> {selected.demo ? "Copy example link" : "Copy upload link"}
              </button>
            </div>
          </div>
        )}
        {modal === "delete" && selected && (
          <div>
            <p className={styles.eyebrow}>REMOVE FROM COLLECTION</p>
            <h2>Delete “{selected.name}”?</h2>
            <p>
              This removes the code from this demo. No real QR code or customer
              file will be affected.
            </p>
            <div className={styles.dialogActions}>
              <button onClick={() => setModal(null)}>Keep code</button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  setCodes(codes.filter((c) => c.id !== selected.id));
                  setModal(null);
                  setNotice("Demo code deleted.");
                }}
              >
                Delete demo code
              </button>
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}
