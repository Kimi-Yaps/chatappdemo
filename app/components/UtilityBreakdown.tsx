"use client";

import { Property } from "../data/properties";

interface UtilityBreakdownProps {
  property: Property;
}

export default function UtilityBreakdown({ property }: UtilityBreakdownProps) {
  const { utilities } = property;

  const items = [
    {
      icon: "💧",
      label: "Air / Water",
      status: utilities.water,
      color: utilities.water === "included" ? "#34d399" : "#fb923c",
    },
    {
      icon: "⚡",
      label: "Elektrik / Electricity",
      status: utilities.electricity,
      color: utilities.electricity === "included" ? "#34d399" : "#fb923c",
    },
    {
      icon: "📶",
      label: `WiFi${utilities.wifiSpeed ? ` (${utilities.wifiSpeed})` : ""}`,
      status: utilities.wifi ? "included" : "not-included",
      color: utilities.wifi ? "#34d399" : "#6b7280",
    },
  ];

  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 14, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
        Utiliti / Utilities
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.label}</span>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 10px",
              color: item.color,
              background: item.color + "18",
              border: `1px solid ${item.color}33`,
              whiteSpace: "nowrap",
            }}>
              {item.status === "included" ? "✓ Termasuk" : item.status === "split" ? "⇌ Dikongsi" : "✗ Tidak Termasuk"}
            </span>
          </div>
        ))}
      </div>
      {(utilities.water === "split" || utilities.electricity === "split") && (
        <div style={{
          marginTop: 12, padding: "8px 12px", borderRadius: 8,
          background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)",
          fontSize: 11, color: "#fb923c", lineHeight: 1.5,
        }}>
          ⚠️ Bil dikongsi rata antara semua penghuni bilik.<br />
          <em>Shared equally among all housemates.</em>
        </div>
      )}
    </div>
  );
}
