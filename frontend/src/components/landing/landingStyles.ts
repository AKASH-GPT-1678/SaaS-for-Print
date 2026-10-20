import styles from "./landing.module.css";

/** Keep the design reference's readable class names while CSS Modules scope them. */
export function cx(names: string): string {
  return names
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => styles[name] ?? name)
    .join(" ");
}
