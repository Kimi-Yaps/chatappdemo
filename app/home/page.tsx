"use client";

import { useState } from "react";
import Link from "next/link";
import MersingNavbar from "../components/MersingNavbar";
import MersingFooter from "../components/MersingFooter";
import "../mersing.css";

// ── Dummy data ────────────────────────────────────────────────────────────────

const STAY_ITEMS = [
  { id: "s1", name: "Pulau Hujung", subtitle: "Island Resort", price: 260, unit: "Night" },
  { id: "s2", name: "Kampung Mersing", subtitle: "Riverside Stay", price: 180, unit: "Night" },
  { id: "s3", name: "Tanjung Balau", subtitle: "Beach Cottage", price: 320, unit: "Night" },
  { id: "s4", name: "Air Papan", subtitle: "Surfer's Lodge", price: 210, unit: "Night" },
];

const ISLAND_ITEMS = [
  { id: "i1", name: "Pulau Hujung", subtitle: "Full-Day Trip", price: 150, unit: "Person" },
  { id: "i2", name: "Pulau Rawa", subtitle: "Snorkel Package", price: 200, unit: "Person" },
  { id: "i3", name: "Pulau Sibu", subtitle: "Overnight Camp", price: 280, unit: "Person" },
  { id: "i4", name: "Pulau Besar", subtitle: "Sunset Cruise", price: 120, unit: "Person" },
];

// ── Placeholder card ──────────────────────────────────────────────────────────

function ItemCard({ item, href }: { item: typeof STAY_ITEMS[0]; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="vm-card-lift" style={{
        background: "var(--vm-card)",
        borderRadius: "var(--vm-radius)",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid var(--vm-border)",
      }}>
        {/* Placeholder image */}
        <div style={{
          height: 140, background: "var(--vm-card-hover)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 6, color: "var(--vm-text-muted)",
          borderBottom: "1px solid var(--vm-border)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span style={{ fontSize: 10, opacity: 0.45 }}>Photo coming soon</span>
        </div>

        {/* Info */}
        <div style={{ padding: "10px 12px 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text-primary)", marginBottom: 2 }}>{item.name}</div>
          <div style={{ fontSize: 11, color: "var(--vm-text-muted)", marginBottom: 6 }}>{item.subtitle}</div>
          <div style={{ fontSize: 12, color: "var(--vm-text-secondary)", fontWeight: 600 }}>
            RM{item.price} <span style={{ fontWeight: 400 }}>for {item.unit}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ label, href }: { label: string; href: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      <Link href={href} style={{
        fontSize: 15, fontWeight: 700, color: "var(--vm-text-primary)",
        textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
      }}>
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </Link>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [destination, setDestination] = useState("");
  const [startDate,   setStartDate]   = useState("");
  const [endDate,     setEndDate]     = useState("");
  const [adults,      setAdults]      = useState(1);

  return (
    <div className="vm-page" style={{ overflowY: "auto", height: "100vh" }}>
      <MersingNavbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: 260, overflow: "hidden" }}>
        {/* Placeholder hero background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #5BA8A0 0%, #2D7A74 40%, #1A5C58 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <p style={{ fontSize: 11, marginTop: 6 }}>Hero photo placeholder</p>
          </div>
        </div>

        {/* Search card overlay */}
        <div style={{
          position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)",
          width: "min(680px, calc(100% - 48px))",
          background: "rgba(240,235,226,0.97)", backdropFilter: "blur(12px)",
          borderRadius: "var(--vm-radius-lg)", padding: "20px 24px 20px",
          boxShadow: "var(--vm-shadow-lg)",
          border: "1px solid var(--vm-border)",
        }}>
          {/* Destination */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--vm-border)", paddingBottom: 14, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--vm-text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter a destination or property"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 14, color: "var(--vm-text-primary)",
              }}
            />
          </div>

          {/* Date + adults row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
            <input type="text" placeholder="start date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--vm-border)", background: "transparent", fontSize: 12, color: "var(--vm-text-secondary)", outline: "none" }} />
            <input type="text" placeholder="end date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--vm-border)", background: "transparent", fontSize: 12, color: "var(--vm-text-secondary)", outline: "none" }} />
            <div style={{ flex: 2, display: "flex", alignItems: "center", border: "1px solid var(--vm-border)", borderRadius: 8, padding: "6px 12px", gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--vm-text-muted)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <span style={{ fontSize: 12, color: "var(--vm-text-secondary)" }}>{adults} Adult{adults !== 1 ? "s" : ""}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--vm-border)", background: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vm-text-secondary)" }}>−</button>
                <button onClick={() => setAdults(adults + 1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--vm-border)", background: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vm-text-secondary)" }}>+</button>
              </div>
            </div>
          </div>

          {/* Search button */}
          <button style={{
            width: "100%", padding: "13px 0",
            background: "var(--vm-blue)", color: "#fff",
            border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.02em",
          }}>
            Search
          </button>
        </div>
      </section>

      {/* Spacer for search card overhang */}
      <div style={{ height: 80 }} />

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Stay In Mersing */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading label="Stay In Mersing" href="/packages?type=stay" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {STAY_ITEMS.map((item) => <ItemCard key={item.id} item={item} href={`/property/${item.id}`} />)}
          </div>
        </section>

        {/* Island Hopping */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeading label="Island Hopping" href="/packages?type=island" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {ISLAND_ITEMS.map((item) => <ItemCard key={item.id} item={item} href={`/packages/${item.id}`} />)}
          </div>
        </section>
      </main>

      <MersingFooter />
    </div>
  );
}
