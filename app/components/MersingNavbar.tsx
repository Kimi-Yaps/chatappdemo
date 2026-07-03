"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/events",   label: "Event" },
];

export default function MersingNavbar() {
  const pathname = usePathname();
  const [cartCount] = useState(1); // placeholder

  return (
    <header style={{ background: "var(--vm-bg)", borderBottom: "1px solid var(--vm-border)", position: "sticky", top: 0, zIndex: 200 }}>

      {/* ── Marquee bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--vm-bg)", borderBottom: "1px solid var(--vm-border)", overflow: "hidden", height: 28, display: "flex", alignItems: "center" }}>
        <div className="vm-marquee-track" style={{ gap: 0 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingRight: 48, fontSize: 11, color: "var(--vm-text-secondary)", fontWeight: 500 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--vm-text-secondary)", display: "inline-block", flexShrink: 0 }} />
              Book Your Palace Now
            </span>
          ))}
        </div>
      </div>

      {/* ── Main nav ────────────────────────────────────────────────────────── */}
      <nav style={{ display: "flex", alignItems: "center", height: 56, padding: "0 28px", gap: 0 }}>

        {/* Left links */}
        <div style={{ display: "flex", gap: 28, flex: 1 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              color: pathname.startsWith(l.href) ? "var(--vm-text-primary)" : "var(--vm-text-secondary)",
              borderBottom: pathname.startsWith(l.href) ? "2px solid var(--vm-brown)" : "2px solid transparent",
              paddingBottom: 2, transition: "color 150ms",
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center logo */}
        <Link href="/home" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, lineHeight: 1 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--vm-text-primary)", letterSpacing: "0.04em" }}>Visit</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 8, color: "var(--vm-text-secondary)", lineHeight: 1.2 }}>
              <span>&amp;</span>
              <span>Travel</span>
            </div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "var(--vm-text-primary)", letterSpacing: "0.04em" }}>Mersing</span>
          </div>
        </Link>

        {/* Right icons */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>

          {/* TikTok */}
          <a href="#" title="TikTok" style={{ color: "var(--vm-text-secondary)", display: "flex" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a href="#" title="WhatsApp" style={{ color: "var(--vm-text-secondary)", display: "flex" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a href="#" title="Facebook" style={{ color: "var(--vm-text-secondary)", display: "flex" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Email */}
          <a href="#" title="Email" style={{ color: "var(--vm-text-secondary)", display: "flex" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>

          {/* Cart */}
          <Link href="/cart" style={{ color: "var(--vm-text-secondary)", display: "flex", position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -5, right: -5, background: "var(--vm-blue)", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Flag + MYR */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>🇲🇾</span>
            <span style={{ fontSize: 11, color: "var(--vm-text-secondary)", fontWeight: 600 }}>MYR</span>
          </div>

          {/* Profile */}
          <Link href="/profile" style={{ color: "var(--vm-text-secondary)", display: "flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
