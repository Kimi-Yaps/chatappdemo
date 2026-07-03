"use client";

import { useState, useRef, useCallback } from "react";

interface MessageInputProps {
  channelName: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}

const EMOJI_SUGGESTIONS = ["😀", "😂", "❤️", "👍", "🔥", "✨", "🎉", "👏", "🚀", "💯"];

export default function MessageInput({ channelName, onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    setShowEmoji(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const insertEmoji = (emoji: string) => {
    setValue((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const canSend = value.trim().length > 0;

  return (
    <div style={{ position: "relative" }}>
      {/* Emoji panel */}
      {showEmoji && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 16,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 14,
            padding: "10px 12px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            maxWidth: 260,
            boxShadow: "var(--shadow-card)",
            animation: "fadeSlideUp 0.2s ease",
            zIndex: 20,
          }}
        >
          {EMOJI_SUGGESTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => insertEmoji(emoji)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 22,
                padding: 4,
                borderRadius: 8,
                transition: "transform 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.3)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          background: "var(--bg-input)",
          border: "1px solid var(--border-default)",
          borderRadius: 16,
          padding: "10px 12px 10px 16px",
          transition: "border-color 150ms, box-shadow 150ms",
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = "var(--border-default)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Attach button */}
        <button
          title="Attach file"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 4,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            transition: "color 150ms",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            resize: "none",
            color: "var(--text-primary)",
            fontSize: 14,
            lineHeight: 1.55,
            fontFamily: "inherit",
            caretColor: "var(--accent-primary)",
            overflow: "hidden",
            maxHeight: 140,
          }}
        />

        {/* Emoji button */}
        <button
          title="Add emoji"
          onClick={() => setShowEmoji((v) => !v)}
          style={{
            background: showEmoji ? "rgba(99,102,241,0.15)" : "none",
            border: "none",
            cursor: "pointer",
            color: showEmoji ? "var(--accent-primary)" : "var(--text-muted)",
            padding: 4,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            transition: "all 150ms",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!showEmoji) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            if (!showEmoji) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend || disabled}
          title="Send message (Enter)"
          style={{
            background: canSend
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "var(--bg-elevated)",
            border: "none",
            cursor: canSend ? "pointer" : "default",
            color: canSend ? "white" : "var(--text-muted)",
            padding: "7px",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            transform: canSend ? "scale(1)" : "scale(0.9)",
            boxShadow: canSend ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (canSend) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            if (canSend) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Hint */}
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6, paddingLeft: 4 }}>
        Press <kbd style={{ background: "var(--bg-elevated)", borderRadius: 4, padding: "1px 5px", fontSize: 10, border: "1px solid var(--border-subtle)" }}>Enter</kbd> to send &nbsp;·&nbsp;
        <kbd style={{ background: "var(--bg-elevated)", borderRadius: 4, padding: "1px 5px", fontSize: 10, border: "1px solid var(--border-subtle)" }}>Shift+Enter</kbd> for new line
      </div>
    </div>
  );
}
