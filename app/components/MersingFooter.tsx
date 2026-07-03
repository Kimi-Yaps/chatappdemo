"use client";

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/home",           label: "Home" },
  { href: "/packages",       label: "Packages" },
  { href: "/events",         label: "Event" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms",          label: "Terms" },
];

export default function MersingFooter() {
  return (
    <footer style={{
      background: "var(--vm-footer-bg)",
      padding: "36px 48px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
      flexWrap: "wrap",
    }}>
      {/* Left — navigation links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FOOTER_LINKS.map((l) => (
          <Link key={l.href} href={l.href} style={{
            fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none",
            transition: "color 150ms",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)"; }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Right — big Array-Bold CTA */}
      <div style={{ textAlign: "right" }}>
        <p style={{
          fontFamily: "ArrayBold, monospace",
          fontSize: "clamp(28px, 5vw, 48px)",
          color: "#fff",
          lineHeight: 1.15,
          letterSpacing: "0.02em",
        }}>
          Visit Mersing<br />Now !!!
        </p>
      </div>
    </footer>
  );
}
