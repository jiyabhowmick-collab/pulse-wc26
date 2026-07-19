// Deterministic-but-dynamic simulated live stadium state.
// In a production build this would be swapped for real feeds:
// turnstile IoT counters, transit APIs, weather APIs, CCTV crowd-density models.
// The shape is intentionally realistic so the AI prompts reason over real operational fields.

export type Gate = {
  id: string;
  name: string;
  zone: "North" | "South" | "East" | "West";
  capacityPerMin: number;
  currentFlowPerMin: number;
  queueMinutes: number;
  status: "clear" | "moderate" | "congested" | "critical";
};

export type TransitLine = {
  id: string;
  name: string;
  type: "Metro" | "Shuttle Bus" | "Rideshare Zone";
  loadPct: number;
  nextArrivalMin: number;
  status: "on-time" | "delayed" | "at-capacity";
};

export type Amenity = {
  id: string;
  name: string;
  zone: "North" | "South" | "East" | "West" | "Concourse";
  type: "Restroom" | "Food Court" | "First Aid" | "Prayer Room" | "Family Lounge" | "Merch Store";
  waitMinutes: number;
  accessible: boolean;
};

export type WeatherState = {
  tempC: number;
  condition: "Clear" | "Humid" | "Rain Risk" | "Heat Advisory";
  windKmh: number;
};

export type StadiumSnapshot = {
  timestamp: string;
  matchPhase: "Pre-Match (Gates Open)" | "Pre-Match (Final Approach)" | "Kickoff Imminent" | "Half-Time" | "Post-Match Egress";
  attendancePct: number;
  gates: Gate[];
  transit: TransitLine[];
  amenities: Amenity[];
  weather: WeatherState;
  incidents: string[];
};

const GATE_NAMES: { name: string; zone: Gate["zone"] }[] = [
  { name: "Gate 4 – North Concourse", zone: "North" },
  { name: "Gate 9 – South Plaza", zone: "South" },
  { name: "Gate 12 – East Riverside", zone: "East" },
  { name: "Gate 2 – West Terrace", zone: "West" },
];

function statusFromQueue(mins: number): Gate["status"] {
  if (mins < 5) return "clear";
  if (mins < 12) return "moderate";
  if (mins < 22) return "congested";
  return "critical";
}

// Seeded pseudo-random so each request feels "live" but stable within a short window
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getStadiumSnapshot(tick?: number): StadiumSnapshot {
  const t = tick ?? Math.floor(Date.now() / 15000); // shifts every 15s
  const phases: StadiumSnapshot["matchPhase"][] = [
    "Pre-Match (Gates Open)",
    "Pre-Match (Final Approach)",
    "Kickoff Imminent",
    "Half-Time",
    "Post-Match Egress",
  ];
  const matchPhase = phases[t % phases.length];

  const gates: Gate[] = GATE_NAMES.map((g, i) => {
    const r = seededRandom(t * 7 + i * 13);
    const capacity = 380 + Math.floor(seededRandom(i + 1) * 80);
    const flow = Math.floor(capacity * (0.4 + r * 0.75));
    const queueMinutes = Math.max(0, Math.round((flow / capacity - 0.55) * 40 + r * 6));
    return {
      id: `gate-${i}`,
      name: g.name,
      zone: g.zone,
      capacityPerMin: capacity,
      currentFlowPerMin: flow,
      queueMinutes,
      status: statusFromQueue(queueMinutes),
    };
  });

  const transit: TransitLine[] = [
    {
      id: "metro-blue",
      name: "Metro Blue Line – Stadium Station",
      type: "Metro",
      loadPct: Math.round(55 + seededRandom(t + 1) * 45),
      nextArrivalMin: Math.round(2 + seededRandom(t + 2) * 8),
      status: seededRandom(t + 1) > 0.75 ? "at-capacity" : seededRandom(t + 3) > 0.85 ? "delayed" : "on-time",
    },
    {
      id: "shuttle-a",
      name: "Fan Shuttle A – Downtown Loop",
      type: "Shuttle Bus",
      loadPct: Math.round(40 + seededRandom(t + 4) * 50),
      nextArrivalMin: Math.round(3 + seededRandom(t + 5) * 10),
      status: seededRandom(t + 6) > 0.8 ? "delayed" : "on-time",
    },
    {
      id: "rideshare-north",
      name: "Rideshare Pickup – North Lot",
      type: "Rideshare Zone",
      loadPct: Math.round(30 + seededRandom(t + 7) * 60),
      nextArrivalMin: Math.round(1 + seededRandom(t + 8) * 5),
      status: seededRandom(t + 9) > 0.85 ? "at-capacity" : "on-time",
    },
  ];

  const amenities: Amenity[] = [
    { id: "rr-n1", name: "Restroom N1", zone: "North", type: "Restroom", waitMinutes: Math.round(seededRandom(t + 10) * 12), accessible: true },
    { id: "rr-s2", name: "Restroom S2", zone: "South", type: "Restroom", waitMinutes: Math.round(seededRandom(t + 11) * 12), accessible: true },
    { id: "fc-e1", name: "East Food Court", zone: "East", type: "Food Court", waitMinutes: Math.round(seededRandom(t + 12) * 18), accessible: true },
    { id: "fa-c1", name: "First Aid – Concourse", zone: "Concourse", type: "First Aid", waitMinutes: Math.round(seededRandom(t + 13) * 4), accessible: true },
    { id: "pr-w1", name: "Prayer Room – West", zone: "West", type: "Prayer Room", waitMinutes: 0, accessible: true },
    { id: "fl-n1", name: "Family Lounge – North", zone: "North", type: "Family Lounge", waitMinutes: Math.round(seededRandom(t + 14) * 6), accessible: true },
  ];

  const weatherConditions: WeatherState["condition"][] = ["Clear", "Humid", "Rain Risk", "Heat Advisory"];
  const weather: WeatherState = {
    tempC: Math.round(24 + seededRandom(t + 20) * 10),
    condition: weatherConditions[Math.floor(seededRandom(t + 21) * weatherConditions.length)],
    windKmh: Math.round(5 + seededRandom(t + 22) * 20),
  };

  const possibleIncidents = [
    "Minor congestion reported near Gate 9 merch stand",
    "Wheelchair lift temporarily queued at East Riverside ramp",
    "Lost child reunited with family at North Concourse info point",
    "Spilled beverage cleaned at Section 214 stairwell",
  ];
  const incidents = seededRandom(t + 30) > 0.6 ? [possibleIncidents[Math.floor(seededRandom(t + 31) * possibleIncidents.length)]] : [];

  return {
    timestamp: new Date().toISOString(),
    matchPhase,
    attendancePct: Math.round(60 + seededRandom(t + 40) * 38),
    gates,
    transit,
    amenities,
    weather,
    incidents,
  };
}
