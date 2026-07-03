"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "../data/properties";

const SEMESTERS = [
  { id: "sem1_2027", label: "Semester 1 — Jan 2027", period: "Jan – Jun 2027" },
  { id: "sem2_2026", label: "Semester 2 — Jul 2026", period: "Jul – Dis 2026" },
  { id: "sem1_2026", label: "Semester 1 — Jan 2026", period: "Jan – Jun 2026" },
  { id: "full_2027", label: "Full Year 2027", period: "Jan – Dis 2027" },
];

interface BookingCardProps {
  property: Property;
}

export default function BookingCard({ property }: BookingCardProps) {
  const [semester, setSemester] = useState(SEMESTERS[0].id);
  const [duration, setDuration] = useState(6);
  const router = useRouter();

  const selected = SEMESTERS.find((s) => s.id === semester)!;
  const totalPrice = property.price * duration;

  const handleChat = () => {
    router.push(`/chat/${property.id}`);
  };

  return (
    <div style={{
      background: "var(--bg-sidebar)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 18, padding: "24px 22px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>

      {/* Price header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
            RM{property.price}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            / bulan per {property.priceUnit === "bed" ? "katil" : "bilik"}
          </span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: property.available ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
          border: `1px solid ${property.available ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 99, padding: "3px 10px",
          fontSize: 12, fontWeight: 700,
          color: property.available ? "#22c55e" : "#ef4444",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          {property.available ? "Tersedia / Available" : "Penuh / Full"}
        </div>
      </div>

      {/* Semester selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Pilih Semester Masuk
        </label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          disabled={!property.available}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)", fontSize: 13, cursor: "pointer",
            appearance: "none",
          }}
        >
          {SEMESTERS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, paddingLeft: 2 }}>
          📅 {selected.period}
        </div>
      </div>

      {/* Duration selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Tempoh Sewa (bulan)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {[6, 9, 12].map((m) => (
            <button
              key={m}
              onClick={() => setDuration(m)}
              disabled={!property.available}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10,
                border: `2px solid ${duration === m ? "#3b82f6" : "var(--border-subtle)"}`,
                background: duration === m ? "rgba(59,130,246,0.15)" : "var(--bg-elevated)",
                color: duration === m ? "#3b82f6" : "var(--text-secondary)",
                fontSize: 13, fontWeight: 700, cursor: property.available ? "pointer" : "default",
                transition: "all 150ms",
              }}
            >
              {m} bln
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#fb923c", marginTop: 6, paddingLeft: 2 }}>
          ⚠️ Minimum {property.minLease} bulan kontrak
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{
        background: "var(--bg-elevated)", borderRadius: 10, padding: "12px 14px",
        marginBottom: 18, display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
          <span>RM{property.price} × {duration} bulan</span>
          <span>RM{totalPrice}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
          <span>Deposit (1 bulan)</span>
          <span>RM{property.price}</span>
        </div>
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
          <span>Jumlah / Total</span>
          <span>RM{totalPrice + property.price}</span>
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={handleChat}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 12,
            background: property.available
              ? "linear-gradient(135deg, #3b82f6, #2563eb)"
              : "var(--bg-elevated)",
            border: "none", cursor: property.available ? "pointer" : "default",
            color: property.available ? "#fff" : "var(--text-muted)",
            fontSize: 14, fontWeight: 700,
            boxShadow: property.available ? "0 4px 16px rgba(59,130,246,0.4)" : "none",
            transition: "all 200ms",
          }}
          onMouseEnter={(e) => { if (property.available) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          {property.available ? "🔒 Secure Your Student Room" : "Bilik Penuh / Full"}
        </button>

        <button
          onClick={handleChat}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 12,
            background: "transparent",
            border: "1px solid var(--border-subtle)", cursor: "pointer",
            color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLButtonElement).style.color = "#3b82f6"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
        >
          💬 Chat dengan Tuan Rumah
        </button>
      </div>

      <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
        Tiada bayaran tempahan · Hubungi tuan rumah terus
      </p>
    </div>
  );
}
