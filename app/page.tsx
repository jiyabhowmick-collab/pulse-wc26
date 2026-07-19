import Link from "next/link";
import { StadiumBackdrop } from "@/components/StadiumBackdrop";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StadiumBackdrop />
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2.5 animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">PULSE</span>
          <span className="hidden font-body text-xs text-steel sm:inline">/ World Cup 2026</span>
        </div>
        <span className="animate-fade-in rounded-full border border-steel/30 px-3 py-1 font-body text-[11px] uppercase tracking-widest text-steel [animation-delay:150ms]">
          Live Demo · Simulated Stadium Feed
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-10 text-center sm:px-10 sm:pt-16">
        <div
          className="mx-auto mb-8 inline-flex animate-rise items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 font-body text-xs text-gold opacity-0"
          style={{ animationDelay: "80ms" }}
        >
          <span className="text-sm">🏆</span>
          Gemini-powered · Built for FIFA World Cup 2026
        </div>
        <AnimatedHeadline />

        <p
          className="mx-auto mt-7 max-w-2xl animate-rise text-balance font-body text-lg leading-relaxed text-steel opacity-0"
          style={{ animationDelay: "260ms" }}
        >
          PULSE reads live stadium signals — gate queues, transit load, weather, incidents — and
          reasons over them in real time with generative AI. Fans get a multilingual concierge in
          their pocket. Organizers get an AI ops brain issuing crowd-control calls before problems
          become bottlenecks.
        </p>

        <div
          className="mt-10 flex animate-rise flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
          style={{ animationDelay: "340ms" }}
        >
          <Link
            href="/fan"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-signal px-7 py-4 font-display text-base font-semibold text-pitch-950 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
          >
            <span className="relative z-10">Enter as a Fan</span>
            <span className="relative z-10 transition group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/ops"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-steel/30 bg-pitch-800/60 px-7 py-4 font-display text-base font-semibold text-cream transition-all duration-200 hover:scale-[1.02] hover:border-signal/40 hover:bg-pitch-800 active:scale-[0.98] sm:w-auto"
          >
            Enter Ops Command Center
          </Link>
        </div>

        {/* Live stat strip */}
        <div
          className="mx-auto mt-14 grid max-w-2xl animate-rise grid-cols-3 gap-4 border-t border-steel/10 pt-8 opacity-0"
          style={{ animationDelay: "420ms" }}
        >
          <Stat value="4" label="Live gates modeled" />
          <Stat value="20s" label="Ops Brain refresh cycle" />
          <Stat value="∞" label="Languages the concierge speaks" />
        </div>
      </section>

      {/* Signature element: live reasoning feed preview */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 sm:px-10">
        <div
          className="animate-rise rounded-2xl border border-steel/15 bg-pitch-800/40 p-1.5 opacity-0 shadow-2xl shadow-black/40 backdrop-blur"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex items-center justify-between border-b border-steel/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-alert/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-signal/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-steel/40" />
              </div>
              <span className="ml-2 font-body text-xs text-steel">ops-brain · reasoning trace</span>
            </div>
            <span className="hidden font-body text-[11px] text-steel sm:inline">sample output</span>
          </div>
          <div className="space-y-2.5 p-5 font-body text-sm">
            <TraceLine label="SIGNAL" color="text-steel" text="Gate 9 – South Plaza queue crossed 18 min · flow 91% of capacity" delay={0} />
            <TraceLine label="WEATHER" color="text-steel" text="Heat advisory, 33°C — hydration risk near uncovered queue zones" delay={120} />
            <TraceLine label="REASONING" color="text-signal" text="Cross-referencing nearest low-load gate + shuttle capacity before issuing redirect..." delay={240} />
            <TraceLine label="ACTION" color="text-alert" text="HIGH PRIORITY — Redirect South Plaza arrivals to Gate 2 (4 min wait). Deploy water point at Gate 9 queue line." delay={360} />
          </div>
        </div>
        <p className="mt-4 text-center font-body text-xs text-steel">
          This is a real sample of what the Ops Brain generates from live snapshot data — see it live on the Ops page.
        </p>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 sm:px-10">
        <div className="mb-10 text-center">
          <span className="font-body text-xs uppercase tracking-widest text-steel">Coverage</span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-cream sm:text-3xl">
            Built for the problems host cities actually face
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group animate-rise rounded-xl border border-steel/15 bg-pitch-800/30 p-5 opacity-0 transition-all duration-200 hover:-translate-y-1 hover:border-signal/30 hover:bg-pitch-800/60"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 text-xl transition-transform duration-200 group-hover:scale-110">{f.icon}</div>
              <h3 className="font-display text-sm font-semibold text-cream">{f.title}</h3>
              <p className="mt-1.5 font-body text-xs leading-relaxed text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-steel/10 px-6 py-8 text-center sm:px-10">
        <p className="font-body text-xs text-steel">
          Built for Hack2skill × Google for Developers — Prompt War · GenAI Exchange Challenge 2026
        </p>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-signal sm:text-3xl">{value}</div>
      <div className="mt-1 font-body text-[11px] uppercase tracking-wide text-steel">{label}</div>
    </div>
  );
}

function TraceLine({ label, color, text, delay }: { label: string; color: string; text: string; delay: number }) {
  return (
    <div
      className="flex animate-rise gap-3 rounded-lg bg-pitch-900/60 px-3 py-2 opacity-0"
      style={{ animationDelay: `${600 + delay}ms` }}
    >
      <span className={`shrink-0 font-display text-[10px] font-bold tracking-wider ${color}`}>{label}</span>
      <span className="text-cream/80">{text}</span>
    </div>
  );
}

const FEATURES = [
  { icon: "🧭", title: "AI Navigation", desc: "Natural-language directions to gates, seats, and amenities grounded in live wait times." },
  { icon: "🌐", title: "Multilingual Concierge", desc: "Fans ask in their own language — Spanish, Hindi, Arabic, Portuguese, and more — answered fluently." },
  { icon: "👥", title: "Crowd Management", desc: "Ops Brain detects gate congestion and issues specific rebalancing calls before it peaks." },
  { icon: "♿", title: "Accessibility First", desc: "Proactively surfaces wheelchair routes, prayer rooms, and family lounges nearest to the fan." },
  { icon: "🚌", title: "Transit Intelligence", desc: "Live shuttle, metro, and rideshare load folded directly into AI recommendations." },
  { icon: "🌦️", title: "Weather-Aware Ops", desc: "Heat advisories and rain risk trigger automatic safety recommendations for staff." },
  { icon: "🚨", title: "Real-Time Incidents", desc: "Reported incidents are reasoned over immediately with a prioritized safety response." },
  { icon: "📡", title: "One Shared Brain", desc: "Fans and staff draw from the exact same live signal set — no fragmented systems." },
];