"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; text: string; time: string };
type Snapshot = any;

const SUGGESTIONS = [
  { text: "Which gate has the shortest line right now?", flag: "🇬🇧" },
  { text: "¿Dónde está el baño más cercano accesible en silla de ruedas?", flag: "🇪🇸" },
  { text: "मुझे स्टेडियम से मेट्रो कैसे मिलेगी?", flag: "🇮🇳" },
  { text: "I need first aid, where do I go?", flag: "🚑" },
  { text: "Where can I pray before kickoff?", flag: "🕌" },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function FanPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hey! I'm PULSE, your AI stadium concierge for World Cup 2026. Ask me anything — gates, restrooms, transit, accessibility, first aid — in any language you like. 🏟️",
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [aiConfigured, setAiConfigured] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", text, time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
        }),
      });
      const data = await res.json();
      setSnapshot(data.snapshot);
      setAiConfigured(data.aiConfigured);
      setMessages((m) => [...m, { role: "assistant", text: data.reply, time: nowTime() }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, I lost connection for a moment. Please try again.", time: nowTime() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-pitch-950 lg:flex-row">
      {/* ---------- SIDEBAR (desktop only) ---------- */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-steel/10 bg-pitch-900 lg:flex">
        <div className="border-b border-steel/10 px-6 py-5">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">PULSE</span>
          </Link>
          <p className="mt-1 font-body text-xs text-steel">Fan Concierge · World Cup 2026</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <h2 className="mb-3 flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-widest text-steel">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            Live Gate Status
          </h2>
          <div className="space-y-2.5">
            {snapshot?.gates?.map((g: any, i: number) => (
              <div
                key={g.id}
                className="animate-rise rounded-xl border border-steel/15 bg-pitch-800/50 p-3 opacity-0"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-medium text-cream">{g.name}</span>
                  <span
                    className={`font-display text-xs font-bold ${
                      g.status === "clear" ? "text-signal" : g.status === "moderate" ? "text-steel" : "text-alert"
                    }`}
                  >
                    {g.queueMinutes}m
                  </span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-pitch-950">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      g.status === "clear" ? "bg-signal" : g.status === "moderate" ? "bg-steel" : "bg-alert"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((g.currentFlowPerMin / g.capacityPerMin) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
            {!snapshot && (
              <div className="py-8 text-center font-body text-xs text-steel">Waiting for first message to load live data…</div>
            )}
          </div>

          {snapshot?.weather && (
            <div className="mt-6 rounded-xl border border-steel/15 bg-pitch-800/50 p-3.5">
              <h3 className="mb-1 font-display text-[11px] font-semibold uppercase tracking-widest text-steel">Weather</h3>
              <p className="font-body text-sm text-cream">
                {snapshot.weather.tempC}°C · {snapshot.weather.condition}
              </p>
              <p className="mt-0.5 font-body text-xs text-steel">Wind {snapshot.weather.windKmh} km/h</p>
            </div>
          )}
        </div>

        <div className="border-t border-steel/10 px-6 py-4">
          <Link
            href="/ops"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-steel/20 py-2.5 font-body text-xs text-steel transition hover:border-signal/40 hover:text-signal"
          >
            Switch to Ops Command Center →
          </Link>
        </div>
      </aside>

      {/* ---------- MAIN CHAT COLUMN ---------- */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-[0.3] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,black,transparent)]" />

        {/* Mobile header */}
        <header className="relative z-10 flex items-center justify-between border-b border-steel/10 bg-pitch-900/90 px-5 py-4 backdrop-blur lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-base font-semibold">PULSE</span>
          </Link>
          <Link
            href="/ops"
            className="rounded-full border border-steel/20 px-3 py-1.5 font-body text-xs text-steel transition hover:border-signal/40 hover:text-signal"
          >
            Ops View →
          </Link>
        </header>

        {/* Desktop top bar */}
        <header className="relative z-10 hidden items-center justify-between border-b border-steel/10 bg-pitch-900/60 px-8 py-4 backdrop-blur lg:flex">
          <div>
            <h1 className="font-display text-sm font-semibold text-cream">Fan Concierge</h1>
            <p className="font-body text-xs text-steel">Ask anything, in any language — grounded in live stadium data</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-signal/25 bg-signal/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal" />
            <span className="font-body text-[11px] font-medium text-signal">Gemini live</span>
          </div>
        </header>

        {!aiConfigured && (
          <div className="relative z-10 border-b border-alert/20 bg-alert/5 px-5 py-2 text-center font-body text-xs text-alert sm:px-8">
            Running in fallback mode — add GEMINI_API_KEY to unlock full multilingual AI answers.
          </div>
        )}

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 sm:px-6">
          {/* mobile-only live gate strip */}
          {snapshot && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:hidden">
              <span className="flex shrink-0 items-center gap-1 font-body text-[10px] uppercase tracking-wide text-steel">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                </span>
                Live
              </span>
              {snapshot.gates.map((g: any, i: number) => (
                <div
                  key={g.id}
                  className={`shrink-0 animate-rise rounded-lg border px-3 py-1.5 font-body text-[11px] opacity-0 ${
                    g.status === "clear"
                      ? "border-signal/30 text-signal"
                      : g.status === "moderate"
                      ? "border-steel/30 text-steel"
                      : "border-alert/30 text-alert"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {g.name.split("–")[0].trim()} · {g.queueMinutes}m
                </div>
              ))}
            </div>
          )}

          {/* chat area */}
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto py-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex animate-rise items-end gap-2.5 opacity-0 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal/30 to-signal/5 font-display text-[11px] font-bold text-signal ring-1 ring-signal/20">
                    P
                  </div>
                )}
                <div className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-3 font-body text-sm leading-relaxed shadow-lg ${
                      m.role === "user"
                        ? "rounded-br-md bg-signal text-pitch-950 shadow-signal/10"
                        : "rounded-bl-md border border-steel/15 bg-pitch-800/70 text-cream shadow-black/20"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="mt-1 px-1 font-body text-[10px] text-steel/60">{m.time}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex animate-rise items-end gap-2.5 opacity-0">
                <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal/30 to-signal/5 font-display text-[11px] font-bold text-signal ring-1 ring-signal/20">
                  P
                </div>
                <div className="rounded-2xl rounded-bl-md border border-steel/15 bg-pitch-800/70 px-4 py-3.5 shadow-lg shadow-black/20">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:200ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:400ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* suggestions */}
          {messages.length < 2 && (
            <div className="mb-3">
              <p className="mb-2 font-body text-[10px] uppercase tracking-widest text-steel">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="animate-rise flex items-center gap-1.5 rounded-full border border-steel/20 bg-pitch-800/40 px-3 py-1.5 font-body text-xs text-steel opacity-0 transition hover:scale-[1.03] hover:border-signal/40 hover:text-signal active:scale-[0.97]"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span>{s.flag}</span>
                    <span className="max-w-[220px] truncate sm:max-w-none">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="sticky bottom-0 flex gap-2 border-t border-steel/10 bg-pitch-950/95 py-4 backdrop-blur"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in any language — gates, restrooms, transit, accessibility..."
                className="w-full rounded-xl border border-steel/20 bg-pitch-800/60 px-4 py-3.5 font-body text-sm text-cream placeholder:text-steel/60 transition focus:border-signal/50 focus:outline-none focus:ring-2 focus:ring-signal/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-signal px-5 py-3.5 font-display text-sm font-semibold text-pitch-950 transition-all duration-150 hover:scale-[1.03] hover:bg-signal/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Send
              <span className="text-base">→</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}