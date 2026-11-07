"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cx } from "./landingStyles";

const navigation = [
  ["The toolkit", "#toolkit"],
  ["How it works", "#how"],
  ["For your shop", "#fit"],
  ["Coming next", "#next"],
] as const;

export function LandingHeader() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoggedIn = isHydrated && Boolean(token);

  return (
    <>
      <div className={cx("announcement")}>
        <div className={cx("container announcement-inner")}>
          <span className={cx("announcement-dot")} aria-hidden="true" />
          <strong>Built for busy Indian counters</strong>
          <span>One workspace for the work that walks in every day.</span>
        </div>
      </div>
      <header className={cx("site-header")} id="top">
        <div className={cx("container nav")}>
          <a className={cx("brand")} href="#top" aria-label="Printar home">
            <Image src="/logo.svg" width={38} height={38} alt="" />
            <span>
              Printar<span className={cx("brand-dot")}>.</span>
            </span>
          </a>
          <nav className={cx("nav-links")} aria-label="Main navigation">
            {navigation.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className={cx("nav-actions")}>
            {isLoggedIn ? (
              <Link className={cx("button button-dark button-small")} href="/dashboard">
                Dashboard <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <Link className={cx("button button-dark button-small")} href="/login">
                Sign in <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
          <details className={cx("mobile-nav")}>
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {navigation.map(([label, href]) => (
                <a href={href} key={href}>
                  {label}
                </a>
              ))}
              {isLoggedIn ? (
                <Link href="/dashboard">Dashboard ↗</Link>
              ) : (
                <Link href="/login">Sign in ↗</Link>
              )}
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
