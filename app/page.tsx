"use client";

import { useState } from "react";
import { PROPERTIES, BadgeType } from "./data/properties";
import PropertyCard from "./components/PropertyCard";
import RoleSelector from "./components/RoleSelector";
import Navbar from "./components/Navbar";
import { useRole } from "./hooks/useRole";

const ALL_BADGES: { value: BadgeType | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "near-campus", label: "Near Campus" },
  { value: "furnished", label: "Furnished" },
  { value: "wifi", label: "WiFi" },
  { value: "ac", label: "Air-Cond" },
  { value: "parking", label: "Parking" },
  { value: "male-only", label: "Lelaki" },
  { value: "female-only", label: "Wanita" },
];

export default function Home() {
  const { role, setRole, loaded } = useRole();
  const [search, setSearch] = useState("");
  const [filterBadge, setFilterBadge] = useState<BadgeType | "all">("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showAvailable, setShowAvailable] = useState(false);

  const filtered = PROPERTIES.filter((p) => {
    if (showAvailable && !p.available) return false;
    if (maxPrice < 1000 && p.price > maxPrice) return false;
    if (filterBadge !== "all" && !p.badges.includes(filterBadge)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!loaded) return null;

  return (
    <>
      {!role && <RoleSelector onSelect={setRole} />}
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Hero */}
        <div style={{
          textAlign: "center", padding: "52px 24px 40px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            🏠 Platform Sewa Pelajar #1 di Mersing
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: 16 }}>
            Cari Bilik Sewa Pelajar<br />
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              di Mersing, Johor
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Bilik berdekatan Politeknik & Kolej Komuniti Mersing. Harga bermula RM260/bulan. Semua utiliti telus.
          </p>

          {/* Search bar */}
          <div style={{
            maxWidth: 560, margin: "0 auto",
            display: "flex", alignItems: "center", gap: 0,
            background: "var(--bg-sidebar)", border: "1px solid var(--border-subtle)",
            borderRadius: 14, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}>
            <div style={{ padding: "0 14px", color: "var(--text-muted)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              placeholder="Cari kawasan, nama bilik…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, padding: "14px 0", background: "transparent", border: "none",
                color: "var(--text-primary)", fontSize: 14, outline: "none",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ padding: "0 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18 }}>×</button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 28, paddingTop: 8 }}>
          {/* Badge filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_BADGES.map((b) => (
              <button
                key={b.value}
                onClick={() => setFilterBadge(b.value)}
                style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: `1px solid ${filterBadge === b.value ? "#3b82f6" : "var(--border-subtle)"}`,
                  background: filterBadge === b.value ? "rgba(59,130,246,0.15)" : "var(--bg-elevated)",
                  color: filterBadge === b.value ? "#3b82f6" : "var(--text-secondary)",
                  transition: "all 150ms",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Available toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginLeft: "auto" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Tersedia sahaja</span>
            <div
              onClick={() => setShowAvailable((v) => !v)}
              style={{
                width: 40, height: 22, borderRadius: 99, cursor: "pointer",
                background: showAvailable ? "#3b82f6" : "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)", position: "relative",
                transition: "background 200ms",
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: showAvailable ? 21 : 3,
                width: 14, height: 14, borderRadius: "50%",
                background: "#fff", transition: "left 200ms", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </div>
          </label>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
          {filtered.length} bilik ditemui · {PROPERTIES.filter((p) => p.available).length} tersedia
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 22,
          }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Tiada bilik ditemui</p>
            <p style={{ fontSize: 13 }}>Cuba ubah penapis atau kata carian</p>
          </div>
        )}
      </main>
    </>
  );
}
