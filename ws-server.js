/**
 * NexusChat WebSocket Server
 * Standalone ws server on port 3001.
 * - Assigns each connection an anonymous identity (name + color)
 * - Maintains per-channel message history (last 100 messages)
 * - Broadcasts every message to ALL connected clients in real-time
 * - No authentication required
 *
 * Ghost-connection protection
 * ───────────────────────────
 * Ghost connections are sockets that appear OPEN in the OS but whose remote
 * end has silently disappeared (mobile switching networks, browser tab killed,
 * NAT/firewall timeout, etc.).  Without defences they accumulate in `clients`,
 * inflate `onlineCount`, and can throw synchronous errors on ws.send().
 *
 * Three layers of defence are used:
 *  1. try/catch around every ws.send() — prevents one broken socket from
 *     crashing a broadcast loop.
 *  2. Heartbeat ping/pong (every HEARTBEAT_MS) — the server pings every client;
 *     any client that fails to pong within the interval is force-terminated and
 *     cleaned up via terminateGhost().
 *  3. Top-level process.on('uncaughtException') — last-resort guard so a
 *     truly unexpected synchronous throw does not kill the process.
 *
 * Idle-session timeout
 * ────────────────────
 * A client's lastActivityAt timestamp is refreshed on every incoming message.
 * If no message is received within IDLE_TIMEOUT_MS the session is terminated:
 *  • At (IDLE_TIMEOUT_MS - IDLE_WARN_MS) the client receives an `idle_warning`
 *    event so the UI can show a countdown.
 *  • At IDLE_TIMEOUT_MS the session is force-closed with a `session_expired`
 *    event sent immediately before closure.
 */

"use strict";

const { WebSocketServer, WebSocket } = require("ws");

const PORT          = 3001;
const MAX_HISTORY   = 100;
const HEARTBEAT_MS  = 30_000; // ping every 30 s

// Idle session timeout
const IDLE_TIMEOUT_MS = 5 * 60 * 1_000;  // 5 minutes  — terminate after this
const IDLE_WARN_MS    = 60 * 1_000;       // 1 minute   — warn this long before
const IDLE_CHECK_MS   = 30_000;           // check every 30 s

// ── Anonymous name generator ──────────────────────────────────────────────────

const ADJECTIVES = [
  "Swift", "Bold", "Calm", "Daring", "Epic", "Fierce", "Gentle", "Happy",
  "Icy", "Jolly", "Kind", "Lively", "Mystic", "Noble", "Odd", "Proud",
  "Quick", "Rare", "Silent", "Tiny", "Ultra", "Vivid", "Wild", "Zesty",
];

const NOUNS = [
  "Panda", "Eagle", "Tiger", "Falcon", "Wolf", "Fox", "Lynx", "Hawk",
  "Bear", "Deer", "Crab", "Dove", "Frog", "Goat", "Hare", "Ibis",
  "Jaguar", "Koala", "Llama", "Mink", "Newt", "Orca", "Pike", "Quail",
];

const USER_COLORS = [
  "hsl(239,84%,67%)", "hsl(330,81%,60%)", "hsl(142,71%,45%)",
  "hsl(38,92%,50%)",  "hsl(200,80%,55%)", "hsl(280,75%,60%)",
  "hsl(15,90%,60%)",  "hsl(170,75%,45%)", "hsl(55,85%,50%)",
  "hsl(300,70%,60%)",
];

