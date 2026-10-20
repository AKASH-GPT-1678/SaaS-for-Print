import Link from "next/link";
import { cx } from "./landingStyles";

const toolkit = [
  { number: "01 / RECEIVE", icon: "⌗", color: "green", title: "A shop inbox, not your personal chat.", description: "Customers send documents through your shop's QR link. Keep incoming files and request details together, without sharing your number.", label: "QR FILE HANDOFF" },
  { number: "02 / PREPARE", icon: "▧", color: "peach", title: "Photo requests have a place too.", description: "Collect photo-print orders alongside document jobs, with the sizes and copy counts you need to prepare them.", label: "PHOTO PRINT REQUESTS" },
  { number: "03 / ORGANIZE", icon: "▤", color: "lilac", title: "Find the right file, right away.", description: "Keep customer documents organized and use essential preparation tools before a job goes to print.", label: "DOCUMENT MANAGER & EDITOR" },
  { number: "04 / SEE", icon: "▦", color: "mint", title: "Know what needs attention.", description: "A focused dashboard shows incoming, in-progress, and ready work without asking you to search through messages.", label: "SHOP DASHBOARD" },
  { number: "05 / LEARN", icon: "▥", color: "sand", title: "See how the shop is moving.", description: "Useful, simple analytics help you spot request volume and the services your customers ask for most.", label: "PRACTICAL ANALYTICS" },
  { number: "06 / REMEMBER", icon: "◷", color: "blue", title: "Make follow-ups feel easy.", description: "Keep important jobs and pickup times in view with reminders and scheduling built for a busy counter.", label: "ALERTS & SCHEDULING" },
] as const;

const flow = [
  { number: "01", icon: "⌗", title: "Receive", description: "Share your shop QR. Customers choose a document or photo request and send what you need." },
  { number: "02", icon: "☷", title: "Prepare", description: "Review the file, clarify the job, and keep the work moving in one organized workspace." },
  { number: "03", icon: "✓", title: "Finish & follow up", description: "Mark the job ready, remember pickup times, and see what the day has brought in." },
] as const;

const roadmap = [
  { icon: "✎", status: "PLANNED", title: "Agreement drafting", description: "Guided details and reusable drafts for common document work, with human review before use." },
  { icon: "▧", status: "PLANNED", title: "Photo frame layouts", description: "Turn customer photos into print-ready frame and collage layouts with less manual setup." },
  { icon: "▤", status: "EXPLORING", title: "Binding & finishing jobs", description: "Track finishing choices and handoff details for the work beyond a simple printout." },
  { icon: "✳", status: "EXPLORING", title: "More counter services", description: "Organize requests for the other services your shop offers, without claiming Printar performs them today." },
] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <span className={cx(light ? "eyebrow light" : "eyebrow")}><span className={cx("eyebrow-line")} />{children}</span>;
}

