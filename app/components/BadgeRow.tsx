"use client";

import { BadgeType } from "../data/properties";

const BADGE_CONFIG: Record<BadgeType, { label: string; icon: string; color: string; bg: string }> = {
  "furnished":   { label: "Fully Furnished",     icon: "🛋️",  color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
  "near-campus": { label: "Near Campus",          icon: "🏫",  color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  "wifi":        { label: "WiFi Included",        icon: "📶",  color: "#22d3ee", bg: "rgba(34,211,238,0.12)"  },
  "male-only":   { label: "Lelaki Sahaja",        icon: "👨",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  "female-only": { label: "Wanita Sahaja",        icon: "👩",  color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  "parking":     { label: "Parking Available",    icon: "🚗",  color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  "laundry":     { label: "Laundry Access",       icon: "👕",  color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  "ac":          { label: "Air-Cond",             icon: "❄️",  color: "#67e8f9", bg: "rgba(103,232,249,0.12)" },
};

interface BadgeRowProps {
  badges: BadgeType[];
  size?: "sm" | "md";
}

export default function BadgeRow({ badges, size = "md" }: BadgeRowProps) {
  const fontSize = size === "sm" ? 11 : 12;
  const iconSize = size === "sm" ? 12 : 14;
  const padding = size === "sm" ? "3px 8px" : "4px 10px";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: size === "sm" ? 4 : 6 }}>
      {badges.map((badge) => {
        const cfg = BADGE_CONFIG[badge];
        return (
          <span
            key={badge}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding, borderRadius: 99,
              background: cfg.bg,
              border: `1px solid ${cfg.color}33`,
              fontSize, fontWeight: 600, color: cfg.color,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: iconSize, lineHeight: 1 }}>{cfg.icon}</span>
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}
