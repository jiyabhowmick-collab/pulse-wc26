"use client";

import { useEffect, useState } from "react";

const LINE_1 = "One AI brain.";
const LINE_2 = "Every gate, every fan,";
const LINE_3 = "every decision.";

export function AnimatedHeadline() {
  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");
  const [typed3, setTyped3] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function typeLine(
      full: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      speed: number
    ) {
      for (let i = 0; i <= full.length; i++) {
        if (cancelled) return;
        setter(full.slice(0, i));
        await new Promise((r) => setTimeout(r, speed));
      }
    }

    async function run() {
      await new Promise((r) => setTimeout(r, 300));
      await typeLine(LINE_1, setTyped1, 45);
      await new Promise((r) => setTimeout(r, 150));
      await typeLine(LINE_2, setTyped2, 35);
      await new Promise((r) => setTimeout(r, 150));
      await typeLine(LINE_3, setTyped3, 45);
      if (!cancelled) setShowCursor(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <h1 className="text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight text-cream [text-shadow:0_2px_24px_rgba(7,11,20,0.9)] sm:text-7xl">
      <span className="block min-h-[1.05em]">{typed1}</span>
      <span className="block min-h-[1.05em] text-signal">{typed2}</span>
      <span className="block min-h-[1.05em]">
        {typed3}
        {showCursor && <span className="ml-1 inline-block h-[0.9em] w-[0.06em] animate-pulse2 bg-signal align-middle" />}
      </span>
    </h1>
  );
}