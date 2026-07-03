"use client";

import { WsMessage } from "../hooks/useChat";

interface MessageBubbleProps {
  message: WsMessage;
  myUserId: string;
  showHeader: boolean; // first in a consecutive group
  onReact: (messageId: string, channelId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "✨", "👏"];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name
    .split(/(?=[A-Z])/)   // split on capital letters (camelCase names)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MessageBubble({ message, myUserId, showHeader, onReact }: MessageBubbleProps) {
  const isOwn = message.userId === myUserId;

  // ── System message ──────────────────────────────────────────────────────────
  if (message.type === "system") {
    return (
      <div style={{ textAlign: "center", padding: "8px 0", fontSize: 12, color: "var(--text-muted)" }}>
        <span style={{ background: "var(--bg-elevated)", borderRadius: 20, padding: "4px 14px", display: "inline-block" }}>
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 10,
        padding: showHeader ? "10px 0 2px" : "2px 0",
      }}
    >
      {/* Avatar */}
      <div style={{ width: 36, flexShrink: 0 }}>
        {showHeader && !isOwn && (
          <div
            title={message.userName}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${message.userColor}, ${message.userColor}99)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              userSelect: "none",
              boxShadow: `0 2px 8px ${message.userColor}55`,
              letterSpacing: "0.02em",
            }}
          >
            {getInitials(message.userName)}
          </div>
        )}
      </div>

      {/* Bubble column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", maxWidth: "70%", minWidth: 0 }}>

        {/* Name + time */}
        {showHeader && !isOwn && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4, paddingLeft: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: message.userColor }}>{message.userName}</span>
            <span suppressHydrationWarning style={{ fontSize: 10, color: "var(--text-muted)" }}>{formatTime(message.timestamp)}</span>
          </div>
        )}

        {/* Hover reaction bar + bubble */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={(e) => {
            const bar = e.currentTarget.querySelector<HTMLDivElement>(".reaction-bar");
            if (bar) { bar.style.opacity = "1"; bar.style.pointerEvents = "auto"; }
          }}
          onMouseLeave={(e) => {
            const bar = e.currentTarget.querySelector<HTMLDivElement>(".reaction-bar");
            if (bar) { bar.style.opacity = "0"; bar.style.pointerEvents = "none"; }
          }}
        >
          {/* Quick reaction bar */}
          <div
            className="reaction-bar"
            style={{
              position: "absolute",
              top: -32,
              [isOwn ? "left" : "right"]: 0,
              display: "flex",
              gap: 2,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 20,
              padding: "4px 8px",
              opacity: 0,
              transition: "opacity 150ms",
              pointerEvents: "none",
              zIndex: 10,
              boxShadow: "var(--shadow-card)",
              whiteSpace: "nowrap",
            }}
          >
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact(message.id, message.channelId, emoji)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 3px", borderRadius: 6, transition: "transform 150ms", lineHeight: 1 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* The bubble */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: isOwn ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: isOwn ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "var(--bg-panel)",
              color: isOwn ? "#fff" : "var(--text-primary)",
              fontSize: 14,
              lineHeight: 1.55,
              wordBreak: "break-word",
              boxShadow: isOwn ? "0 4px 16px rgba(99,102,241,0.35)" : "0 2px 8px rgba(0,0,0,0.25)",
              border: isOwn ? "none" : "1px solid var(--border-subtle)",
            }}
          >
            {message.content}
            {isOwn && (
              <div suppressHydrationWarning style={{ fontSize: 10, opacity: 0.65, marginTop: 4, textAlign: "right" }}>
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
            {Object.entries(message.reactions)
              .filter(([, users]) => users.length > 0)
              .map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(message.id, message.channelId, emoji)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: users.includes(myUserId) ? "rgba(99,102,241,0.2)" : "var(--bg-elevated)",
                    border: `1px solid ${users.includes(myUserId) ? "rgba(99,102,241,0.4)" : "var(--border-subtle)"}`,
                    borderRadius: 12, padding: "2px 8px", cursor: "pointer",
                    fontSize: 13, color: "var(--text-secondary)", transition: "all 150ms", fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.2)"; }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = users.includes(myUserId) ? "rgba(99,102,241,0.2)" : "var(--bg-elevated)";
                  }}
                >
                  <span style={{ fontSize: 14 }}>{emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{users.length}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
