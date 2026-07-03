"use client";

import { useState, useEffect, useRef } from "react";
import { useChat, WsMessage, WsChannel } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// ── Connection status badge ───────────────────────────────────────────────────

const STATUS_CONFIG = {
  connecting:   { label: "Connecting…",  color: "#f59e0b", dot: "#f59e0b" },
  connected:    { label: "Connected",    color: "#22c55e", dot: "#22c55e" },
  disconnected: { label: "Reconnecting…",color: "#f59e0b", dot: "#f59e0b" },
  error:        { label: "Error",        color: "#ef4444", dot: "#ef4444" },
};

// ── Main App ──────────────────────────────────────────────────────────────────

export default function ChatApp() {
  const {
    myUser,
    messages,
    channels,
    onlineCount,
    connectionState,
    sendMessage,
    switchChannel,
    sendReaction,
  } = useChat();

  const [activeChannelId, setActiveChannelId] = useState("general");
  const [unread, setUnread]         = useState<Record<string, number>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel   = channels.find((c) => c.id === activeChannelId) ?? null;
  const channelMessages = messages[activeChannelId] ?? [];

  // Auto-scroll on new messages in active channel
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length]);

  // Track unread counts for background channels
  const prevLengths = useRef<Record<string, number>>({});
  useEffect(() => {
    for (const [chId, msgs] of Object.entries(messages)) {
      if (chId === activeChannelId) {
        prevLengths.current[chId] = msgs.length;
        continue;
      }
      const prev = prevLengths.current[chId] ?? msgs.length;
      const diff = msgs.length - prev;
      if (diff > 0) {
        setUnread((u) => ({ ...u, [chId]: (u[chId] ?? 0) + diff }));
      }
      prevLengths.current[chId] = msgs.length;
    }
  }, [messages, activeChannelId]);

  const handleSelectChannel = (chId: string) => {
    setActiveChannelId(chId);
    setUnread((u) => ({ ...u, [chId]: 0 }));
    switchChannel(chId);
  };

  const handleSend = (content: string) => {
    sendMessage(activeChannelId, content);
  };

  // Group messages — show header only when sender changes
  const showHeader = (idx: number, msgs: WsMessage[]) => {
    if (idx === 0) return true;
    const prev = msgs[idx - 1];
    const cur  = msgs[idx];
    return prev.userId !== cur.userId || prev.type === "system" || cur.type === "system";
  };

  const statusCfg = STATUS_CONFIG[connectionState];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-base)" }}>

      {/* ══ SIDEBAR ════════════════════════════════════════════════════════════ */}
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 250ms cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
      }}>

        {/* Workspace header */}
        <div style={{ padding: "0 16px", height: 64, display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 4px 12px rgba(99,102,241,0.4)", flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>NexusChat</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Open Group Chat</div>
          </div>
        </div>

        {/* Online indicator */}
        <div style={{ padding: "10px 16px 6px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: statusCfg.dot,
              display: "inline-block",
              animation: connectionState === "connected" ? "pulse-dot 2s ease-in-out infinite" : "none",
            }} />
            <span style={{ color: statusCfg.color, fontWeight: 600 }}>{statusCfg.label}</span>
            {connectionState === "connected" && (
              <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>
                {onlineCount} online
              </span>
            )}
          </div>
        </div>

        {/* Channel list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {/* Pinned */}
          {channels.filter((c) => c.pinned).length > 0 && (
            <SidebarSection label="Pinned">
              {channels.filter((c) => c.pinned).map((ch) => (
                <ChannelRow key={ch.id} channel={ch} isActive={ch.id === activeChannelId}
                  unread={unread[ch.id] ?? 0} onClick={() => handleSelectChannel(ch.id)} />
              ))}
            </SidebarSection>
          )}

          <SidebarSection label="Channels">
            {channels.filter((c) => !c.pinned).map((ch) => (
              <ChannelRow key={ch.id} channel={ch} isActive={ch.id === activeChannelId}
                unread={unread[ch.id] ?? 0} onClick={() => handleSelectChannel(ch.id)} />
            ))}
          </SidebarSection>
        </div>

        {/* My identity footer */}
        {myUser && (
          <div style={{
            padding: "10px 14px", borderTop: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
            background: "rgba(0,0,0,0.2)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${myUser.color}, ${myUser.color}99)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
              boxShadow: `0 2px 8px ${myUser.color}55`,
            }}>
              {myUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {myUser.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Anonymous · You</div>
            </div>
          </div>
        )}
      </aside>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "0 20px",
          height: 64, borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(22,27,34,0.85)", backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 6, borderRadius: 8,
              display: "flex", alignItems: "center", transition: "all 150ms",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>

          {/* Channel identity */}
          {activeChannel ? (
            <>
              <span style={{ fontSize: 20 }}>{activeChannel.icon}</span>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>#</span>
                  {activeChannel.name}
                </h2>
                <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activeChannel.description}
                </p>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Select a channel</div>
          )}

          {/* Right side stats */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: connectionState === "connected" ? "var(--online)" : statusCfg.dot,
                display: "inline-block",
                animation: connectionState === "connected" ? "pulse-dot 2s ease-in-out infinite" : "none",
              }} />
              <span style={{ fontWeight: 600, color: statusCfg.color }}>{statusCfg.label}</span>
              {connectionState === "connected" && (
                <span style={{ color: "var(--text-muted)" }}>· {onlineCount} online</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Messages area ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Channel welcome */}
          {activeChannel && (
            <div style={{ padding: "28px 24px 16px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 12,
                background: "var(--bg-panel)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>
                {activeChannel.icon}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                #{activeChannel.name}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {activeChannel.description} · Anyone connected can see and send messages in real-time.
              </p>
            </div>
          )}

          {/* Connection waiting state */}
          {connectionState !== "connected" && channelMessages.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--bg-panel)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={statusCfg.dot} strokeWidth="1.5">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                  <line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                  {statusCfg.label}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  ws://124.217.248.234:20203
                </p>
              </div>
            </div>
          )}

          {/* Message list */}
          <div style={{ flex: 1, padding: "8px 24px 16px" }}>
            {myUser && channelMessages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                myUserId={myUser.id}
                showHeader={showHeader(idx, channelMessages)}
                onReact={sendReaction}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input ─────────────────────────────────────────────────────────── */}
        <div style={{
          padding: "12px 24px 16px",
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(13,17,23,0.85)", backdropFilter: "blur(12px)", flexShrink: 0,
        }}>
          <MessageInput
            channelName={activeChannel?.name ?? ""}
            onSend={handleSend}
            disabled={connectionState !== "connected"}
          />
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ padding: "8px 4px 4px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        {label}
      </div>
      {children}
    </div>
  );
}

function ChannelRow({ channel, isActive, unread, onClick }: {
  channel: WsChannel; isActive: boolean; unread: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "8px 12px", borderRadius: 8,
        border: "none", cursor: "pointer", textAlign: "left",
        background: isActive ? "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))" : "transparent",
        boxShadow: isActive ? "inset 0 0 0 1px rgba(99,102,241,0.3)" : "none",
        position: "relative", transition: "all 150ms",
      }}
      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
    >
      {isActive && (
        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: "linear-gradient(180deg,#6366f1,#8b5cf6)", borderRadius: "0 3px 3px 0" }} />
      )}
      <span style={{ fontSize: 16, flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{channel.icon}</span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: isActive || unread > 0 ? 600 : 400, color: isActive ? "#e6edf3" : unread > 0 ? "#c9d1d9" : "#8b949e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          # {channel.name}
        </span>
        {unread > 0 && (
          <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0 }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </div>
    </button>
  );
}
