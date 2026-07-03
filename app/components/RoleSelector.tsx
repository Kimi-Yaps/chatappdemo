"use client";

import { UserRole } from "../hooks/useRole";

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void;
}

export default function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "var(--bg-sidebar)", border: "1px solid var(--border-subtle)",
        borderRadius: 20, padding: "40px 36px", maxWidth: 460, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            Selamat Datang ke MersingRental
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Platform sewa bilik pelajar terpercaya di Mersing, Johor.<br />
            Sila pilih peranan anda untuk meneruskan.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <button
            onClick={() => onSelect("student")}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 20px", borderRadius: 14, border: "2px solid var(--border-subtle)",
              background: "var(--bg-elevated)", cursor: "pointer", transition: "all 200ms",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"; }}
          >
            <div style={{ fontSize: 32, flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Saya Pelajar</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Cari & tempah bilik sewa pelajar</div>
            </div>
            <svg style={{ marginLeft: "auto", flexShrink: 0, color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button
            onClick={() => onSelect("landlord")}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 20px", borderRadius: 14, border: "2px solid var(--border-subtle)",
              background: "var(--bg-elevated)", cursor: "pointer", transition: "all 200ms",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#14b8a6"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(20,184,166,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"; }}
          >
            <div style={{ fontSize: 32, flexShrink: 0 }}>🔑</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Saya Tuan Rumah</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Senarai bilik & chat dengan pelajar</div>
            </div>
            <svg style={{ marginLeft: "auto", flexShrink: 0, color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 24 }}>
          Tiada log masuk diperlukan · Tanpa nama · Boleh tukar kemudian
        </p>
      </div>
    </div>
  );
}
