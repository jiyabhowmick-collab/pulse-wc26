"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Recommendation = {
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  category: string;
};
type Analysis = {
  headline: string;
  riskLevel: "low" | "moderate" | "elevated" | "critical";
  recommendations: Recommendation[];
};

const riskColors: Record<string, string> = {
  low: "text-signal border-signal/30 bg-signal/5",
  moderate: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  elevated: "text-alert border-alert/30 bg-alert/5",
  critical: "text-alert border-alert/50 bg-alert/10",
};

const priorityColors: Record<string, string> = {
  high: "bg-alert/15 text-alert border-alert/30",
  medium: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  low: "bg-steel/15 text-steel border-steel/30",
};

export default function OpsPage() {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiConfigured, setAiConfigured] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [log, setLog] = useState<{ time: string; headline: string; risk: string }[]>([]);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ops-brain", { method: "POST" });
      const data = await res.json();
      setSnapshot(data.snapshot);
      setAnalysis(data.analysis);
      setAiConfigured(data.aiConfigured);
      setLastUpdated(new Date());
      setLog((l) =>
        [{ time: new Date().toLocaleTimeString(), headline: data.analysis.headline, risk: data.analysis.riskLevel }, ...l].slice(0, 6)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 20000);
    return () => clearInterval(interval);
  }, [fetchAnalysis]);

  return (
    <main className="min-h-screen bg-pitch-900">
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[size:44px_44px] opacity-[0.25] [mask-image:radial-gradient(ellipse_60%_35%_at_50%_0%,black,transparent)]" />

      <header className="relative z-10 flex items-center justify-between border-b border-steel/10 bg-pitch-900/80 px-5 py-4 backdrop-blur sm:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span className="font-display text-base font-semibold">PULSE</span>
          <span className="hidden font-body text-xs text-steel sm:inline">Ops Command Center</span>
        </Link>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="hidden items-center gap-1.5 font-body text-[11px] text-steel sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal" />
              Updated {lastUpdated.toLocaleTimeString()} · auto-refresh 20s
            </span>
          )}
          <Link
            href="/fan"
            className="flex items-center gap-1.5 rounded-full border border-steel/20 px-3 py-1.5 font-body text-xs text-steel transition hover:border-signal/40 hover:text-signal"
          >
            Fan View →
          </Link>
        </div>
      </header>

      {!aiConfigured && (
        <div className="relative z-10 border-b border-alert/20 bg-alert/5 px-5 py-2 text-center font-body text-xs text-alert sm:px-8">
          Running in rule-based fallback mode — add GEMINI_API_KEY to unlock full generative reasoning.
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6 sm:px-8">
        {/* headline + risk */}
        {analysis && (
          <div
            key={analysis.headline}
            className={`mb-6 animate-rise rounded-2xl border p-5 opacity-0 ${riskColors[analysis.riskLevel]}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-body text-[11px] uppercase tracking-widest opacity-70">Current Assessment</span>
                <h1 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{analysis.headline}</h1>
              </div>
              <span className="shrink-0 rounded-full border border-current px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider">
                {analysis.riskLevel} risk
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* AI Reasoning Feed - signature element */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-steel">AI Recommendation Feed</h2>
              <button
                onClick={fetchAnalysis}
                disabled={loading}
                className="rounded-lg border border-steel/20 px-3 py-1.5 font-body text-xs text-cream transition hover:scale-[1.03] hover:border-signal/40 active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Analyzing..." : "Re-analyze now"}
              </button>
            </div>

            <div className="space-y-3">
              {loading && !analysis && (
                <div className="rounded-xl border border-steel/15 bg-pitch-800/40 p-8 text-center font-body text-sm text-steel">
                  <span className="inline-flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:200ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-signal [animation-delay:400ms]" />
                  </span>
                  <div className="mt-3">Ops Brain analyzing live stadium snapshot...</div>
                </div>
              )}
              {analysis?.recommendations.map((r, i) => (
                <div
                  key={`${analysis.headline}-${i}`}
                  className="animate-rise rounded-xl border border-steel/15 bg-pitch-800/40 p-4 opacity-0 transition-colors hover:border-steel/25"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={`rounded border px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide ${priorityColors[r.priority]}`}>
                          {r.priority}
                        </span>
                        <span className="font-body text-[10px] uppercase tracking-wide text-steel">{r.category}</span>
                      </div>
                      <h3 className="font-display text-sm font-semibold text-cream">{r.title}</h3>
                      <p className="mt-1 font-body text-xs leading-relaxed text-steel">{r.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* history log */}
            {log.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-steel">Assessment History</h3>
                <div className="space-y-1.5 rounded-xl border border-steel/10 bg-pitch-800/20 p-3 font-body text-xs">
                  {log.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 text-steel">
                      <span className="w-16 shrink-0 text-steel/60">{l.time}</span>
                      <span className="flex-1 truncate text-cream/70">{l.headline}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${riskColors[l.risk]}`}>{l.risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live signals sidebar */}
          <div className="space-y-5">
            <div>
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-steel">Live Gate Status</h2>
              <div className="space-y-2">
                {snapshot?.gates.map((g: any, i: number) => (
                  <GateBar key={g.id} gate={g} delay={i * 60} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-steel">Transit Load</h2>
              <div className="space-y-2">
                {snapshot?.transit.map((t: any, i: number) => (
                  <div
                    key={t.id}
                    className="animate-rise rounded-lg border border-steel/15 bg-pitch-800/40 p-3 opacity-0"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs font-medium text-cream">{t.name}</span>
                      <span
                        className={`font-body text-[10px] uppercase ${
                          t.status === "on-time" ? "text-signal" : "text-alert"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-steel">
                      {t.loadPct}% load · next in {t.nextArrivalMin} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-steel/15 bg-pitch-800/40 p-3">
              <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-steel">Weather</h3>
              {snapshot?.weather && (
                <p className="font-body text-xs text-cream/80">
                  {snapshot.weather.tempC}°C · {snapshot.weather.condition} · wind {snapshot.weather.windKmh} km/h
                </p>
              )}
            </div>

            {snapshot?.incidents?.length > 0 && (
              <div className="animate-rise rounded-lg border border-alert/30 bg-alert/5 p-3 opacity-0">
                <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-alert">Active Incidents</h3>
                {snapshot.incidents.map((inc: string, i: number) => (
                  <p key={i} className="font-body text-xs text-cream/80">
                    {inc}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function GateBar({ gate, delay }: { gate: any; delay: number }) {
  const pct = Math.min(100, Math.round((gate.currentFlowPerMin / gate.capacityPerMin) * 100));
  const color =
    gate.status === "clear" ? "bg-signal" : gate.status === "moderate" ? "bg-amber-400" : "bg-alert";
  return (
    <div
      className="animate-rise rounded-lg border border-steel/15 bg-pitch-800/40 p-3 opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-body text-xs font-medium text-cream">{gate.name}</span>
        <span className="font-body text-[11px] text-steel">{gate.queueMinutes}m</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-pitch-900">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}