let nameCounter = 0;
function generateUser() {
  const adj   = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun  = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const color = USER_COLORS[nameCounter % USER_COLORS.length];
  nameCounter++;
  return {
    id:    `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name:  `${adj}${noun}`,
    color,
  };
}

// ── Channel definitions ───────────────────────────────────────────────────────

const CHANNEL_DEFS = [
  { id: "general",       name: "general",       icon: "💬", description: "General discussions for everyone", pinned: true },
  { id: "design",        name: "design",         icon: "🎨", description: "UI/UX design discussions and feedback" },
  { id: "engineering",   name: "engineering",    icon: "⚙️", description: "Code reviews, tech discussions, and bugs" },
  { id: "random",        name: "random",         icon: "🎲", description: "Off-topic fun and random stuff" },
  { id: "announcements", name: "announcements",  icon: "📢", description: "Important team announcements", pinned: true },
];

// ── In-memory state ───────────────────────────────────────────────────────────

/**
 * clients: Map<ws, { user, activeChannelId, isAlive, lastActivityAt, warnedIdle }>
 *   isAlive        — toggled false before each ping; set true on pong.
 *                    If still false at next ping the socket is a ghost.
 *   lastActivityAt — Date.now() of the last incoming message from this client.
 *   warnedIdle     — true once the idle warning has been sent, to avoid
 *                    repeating the warning every check cycle.
 * history: Map<channelId, Message[]>
 */
const clients = new Map();
const history = new Map(CHANNEL_DEFS.map((c) => [c.id, []]));

// ── Ghost-connection helpers ──────────────────────────────────────────────────

/**
 * Safely terminate a ghost / dead socket and remove it from `clients`.
 * Uses ws.terminate() (hard close) instead of ws.close() because a ghost
 * socket will never complete the graceful closing handshake.
 */
function terminateGhost(ws) {
  try {
    const info = clients.get(ws);
    if (info) {
      console.warn(`[ghost] Terminating ghost connection: ${info.user.name}`);
      clients.delete(ws);
    }
    ws.terminate(); // forceful — does NOT wait for close handshake
  } catch (err) {
    console.error("[ghost] Error while terminating ghost socket:", err.message);
  }
}

/**
 * Reset the idle timer for a client whenever activity is detected.
 */
function touchActivity(ws) {
  const info = clients.get(ws);
  if (!info) return;
  info.lastActivityAt = Date.now();
  info.warnedIdle     = false; // reset warning flag so it fires again next idle period
}

/**
 * Safely send a JSON payload to a single socket.
 * Returns true if the send succeeded, false if the socket was dead/broken.
 * On failure the socket is terminated and removed from `clients`.
 */
function send(ws, payload) {
  // Guard 1: readyState check (cheap, synchronous)
  if (ws.readyState !== WebSocket.OPEN) {
    if (clients.has(ws)) {
      console.warn("[send] Socket not OPEN — terminating ghost.");
      terminateGhost(ws);
    }
    return false;
  }

  // Guard 2: try/catch around the actual write
  try {
    ws.send(JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error(`[send] ws.send() threw — terminating ghost: ${err.message}`);
    terminateGhost(ws);
    return false;
  }
}

/**
 * Broadcast to all clients except an optional exclusion.
 * Dead sockets discovered during iteration are evicted immediately.
 */
function broadcast(payload, excludeWs = null) {
  for (const [ws] of clients) {
    if (ws !== excludeWs) send(ws, payload);
  }
}

function broadcastAll(payload) {
  broadcast(payload, null);
}

function connectedCount() {
  return clients.size;
}

function broadcastOnlineCount() {
  broadcastAll({ type: "online_count", count: connectedCount() });
}

function storeMessage(msg) {
  const ch = history.get(msg.channelId);
  if (!ch) return;
  ch.push(msg);
  if (ch.length > MAX_HISTORY) ch.splice(0, ch.length - MAX_HISTORY);
}

// ── Heartbeat — detect & evict ghost connections ──────────────────────────────

const heartbeatInterval = setInterval(() => {
  let evicted = 0;

  for (const [ws, info] of clients) {
    if (!info.isAlive) {
      // No pong received since last ping → ghost
      console.warn(`[heartbeat] No pong from ${info.user.name} — evicting ghost.`);
      terminateGhost(ws);
      evicted++;
      continue;
    }

    // Mark dead; will be set true again when pong arrives
    info.isAlive = false;

    try {
      ws.ping(); // sends a WS ping frame; browser/ws-client auto-replies with pong
    } catch (err) {
      console.error(`[heartbeat] ping() threw for ${info.user.name}: ${err.message}`);
      terminateGhost(ws);
      evicted++;
    }
  }

  if (evicted > 0) {
    console.log(`[heartbeat] Evicted ${evicted} ghost(s). Active: ${connectedCount()}`);
    broadcastOnlineCount();
  }
}, HEARTBEAT_MS);

// Prevent the interval from blocking process exit
heartbeatInterval.unref();

// ── Idle session checker ──────────────────────────────────────────────────────

const idleCheckInterval = setInterval(() => {
  const now = Date.now();

  for (const [ws, info] of clients) {
    const idleMs = now - info.lastActivityAt;

    if (idleMs >= IDLE_TIMEOUT_MS) {
      // ── Session expired — notify and terminate ────────────────────────────
      console.log(`[idle] Session expired for ${info.user.name} (idle ${Math.round(idleMs / 1000)}s)`);
      try {
        send(ws, {
          type:    "session_expired",
          reason:  "You were disconnected due to inactivity.",
          idleSec: Math.round(idleMs / 1000),
        });
      } catch (_) { /* socket may already be dead — terminateGhost handles it */ }

      // Broadcast departure before cleaning up
      clients.delete(ws);
      broadcastAll({
        type:      "system_message",
        channelId: "general",
        content:   `${info.user.name} was disconnected due to inactivity.`,
        timestamp: new Date().toISOString(),
      });
      broadcastOnlineCount();

      try { ws.terminate(); } catch (_) {}

    } else if (!info.warnedIdle && idleMs >= IDLE_TIMEOUT_MS - IDLE_WARN_MS) {
      // ── Approaching timeout — send a countdown warning ────────────────────
      const remainingSec = Math.round((IDLE_TIMEOUT_MS - idleMs) / 1000);
      console.log(`[idle] Warning sent to ${info.user.name} — ${remainingSec}s remaining`);
      info.warnedIdle = true;
      send(ws, {
        type:         "idle_warning",
        remainingSec,
        message:      `You will be disconnected in ${remainingSec}s due to inactivity. Send a message to stay connected.`,
      });
    }
  }
}, IDLE_CHECK_MS);

idleCheckInterval.unref();

// ── Server ────────────────────────────────────────────────────────────────────

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`\n✅  NexusChat WebSocket server running on ws://localhost:${PORT}`);
  console.log(`   Ghost detection: heartbeat every ${HEARTBEAT_MS / 1000}s\n`);
});