export function ToolkitSection() {
  return (
    <section className={cx("section toolkit-section")} id="toolkit">
      <div className={cx("container")}>
        <div className={cx("section-heading centered")}>
          <Eyebrow>THE LAUNCH TOOLKIT</Eyebrow>
          <h2>Small tools. A noticeably <em>smoother day.</em></h2>
          <p>Start with the everyday work your shop handles most. The launch toolkit brings requests, files, preparation, and follow-ups into one calmer flow.</p>
        </div>
        <div className={cx("toolkit-grid")}>
          {toolkit.map((tool) => (
            <article className={cx("tool-card")} key={tool.number}>
              <span className={cx(`tool-icon ${tool.color}`)} aria-hidden="true">{tool.icon}</span>
              <span className={cx("tool-number")}>{tool.number}</span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <div className={cx("tool-card-footer")}>{tool.label}<span aria-hidden="true">↗</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlowSection() {
  return (
    <section className={cx("section flow-section")} id="how">
      <div className={cx("container")}>
        <div className={cx("section-heading flow-heading")}>
          <div><Eyebrow>A CLEARER EVERYDAY FLOW</Eyebrow><h2>From “send it here”<br /> to <em>“it&apos;s ready.”</em></h2></div>
          <p>Whether it starts with a walk-in customer or a file sent before they arrive, everyone can see the next step.</p>
        </div>
        <div className={cx("flow-grid")}>
          {flow.map((step) => (
            <article className={cx("flow-step")} key={step.number}>
              <span className={cx("flow-count")}>{step.number}</span>
              <span className={cx("flow-symbol")} aria-hidden="true">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleDayboard() {
  return (
    <div className={cx("dayboard")} role="img" aria-label="Illustrative shop-day preview with document and photo jobs in one queue">
      <div className={cx("dayboard-header")}><div><span>SHOP DAY / CONCEPT PREVIEW</span><h3>The work, in one view</h3></div><span className={cx("dayboard-date")}>TODAY ↗</span></div>
      <div className={cx("dayboard-grid")}>
        <div className={cx("dayboard-job")}><span className={cx("job-type")}>DOCUMENT</span><strong>Scholarship application</strong><small>Print · 4 pages · A4</small><span className={cx("job-state")}>New request</span></div>
        <div className={cx("dayboard-job photo-job")}><span className={cx("job-type")}>PHOTO</span><strong>Passport photo set</strong><small>6 copies · matte</small><span className={cx("job-state")}>Preparing</span></div>
        <div className={cx("dayboard-job")}><span className={cx("job-type")}>DOCUMENT</span><strong>Course notes</strong><small>Print · 42 pages · B/W</small><span className={cx("job-state")}>Ready</span></div>
        <div className={cx("dayboard-future")}><span aria-hidden="true">✳</span><p>More ways to run your counter are on the roadmap.</p></div>
      </div>
      <div className={cx("dayboard-bottom")}><span>INCOMING</span><span>PREPARING</span><span>READY</span></div>
    </div>
  );
}

export function ShopSection() {
  return (
    <section className={cx("section feature-section")} id="fit">
      <div className={cx("container feature-grid")}>
        <div className={cx("feature-copy")}>
          <Eyebrow>BUILT AROUND YOUR REAL DAY</Eyebrow>
          <h2>Not just a printer. <em>A neighborhood service desk.</em></h2>
          <p>A typical shop may handle a college form, passport photos, a set of notes, and a binding job before lunch. Printar starts with the digital handoff and organization that can make those busy hours easier.</p>
          <div className={cx("feature-list")}>
            <div><span>✓</span><p><strong>Documents and photos, side by side</strong><small>Two common requests, one visible queue.</small></p></div>
            <div><span>✓</span><p><strong>Less dependence on personal WhatsApp</strong><small>A dedicated way to receive files for the shop.</small></p></div>
            <div><span>✓</span><p><strong>Room for the other services you offer</strong><small>Future workflows can grow around your counter.</small></p></div>
          </div>
        </div>
        <SampleDayboard />
      </div>
    </section>
  );
}

export function RoadmapSection() {
  return (
    <section className={cx("section coming-section")} id="next">
      <div className={cx("container")}>
        <div className={cx("coming-top")}>
          <div><Eyebrow light>A SEPARATE LOOK AHEAD</Eyebrow><h2>Your shop does more.<br /><em>We&apos;re building toward that.</em></h2></div>
          <p>These are ideas for later—not part of the launch toolkit. Help shape which service Printar should make simpler next.</p>
        </div>
        <div className={cx("roadmap-grid")}>
          {roadmap.map((item) => (
            <article className={cx("roadmap-card")} key={item.title}>
              <span className={cx("roadmap-icon")} aria-hidden="true">{item.icon}</span>
              <span className={cx("planned")}>{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <div className={cx("roadmap-note")}><span aria-hidden="true">↗</span> The roadmap is shaped by real shop owners, not a fixed promise of release dates.</div>
      </div>
    </section>
  );
}

export function FinalSection() {
  return (
    <section className={cx("section last-section")}>
      <div className={cx("container last-grid")}>
        <div><Eyebrow>LET&apos;S BUILD THE RIGHT THING</Eyebrow><h2>A better day starts with <em>your counter.</em></h2><p>Printar is being shaped for the shops that keep their neighborhoods moving. Explore the launch toolkit and tell us what your shop needs most.</p></div>
        <div className={cx("last-action")}>
          <Link className={cx("button button-dark")} href="/register">Explore Printar <span aria-hidden="true">↗</span></Link>
          <a className={cx("last-link")} href="#next">See what may come next →</a>
          <small>Design concept · confirm feature availability before launch</small>
        </div>
      </div>
    </section>
  );
}
