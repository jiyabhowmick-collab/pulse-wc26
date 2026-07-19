import { NextRequest, NextResponse } from "next/server";
import { getClient, isAIConfigured, MODEL_NAME } from "@/lib/gemini";
import { getStadiumSnapshot } from "@/lib/stadiumState";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `You are the PULSE Ops Brain — a real-time decision-support AI for FIFA World Cup 2026 stadium operations staff, volunteers, and organizers.

You are given a live JSON snapshot of stadium conditions: gate queues and flow, transit load, amenity wait times, weather, and incident reports.

Your job: analyze the snapshot and output a SHORT list of prioritized, concrete operational recommendations — the kind a control-room supervisor would radio to staff RIGHT NOW.

Output format — respond ONLY with valid JSON matching this exact schema, no markdown fences, no commentary:
{
  "headline": "one short sentence summarizing overall stadium state",
  "riskLevel": "low" | "moderate" | "elevated" | "critical",
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "title": "short action title, imperative voice, e.g. 'Redirect flow from Gate 9'",
      "detail": "1-2 sentence specific instruction referencing real data from the snapshot (gate names, numbers, times)",
      "category": "crowd" | "transit" | "accessibility" | "weather" | "safety" | "amenity"
    }
  ]
}

Rules:
- Generate between 3 and 5 recommendations, ordered by priority (high first).
- Every recommendation must reference specific real data points from the snapshot (exact gate names, queue minutes, transit lines, weather conditions) — never generic advice.
- If any gate status is "critical" or "congested", it must produce a high-priority crowd recommendation with a specific rebalancing suggestion (e.g., redirect fans to a less busy gate by name).
- If weather condition is "Heat Advisory" or "Rain Risk", include a weather-related recommendation.
- If any incident is listed, include a safety recommendation addressing it directly.
- If transit is "at-capacity" or "delayed", include a transit recommendation with a specific alternative.
- Keep every "detail" under 200 characters. Be operational and specific, not vague.`;

export async function POST(req: NextRequest) {
  try {
    const snapshot = getStadiumSnapshot();

    if (!isAIConfigured()) {
      return NextResponse.json({
        analysis: fallbackAnalysis(snapshot),
        snapshot,
        aiConfigured: false,
      });
    }

    const ai = getClient();
    if (!ai) {
      return NextResponse.json({
        analysis: fallbackAnalysis(snapshot),
        snapshot,
        aiConfigured: false,
      });
    }

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `LIVE STADIUM SNAPSHOT (JSON):\n${JSON.stringify(snapshot, null, 2)}\n\nAnalyze this snapshot now and return the JSON recommendation object.`,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.6, maxOutputTokens: 1024 },
    });
    const raw = (result.text ?? "").trim();
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = fallbackAnalysis(snapshot);
    }

    return NextResponse.json({ analysis, snapshot, aiConfigured: true });
  } catch (err: any) {
    console.error("Ops Brain API error:", err);
    const snapshot = getStadiumSnapshot();
    return NextResponse.json({
      analysis: fallbackAnalysis(snapshot),
      snapshot,
      aiConfigured: false,
      error: "AI temporarily unavailable — showing rule-based fallback.",
    });
  }
}

function fallbackAnalysis(snapshot: ReturnType<typeof getStadiumSnapshot>) {
  const worst = [...snapshot.gates].sort((a, b) => b.queueMinutes - a.queueMinutes)[0];
  const best = [...snapshot.gates].sort((a, b) => a.queueMinutes - b.queueMinutes)[0];
  return {
    headline: `${snapshot.matchPhase}: ${worst.status === "critical" || worst.status === "congested" ? "Gate congestion detected" : "Conditions stable"}`,
    riskLevel: worst.status === "critical" ? "critical" : worst.status === "congested" ? "elevated" : "low",
    recommendations: [
      {
        priority: "high",
        title: `Rebalance flow from ${worst.name}`,
        detail: `${worst.name} has a ${worst.queueMinutes}-minute queue. Redirect arriving fans toward ${best.name} (${best.queueMinutes} min wait).`,
        category: "crowd",
      },
      {
        priority: "medium",
        title: "Monitor transit load",
        detail: `${snapshot.transit[0].name} is at ${snapshot.transit[0].loadPct}% capacity, next arrival in ${snapshot.transit[0].nextArrivalMin} min.`,
        category: "transit",
      },
      {
        priority: "low",
        title: "Add GEMINI_API_KEY for full AI reasoning",
        detail: "This is a rule-based fallback. Configure the API key to unlock full generative recommendations.",
        category: "safety",
      },
    ],
  };
}
