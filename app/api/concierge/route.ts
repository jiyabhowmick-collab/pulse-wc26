import { NextRequest, NextResponse } from "next/server";
import { getClient, isAIConfigured, MODEL_NAME } from "@/lib/gemini";
import { getStadiumSnapshot } from "@/lib/stadiumState";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `You are PULSE, the official on-site AI concierge for a FIFA World Cup 2026 host stadium.
You help fans with navigation, accessibility, transportation, amenities, safety, and general match-day questions.

Rules:
- You are given a live JSON snapshot of real stadium conditions (gate queues, transit load, amenities, weather, incidents). Ground your answers in this data whenever relevant — cite specific gates, wait times, or transit options by name.
- ALWAYS respond in the same language the fan wrote in. If they write in Spanish, Hindi, Arabic, French, Portuguese, or any other language, reply fluently in that language.
- Keep answers concise, warm, and actionable — this is being read on a phone in a crowded stadium. Use short paragraphs or a tight bulleted list when giving directions/options.
- If asked about accessibility (wheelchair access, sensory rooms, prayer rooms, family lounges), be specific and proactive — mention the nearest relevant amenity from the data.
- If a fan describes an emergency or medical issue, prioritize directing them to the nearest First Aid point immediately and clearly, and tell them to alert nearby stewards.
- If asked something with no relevant live data (e.g. "who will win"), answer briefly and helpfully as a knowledgeable football fan, then gently steer back to what you can help with on-site.
- Never invent specific gate/transit names that are not in the provided data. You may speak generally about stadium features not covered in the data.
- Sign off tone: confident, efficient, a little bit of match-day excitement — like a great concierge, not a robot.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, language } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const snapshot = getStadiumSnapshot();

    if (!isAIConfigured()) {
      return NextResponse.json({
        reply: fallbackReply(message, snapshot),
        snapshot,
        aiConfigured: false,
      });
    }

    const ai = getClient();
    if (!ai) {
      return NextResponse.json({
        reply: fallbackReply(message, snapshot),
        snapshot,
        aiConfigured: false,
      });
    }

    const contextBlock = `LIVE STADIUM SNAPSHOT (JSON):\n${JSON.stringify(snapshot, null, 2)}\n\nPreferred reply language hint: ${language || "auto-detect from fan message"}\n\nFan message: ${message}`;

    const chatHistory = (history || []).map((h: { role: string; text: string }) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: chatHistory,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7, maxOutputTokens: 1024 },
    });
    const result = await chat.sendMessage({ message: contextBlock });
    const reply = result.text ?? "Sorry, I couldn't generate a response just now.";

    return NextResponse.json({ reply, snapshot, aiConfigured: true });
  } catch (err: any) {
    console.error("Concierge API error:", err);
    const snapshot = getStadiumSnapshot();
    return NextResponse.json(
      {
        reply: fallbackReply("", snapshot),
        snapshot,
        aiConfigured: false,
        error: "AI temporarily unavailable — showing live data fallback.",
      },
      { status: 200 }
    );
  }
}

function fallbackReply(message: string, snapshot: ReturnType<typeof getStadiumSnapshot>) {
  const clearest = [...snapshot.gates].sort((a, b) => a.queueMinutes - b.queueMinutes)[0];
  return `Thanks for your message! (AI key not configured yet — showing live data directly.) Right now the fastest entry is ${clearest.name} with about a ${clearest.queueMinutes}-minute wait. Add your GEMINI_API_KEY to unlock full AI concierge answers in any language.`;
}
