"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "../hooks/useRole";

export default function Navbar() {
  const { role, setRole } = useRole();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(15,23,42,0.9)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
      height: 60, display: "flex", alignItems: "center",
      padding: "0 24px", gap: 24,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
        }}>🏠</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>MersingRental</div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Student Accommodation</div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
        <NavLink href="/" active={pathname === "/"}>Browse Rooms</NavLink>
        <NavLink href="/chat" active={isActive("/chat")}>
          My Chats
          <span style={{ marginLeft: 6, background: "#3b82f6", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 6px" }}>Live</span>
        </NavLink>
      </div>

      {/* Role badge */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        {role && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            borderRadius: 99, padding: "5px 14px",
          }}>
            <span style={{ fontSize: 14 }}>{role === "student" ? "🎓" : "🔑"}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: role === "student" ? "#3b82f6" : "#14b8a6" }}>
              {role === "student" ? "Pelajar" : "Tuan Rumah"}
            </span>
            <button
              onClick={() => setRole(null)}
              title="Tukar peranan"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 12, padding: "0 0 0 4px", lineHeight: 1 }}
            >×</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "6px 14px", borderRadius: 8, textDecoration: "none",
      fontSize: 13, fontWeight: active ? 600 : 400,
      color: active ? "var(--text-primary)" : "var(--text-secondary)",
      background: active ? "rgba(59,130,246,0.12)" : "transparent",
      transition: "all 150ms",
    }}>
      {children}
    </Link>
  );
}
