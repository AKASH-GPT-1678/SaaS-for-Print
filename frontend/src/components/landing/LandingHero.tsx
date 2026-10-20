import { cx } from "./landingStyles";

const sampleStats = [
  ["New requests", "08", "Needs your attention"],
  ["In progress", "05", "Being prepared"],
  ["Ready for pickup", "03", "Good to hand over"],
] as const;

const sampleRequests = [
  { name: "Application_form.pdf", detail: "Document · 12 pages", icon: "▤", type: "document-icon", status: "New", statusClass: "status-new" },
  { name: "Passport photo set", detail: "Photos · 6 copies", icon: "▧", type: "photo-icon", status: "Preparing", statusClass: "status-progress" },
  { name: "College notes.pdf", detail: "Document · 42 pages", icon: "▤", type: "document-icon", status: "Ready", statusClass: "status-ready" },
] as const;

function ProductPreview() {
  return (
    <div
      className={cx("hero-visual")}
      role="img"
      aria-label="Illustrative Printar workspace preview showing a document request and a photo-print request"
    >
      <div className={cx("visual-ambient ambient-one")} />
      <div className={cx("visual-ambient ambient-two")} />
      <div className={cx("hero-preview-label")}>ILLUSTRATIVE PRODUCT PREVIEW</div>
      <div className={cx("workspace-window")}>
        <div className={cx("workspace-rail")}>
          <div className={cx("rail-logo")}>P<span>.</span></div>
          <span className={cx("rail-active")}>▦</span>
          <span>▤</span><span>▥</span><span>◷</span>
          <div className={cx("rail-bottom")}>AG</div>
        </div>
        <div className={cx("workspace-main")}>
          <div className={cx("workspace-top")}>
            <div><small>YOUR SHOP / TODAY</small><strong>Good morning, Akash.</strong></div>
            <span className={cx("workspace-search")}>⌕ &nbsp; Search requests</span>
          </div>
          <div className={cx("workspace-heading")}>
            <div><small>THE WORK IN FRONT OF YOU</small><h2>Shop overview</h2></div>
            <span className={cx("live-pill")}><i /> Live workspace</span>
          </div>
          <div className={cx("workspace-stats")}>
            {sampleStats.map(([label, value, note]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
            ))}
          </div>
          <div className={cx("workspace-content")}>
            <div className={cx("request-panel")}>
              <div className={cx("panel-heading")}><strong>Recent requests</strong><span>View all →</span></div>
              {sampleRequests.map((request) => (
                <div className={cx("request-row")} key={request.name}>
                  <span className={cx(`request-icon ${request.type}`)}>{request.icon}</span>
                  <div><strong>{request.name}</strong><small>{request.detail}</small></div>
                  <b className={cx(request.statusClass)}>{request.status}</b>
                </div>
              ))}
            </div>
            <div className={cx("insight-panel")}>
              <small>THIS WEEK</small><strong>Shop activity</strong>
              <div className={cx("chart")}>
                {[39, 62, 48, 83, 69, 96, 75].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className={cx("chart-labels")}><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("phone-card")}>
        <div className={cx("phone-top")}><span>Printar<span className={cx("brand-dot")}>.</span></span><span>•••</span></div>
        <span className={cx("phone-kicker")}>SEND TO THIS SHOP</span>
        <h3>What can we help you with?</h3>
        <div className={cx("phone-option")}><span className={cx("phone-option-icon")}>▤</span> Documents <span>→</span></div>
        <div className={cx("phone-option")}><span className={cx("phone-option-icon peach")}>▧</span> Photos <span>→</span></div>
        <div className={cx("phone-note")}>No personal number needed.</div>
      </div>
      <div className={cx("floating-badge")}><span>✓</span> New request received</div>
    </div>
  );
}

export function LandingHero() {
  return (
    <>
      <section className={cx("hero")}>
        <div className={cx("container hero-grid")}>
          <div className={cx("hero-copy")}>
            <div className={cx("eyebrow")}><span className={cx("eyebrow-line")} /> THE COUNTER, REIMAGINED</div>
            <h1>Your <em>whole counter,</em><br className={cx("desktop-break")} /> in one calmer place.</h1>
            <p className={cx("hero-lead")}>Documents, photo requests, and the little jobs in between. Printar gives your shop one clear place to receive, prepare, and keep track of what comes next.</p>
            <div className={cx("hero-actions")}>
              <a className={cx("button button-dark")} href="#toolkit">Explore the launch toolkit <span aria-hidden="true">↗</span></a>
              <a className={cx("button button-text")} href="#how">See the flow <span aria-hidden="true">→</span></a>
            </div>
            <div className={cx("hero-assurance")}><span className={cx("assurance-icon")} aria-hidden="true">✳</span><span>Keep your personal number personal. Let your shop have its own front door.</span></div>
          </div>
          <ProductPreview />
        </div>
      </section>
      <div className={cx("shop-strip")}>
        <div className={cx("container shop-strip-inner")}>
          <span>MADE FOR THE SHOP THAT DOES IT ALL</span>
          <div><b>Print &amp; photocopy</b><b>Photo services</b><b>Forms &amp; documents</b><b>Walk-in requests</b></div>
        </div>
      </div>
    </>
  );
}
