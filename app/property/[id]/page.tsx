"use client";

import { useParams, useRouter } from "next/navigation";
import { getProperty, PROPERTIES } from "../../data/properties";
import Navbar from "../../components/Navbar";
import BadgeRow from "../../components/BadgeRow";
import BookingCard from "../../components/BookingCard";
import UtilityBreakdown from "../../components/UtilityBreakdown";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const property = getProperty(id);

  if (!property) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏚️</div>
          <h2 style={{ color: "var(--text-primary)" }}>Bilik tidak dijumpai</h2>
          <button onClick={() => router.push("/")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Kembali ke Senarai
          </button>
        </div>
      </>
    );
  }

  const related = PROPERTIES.filter((p) => p.id !== property.id && p.gender === property.gender).slice(0, 3);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, fontSize: 12 }}>
            Browse Rooms
          </button>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{property.title.slice(0, 40)}…</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>

          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div>
            {/* Hero image gallery placeholder */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "160px 140px",
              gap: 6,
              borderRadius: 18,
              overflow: "hidden",
              marginBottom: 28,
              position: "relative",
            }}>
              {/* Main large placeholder */}
              <div style={{
                gridRow: "1 / 3",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 8, color: "var(--text-muted)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span style={{ fontSize: 12, opacity: 0.45 }}>Foto utama</span>
              </div>

              {/* 4 smaller placeholders */}
              {[1,2,3,4].map((n) => (
                <div key={n} style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  position: "relative",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  {/* "Show All Photos" overlay on last tile */}
                  {n === 4 && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, cursor: "pointer",
                      color: "#fff", fontSize: 12, fontWeight: 600,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Show All Photos
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Title + location (moved out of hero) */}
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 6 }}>
                {property.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-muted)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {property.location}
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24,
            }}>
              {[
                { icon: "🛏️", label: `${property.rooms} Bilik` },
                { icon: "🚿", label: `${property.bathrooms} Bilik Air` },
                { icon: "📐", label: `${property.size} sqft` },
                { icon: "📅", label: `Min ${property.minLease} Bulan` },
                { icon: "⭐", label: `${property.rating} (${property.reviews} ulasan)` },
              ].map((s) => (
                <div key={s.label} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                  borderRadius: 10, padding: "8px 14px",
                  fontSize: 13, color: "var(--text-secondary)", fontWeight: 600,
                }}>
                  <span>{s.icon}</span> {s.label}
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>Kemudahan / Facilities</SectionTitle>
              <BadgeRow badges={property.badges} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>Penerangan / Description</SectionTitle>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, background: "var(--bg-elevated)", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
                {property.description}
              </p>
            </div>

            {/* Near campus */}
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>Berdekatan Kampus / Near Campus</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {property.nearCampus.map((c) => (
                  <span key={c} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)",
                    color: "#34d399", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 600,
                  }}>
                    🏫 {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div style={{ marginBottom: 28 }}>
              <SectionTitle>Utiliti / Utilities</SectionTitle>
              <UtilityBreakdown property={property} />
            </div>

            {/* Landlord */}
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>Tuan Rumah / Landlord</SectionTitle>
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: 14, padding: "16px 18px",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${property.landlord.color}, ${property.landlord.color}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 800, color: "#fff",
                  boxShadow: `0 4px 12px ${property.landlord.color}44`,
                }}>
                  {property.landlord.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{property.landlord.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱ Balas dalam {property.landlord.responseTime}</div>
                </div>
                <button
                  onClick={() => router.push(`/chat/${property.id}`)}
                  style={{
                    padding: "9px 18px", borderRadius: 10, border: "none",
                    background: "rgba(59,130,246,0.15)", color: "#3b82f6",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    transition: "all 150ms",
                  }}
                >
                  💬 Chat
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky booking card) ─────── */}
          <div style={{ position: "sticky", top: 80 }}>
            <BookingCard property={property} />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <SectionTitle>Bilik Serupa / Similar Rooms</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18, marginTop: 16 }}>
              {related.map((p) => {
                const { PropertyCard: PC } = { PropertyCard: require("../../components/PropertyCard").default };
                return <PC key={p.id} property={p} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
      {children}
    </h2>
  );
}