wss.on("connection", (ws) => {
  const user = generateUser();

  // isAlive starts true — we haven't pinged yet
  // lastActivityAt set to now so the idle clock starts from connection time
  clients.set(ws, {
    user,
    activeChannelId: "general",
    isAlive:         true,
    lastActivityAt:  Date.now(),
    warnedIdle:      false,
  });

  // Reply to pong frames from this client
  ws.on("pong", () => {
    const info = clients.get(ws);
    if (info) info.isAlive = true;
  });

  console.log(`[+] ${user.name} connected  (total: ${connectedCount()})`);

  // 1. Send init payload to the new client
  send(ws, {
    type:     "init",
    user,
    channels: CHANNEL_DEFS,
  });

  // 2. Send history for default channel
  send(ws, {
    type:      "history",
    channelId: "general",
    messages:  history.get("general") ?? [],
  });

  // 3. Broadcast updated online count to everyone
  broadcastOnlineCount();

  // 4. Notify others that someone joined
  broadcast(
    { type: "system_message", channelId: "general", content: `${user.name} joined the chat`, timestamp: new Date().toISOString() },
    ws,
  );

  // ── Incoming messages ───────────────────────────────────────────────────────

  ws.on("message", (raw) => {
    // Guard: parse errors from malformed payloads
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.warn("[msg] Received non-JSON payload — ignoring.");
      return;
    }

    const clientInfo = clients.get(ws);
    if (!clientInfo) {
      // Socket sent a message but is no longer registered — stale ghost
      console.warn("[msg] Message from unregistered socket — terminating.");
      terminateGhost(ws);
      return;
    }

    // Any incoming frame from a registered client counts as activity.
    // This resets the idle timer and clears any pending idle warning.
    touchActivity(ws);

    // Guard: data must be a plain object with a string type
    if (!data || typeof data !== "object" || typeof data.type !== "string") {
      console.warn("[msg] Malformed message structure — ignoring.");
      return;
    }

    try {
      switch (data.type) {

        // Client switched to a different channel — send its history
        case "switch_channel": {
          const { channelId } = data;
          if (typeof channelId !== "string" || !history.has(channelId)) {
            console.warn(`[switch_channel] Unknown channelId: ${channelId}`);
            return;
          }
          clientInfo.activeChannelId = channelId;
          send(ws, {
            type:      "history",
            channelId,
            messages:  history.get(channelId) ?? [],
          });
          break;
        }

        // Client sent a chat message — store + broadcast to ALL
        case "send_message": {
          const { channelId, content } = data;
          if (
            typeof channelId !== "string" ||
            typeof content   !== "string" ||
            !content.trim() ||
            !history.has(channelId)
          ) return;

          const msg = {
            id:        `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            channelId,
            userId:    clientInfo.user.id,
            userName:  clientInfo.user.name,
            userColor: clientInfo.user.color,
            content:   content.trim(),
            timestamp: new Date().toISOString(),
          };

          storeMessage(msg);
          broadcastAll({ type: "message", message: msg });
          console.log(`[msg] #${channelId} | ${clientInfo.user.name}: ${content.trim().slice(0, 60)}`);
          break;
        }

        // Client added/toggled a reaction
        case "react": {
          const { messageId, channelId, emoji } = data;
          if (
            typeof messageId !== "string" ||
            typeof channelId !== "string" ||
            typeof emoji     !== "string"
          ) return;

          const msgs = history.get(channelId);
          if (!msgs) return;

          const target = msgs.find((m) => m.id === messageId);
          if (!target) return;

          if (!target.reactions) target.reactions = {};
          const reactors = target.reactions[emoji] ?? [];
          const idx = reactors.indexOf(clientInfo.user.id);
          if (idx === -1) reactors.push(clientInfo.user.id);
          else            reactors.splice(idx, 1);
          target.reactions[emoji] = reactors;

          broadcastAll({ type: "reaction", messageId, channelId, emoji, reactors });
          break;
        }

        default:
          console.warn(`[msg] Unknown message type: "${data.type}" — ignoring.`);
      }
    } catch (err) {
      // Catch any unexpected throw inside a message handler so it never
      // propagates and never crashes the server process.
      console.error(`[msg] Unexpected error handling "${data.type}": ${err.message}`);
    }
  });

  // ── Disconnect ──────────────────────────────────────────────────────────────

  ws.on("close", (code, reason) => {
    const info = clients.get(ws);
    if (info) {
      console.log(`[-] ${info.user.name} disconnected (code: ${code})  (total: ${connectedCount() - 1})`);
      clients.delete(ws);
      broadcastOnlineCount();
      broadcastAll({
        type:      "system_message",
        channelId: "general",
        content:   `${info.user.name} left the chat`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  ws.on("error", (err) => {
    // Log but do NOT re-throw — re-throwing here would crash the process.
    console.error(`[ws-error] ${clients.get(ws)?.user?.name ?? "unknown"}: ${err.message}`);
    // Attempt a graceful clean-up; terminateGhost is safe to call multiple times.
    terminateGhost(ws);
  });
});

// ── Top-level safety net ──────────────────────────────────────────────────────
// Catches any synchronous throw that somehow escapes all the try/catch blocks.
// Logs the error but keeps the process alive.
process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION] Server kept alive:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION] Server kept alive:", reason);
});
