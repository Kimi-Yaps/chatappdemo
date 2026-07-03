"use client";

import Link from "next/link";
import { Property } from "../data/properties";
import BadgeRow from "./BadgeRow";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  return (
    <Link href={`/property/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16, overflow: "hidden",
          transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.5)";
          el.style.borderColor = "rgba(59,130,246,0.35)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
          el.style.borderColor = "var(--border-subtle)";
        }}
      >
        {/* Image / Gradient Hero */}
        <div style={{
          height: 160, background: p.gradient, position: "relative",
          display: "flex", alignItems: "flex-end", padding: "12px 14px",
        }}>
          {/* Availability badge */}
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: p.available ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.85)",
            backdropFilter: "blur(8px)",
            color: "#fff", fontSize: 11, fontWeight: 700,
            borderRadius: 99, padding: "3px 10px",
          }}>
            {p.available ? "✓ Tersedia" : "Penuh"}
          </span>

          {/* Type badge */}
          <span style={{
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
            color: "#fff", fontSize: 10, fontWeight: 600,
            borderRadius: 99, padding: "3px 10px", letterSpacing: "0.04em",
          }}>
            {p.type === "apartment" ? "🏢 Apartment" : p.type === "house" ? "🏠 Rumah" : "🛏️ Hostel"}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* Title */}
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
            marginBottom: 4, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {p.title}
          </h3>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {p.location}
          </div>

          {/* Badges */}
          <div style={{ marginBottom: 14 }}>
            <BadgeRow badges={p.badges.slice(0, 3)} size="sm" />
          </div>

          {/* Price + Stats */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>RM{p.price}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}> /bln/{p.priceUnit === "bed" ? "katil" : "bilik"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#fbbf24" }}>
              ★ <span style={{ fontWeight: 700 }}>{p.rating}</span>
              <span style={{ color: "var(--text-muted)" }}>({p.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
