"use client";

import { useState } from "react";
import MersingNavbar from "../components/MersingNavbar";
import MersingFooter from "../components/MersingFooter";
import "../mersing.css";

// ── Event data ────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: "e1",
    year: "2025",
    title: "Mersing Seafood Festival",
    date: "15 March 2025",
    location: "Jeti Mersing, Johor",
    description: "Annual seafood extravaganza celebrating Mersing's rich marine heritage. Enjoy fresh catches, cooking demos, and live cultural performances by the waterfront.",
    side: "right" as const,
  },
  {
    id: "e2",
    year: "2025",
    title: "Island Hopping Rally",
    date: "20 April 2025",
    location: "Pulau Hujung & Pulau Rawa",
    description: "A guided multi-island adventure covering Pulau Hujung, Rawa and Besar. Snorkeling, beach volleyball, and overnight camping available.",
    side: "left" as const,
  },
  {
    id: "e3",
    year: "2025",
    title: "Mersing Cultural Night",
    date: "12 July 2025",
    location: "Dataran Mersing",
    description: "Experience traditional Malay arts, Johorean cuisine, batik demonstrations, and traditional music under the stars at Mersing's open square.",
    side: "right" as const,
  },
  {
    id: "e4",
    year: "2025",
    title: "Turtle Conservation Walk",
    date: "30 August 2025",
    location: "Pantai Mersing",
    description: "Join marine biologists on a night walk to witness sea turtle nesting. Learn about conservation efforts protecting Mersing's endangered turtle population.",
    side: "left" as const,
  },
];

// ── Timeline event card ───────────────────────────────────────────────────────

function EventCard({ event }: { event: typeof EVENTS[0] }) {
  return (
    <div style={{
      background: "var(--vm-card)",
      border: "1px solid var(--vm-border)",
      borderRadius: "var(--vm-radius)",
      overflow: "hidden",
      width: "100%",
      boxShadow: "var(--vm-shadow)",
    }}>
      {/* Photo placeholder */}
      <div style={{
        height: 110,
        background: "var(--vm-card-hover)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 6, color: "var(--vm-text-muted)",
        borderBottom: "1px solid var(--vm-border)",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span style={{ fontSize: 10, opacity: 0.4 }}>Event photo</span>
      </div>
      {/* Content */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 10, color: "var(--vm-blue)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{event.date}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text-primary)", marginBottom: 4 }}>{event.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--vm-text-muted)", marginBottom: 8 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {event.location}
        </div>
        <p style={{ fontSize: 11, color: "var(--vm-text-secondary)", lineHeight: 1.6 }}>{event.description}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  return (
    <div className="vm-page" style={{ overflowY: "auto", height: "100vh" }}>
      <MersingNavbar />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "52px 24px 60px" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 700,
            color: "var(--vm-text-primary)",
            letterSpacing: "0.04em",
            marginBottom: 16,
          }}>
            Mark Your Calendar
          </h1>
          <p style={{ fontSize: 14, color: "var(--vm-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Use this interactive timeline to easily discover dates, locations, and details for special
            happenings during your trip. We invite you to experience the rich culture and community
            that makes Visit Mersing so unique.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", marginTop: 52 }}>

          {/* Vertical dashed center line */}
          <div style={{
            position: "absolute",
            left: "50%", transform: "translateX(-50%)",
            top: 0, bottom: 0, width: 0,
            borderLeft: "2px dashed var(--vm-brown-dark)",
            opacity: 0.35,
            zIndex: 0,
          }} />

          {EVENTS.map((event, idx) => (
            <div key={event.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 48px 1fr",
              alignItems: "start",
              marginBottom: 48,
              position: "relative",
            }}>
              {/* Left slot */}
              <div style={{ paddingRight: 28 }}>
                {event.side === "left" ? (
                  <EventCard event={event} />
                ) : (
                  /* Empty left — spacer with subtle label */
                  <div style={{ height: "100%" }} />
                )}
              </div>

              {/* Center dot */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 24, zIndex: 1 }}>
                <div className="vm-dot-pulse" style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "var(--vm-brown-dark)",
                  flexShrink: 0,
                }} />
              </div>

              {/* Right slot */}
              <div style={{ paddingLeft: 28 }}>
                {event.side === "right" ? (
                  <EventCard event={event} />
                ) : (
                  <div style={{ height: "100%" }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <MersingFooter />
    </div>
  );
}
