"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WsUser {
  id: string;
  name: string;
  color: string;
}

export interface WsMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: string; // ISO
  reactions?: Record<string, string[]>; // emoji -> userIds
  type?: "text" | "system";
}

export interface WsChannel {
  id: string;
  name: string;
  icon: string;
  description: string;
  pinned?: boolean;
}

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

interface UseChat {
  myUser: WsUser | null;
  messages: Record<string, WsMessage[]>;
  channels: WsChannel[];
  onlineCount: number;
  connectionState: ConnectionState;
  sendMessage: (channelId: string, content: string) => void;
  switchChannel: (channelId: string) => void;
  sendReaction: (messageId: string, channelId: string, emoji: string) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const WS_URL = "ws://124.217.248.234:20203";
const RECONNECT_DELAY_MS = 3000;

export function useChat(): UseChat {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [myUser,          setMyUser]          = useState<WsUser | null>(null);
  const [messages,        setMessages]        = useState<Record<string, WsMessage[]>>({});
  const [channels,        setChannels]        = useState<WsChannel[]>([]);
  const [onlineCount,     setOnlineCount]     = useState(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");

  // Keep a ref so event handlers always read fresh state
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const send = useCallback((payload: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const connect = useCallback(() => {
    setConnectionState("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState("connected");
      // Clear any pending reconnect timer
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (event) => {
      let data: any;
      try { data = JSON.parse(event.data); } catch { return; }

      switch (data.type) {

        case "init": {
          setMyUser(data.user);
          setChannels(data.channels ?? []);
          break;
        }

        case "history": {
          const { channelId, messages: msgs } = data as { channelId: string; messages: WsMessage[] };
          setMessages((prev) => ({ ...prev, [channelId]: msgs }));
          break;
        }

        case "message": {
          const msg: WsMessage = data.message;
          setMessages((prev) => ({
            ...prev,
            [msg.channelId]: [...(prev[msg.channelId] ?? []), msg],
          }));
          break;
        }

        case "system_message": {
          const sysMsg: WsMessage = {
            id:        `sys_${Date.now()}`,
            channelId: data.channelId,
            userId:    "system",
            userName:  "System",
            userColor: "#484f58",
            content:   data.content,
            timestamp: data.timestamp,
            type:      "system",
          };
          setMessages((prev) => ({
            ...prev,
            [data.channelId]: [...(prev[data.channelId] ?? []), sysMsg],
          }));
          break;
        }

        case "online_count": {
          setOnlineCount(data.count);
          break;
        }

        case "reaction": {
          const { messageId, channelId, emoji, reactors } = data;
          setMessages((prev) => {
            const channelMsgs = prev[channelId] ?? [];
            return {
              ...prev,
              [channelId]: channelMsgs.map((m) =>
                m.id === messageId
                  ? { ...m, reactions: { ...(m.reactions ?? {}), [emoji]: reactors } }
                  : m
              ),
            };
          });
          break;
        }
      }
    };

    ws.onerror = () => {
      setConnectionState("error");
    };

    ws.onclose = () => {
      setConnectionState("disconnected");
      // Auto-reconnect
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      reconnectTimer.current && clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((channelId: string, content: string) => {
    send({ type: "send_message", channelId, content });
  }, [send]);

  const switchChannel = useCallback((channelId: string) => {
    send({ type: "switch_channel", channelId });
  }, [send]);

  const sendReaction = useCallback((messageId: string, channelId: string, emoji: string) => {
    send({ type: "react", messageId, channelId, emoji });
  }, [send]);

  return {
    myUser,
    messages,
    channels,
    onlineCount,
    connectionState,
    sendMessage,
    switchChannel,
    sendReaction,
  };
}
