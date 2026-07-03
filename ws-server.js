/**
 * NexusChat WebSocket Server
 * Standalone ws server on port 3001.
 * - Assigns each connection an anonymous identity (name + color)
 * - Maintains per-channel message history (last 100 messages)
 * - Broadcasts every message to ALL connected clients in real-time
 * - No authentication required
 */

const { WebSocketServer, WebSocket } = require("ws");

const PORT = 3001;
const MAX_HISTORY = 100;

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
 * clients: Map<ws, { user, activeChannelId }>
 * history: Map<channelId, Message[]>
 */
const clients  = new Map();
const history  = new Map(CHANNEL_DEFS.map((c) => [c.id, []]));

// ── Helpers ───────────────────────────────────────────────────────────────────

function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

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

// ── Server ────────────────────────────────────────────────────────────────────

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`\n✅  NexusChat WebSocket server running on ws://localhost:${PORT}\n`);
});

wss.on("connection", (ws) => {
  const user = generateUser();
  clients.set(ws, { user, activeChannelId: "general" });

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
    ws
  );

  // ── Incoming messages ───────────────────────────────────────────────────────

  ws.on("message", (raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    const clientInfo = clients.get(ws);
    if (!clientInfo) return;

    switch (data.type) {

      // Client switched to a different channel — send its history
      case "switch_channel": {
        const { channelId } = data;
        if (!history.has(channelId)) return;
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
        if (!content?.trim() || !history.has(channelId)) return;

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
        // Broadcast to EVERYONE including sender
        broadcastAll({ type: "message", message: msg });
        console.log(`[msg] #${channelId} | ${clientInfo.user.name}: ${content.trim().slice(0, 60)}`);
        break;
      }

      // Client added/toggled a reaction
      case "react": {
        const { messageId, channelId, emoji } = data;
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
    }
  });

  // ── Disconnect ──────────────────────────────────────────────────────────────

  ws.on("close", () => {
    const info = clients.get(ws);
    if (info) {
      console.log(`[-] ${info.user.name} disconnected  (total: ${connectedCount() - 1})`);
      clients.delete(ws);
      broadcastOnlineCount();
      broadcastAll({
        type: "system_message",
        channelId: "general",
        content: `${info.user.name} left the chat`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  ws.on("error", (err) => {
    console.error("WS error:", err.message);
  });
});
