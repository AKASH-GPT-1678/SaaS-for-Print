import Image from "next/image";
import Link from "next/link";
import { cx } from "./landingStyles";

export function LandingFooter() {
  return (
    <footer className={cx("footer")}>
      <div className={cx("container footer-main")}>
        <div>
          <a className={cx("brand")} href="#top" aria-label="Printar home">
            <Image src="/logo.svg" width={38} height={38} alt="" />
            <span>Printar<span className={cx("brand-dot")}>.</span></span>
          </a>
          <p>One calmer place for the work behind your counter.</p>
        </div>
        <div className={cx("footer-links")}>
          <div><strong>Explore</strong><a href="#toolkit">The toolkit</a><a href="#how">How it works</a><a href="#fit">For your shop</a></div>
          <div><strong>Looking ahead</strong><a href="#next">Coming next</a><Link href="/login">Sign in</Link><Link href="/register">Get started</Link></div>
        </div>
      </div>
      <div className={cx("container footer-bottom")}>
        <span>© 2026 Printar. Design concept for MVP discovery.</span>
        <span>Made for the work behind every print—and beyond.</span>
      </div>
    </footer>
  );
}
