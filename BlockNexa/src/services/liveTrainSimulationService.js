// Live Train Movement & Real-Time Corridor Tracking Service
// Division: Bhusawal (BSL) / Central Railway (CR)
// Simulates live GPS telemetry, physical movement along tracks, block caution order compliance, and signal aspects.

export const INITIAL_LIVE_TRAINS = [
  {
    id: "TR-22222",
    trainNo: "22222",
    name: "CSMT - NZM Vande Bharat Express",
    type: "VANDE_BHARAT",
    typeLabel: "Vande Bharat (P1)",
    track: "DN-MAIN",
    direction: "DN", // Left to Right (Km 137 -> Km 444)
    currentKm: 246.4,
    speedKmph: 130,
    maxSpeed: 130,
    status: "Cruising Normal Speed",
    signalAspect: "GREEN",
    delayMins: 0,
    locoNo: "WAP-7 #30455 (BSL Shed)",
    locoPilot: "R. S. Jadhav (LP / Coaching)",
    assistantPilot: "M. K. Sharma (ALP)",
    guard: "A. N. Deshmukh",
    coaches: 16,
    passengers: 980,
    tractionAmps: 420,
    catenaryVoltage: 24.8,
    nextStation: "Manmad Junction (MMR)",
    nextStationCode: "MMR",
    nextStationKm: 261.0,
    distToNextKm: 14.6,
    etaNext: "09:48",
    color: "#3b82f6",
  },
  {
    id: "TR-12951",
    trainNo: "12951",
    name: "Mumbai Central - New Delhi Rajdhani Express",
    type: "RAJDHANI",
    typeLabel: "Rajdhani Exp (P1)",
    track: "DN-MAIN",
    direction: "DN",
    currentKm: 195.8,
    speedKmph: 125,
    maxSpeed: 130,
    status: "Cruising Mainline (Post-Nashik)",
    signalAspect: "GREEN",
    delayMins: 4,
    locoNo: "Twin WAP-7 #30211 / #30212",
    locoPilot: "S. K. Verma (LP)",
    assistantPilot: "D. R. Patil",
    guard: "K. R. Shinde",
    coaches: 22,
    passengers: 1240,
    tractionAmps: 460,
    catenaryVoltage: 24.9,
    nextStation: "Manmad Junction (MMR)",
    nextStationCode: "MMR",
    nextStationKm: 261.0,
    distToNextKm: 65.2,
    etaNext: "10:48",
    color: "#f59e0b",
  },
  {
    id: "TR-12137",
    trainNo: "12137",
    name: "Punjab Mail (CSMT — Firozpur)",
    type: "SUPERFAST",
    typeLabel: "Superfast Mail (P2)",
    track: "DN-MAIN",
    direction: "DN",
    currentKm: 148.2,
    speedKmph: 110,
    maxSpeed: 110,
    status: "Cruising Ghat Section",
    signalAspect: "DOUBLE_YELLOW",
    delayMins: 12,
    locoNo: "WAP-7 #30588 (Ajni)",
    locoPilot: "M. G. Patil",
    assistantPilot: "R. K. Birari",
    guard: "V. B. Joshi",
    coaches: 24,
    passengers: 1720,
    tractionAmps: 380,
    catenaryVoltage: 24.6,
    nextStation: "Devlali (DVL)",
    nextStationCode: "DVL",
    nextStationKm: 179.0,
    distToNextKm: 30.8,
    etaNext: "10:52",
    color: "#3b82f6",
  },
  {
    id: "TR-12262",
    trainNo: "12262",
    name: "Howrah — CSMT AC Duronto Express",
    type: "DURONTO",
    typeLabel: "AC Duronto (P1)",
    track: "UP-MAIN",
    direction: "UP", // Right to Left (Km 444 -> Km 137)
    currentKm: 388.5,
    speedKmph: 120,
    maxSpeed: 120,
    status: "Inbound via Pachora",
    signalAspect: "GREEN",
    delayMins: 0,
    locoNo: "WAP-7 #30332 (Howrah)",
    locoPilot: "D. P. Mukherjee",
    assistantPilot: "S. K. Roy",
    guard: "P. K. Banerjee",
    coaches: 18,
    passengers: 1180,
    tractionAmps: 410,
    catenaryVoltage: 25.1,
    nextStation: "Pachora Junction (PC)",
    nextStationCode: "PC",
    nextStationKm: 373.0,
    distToNextKm: 15.5,
    etaNext: "13:35",
    color: "#06b6d4",
  },
  {
    id: "TR-12860",
    trainNo: "12860",
    name: "Howrah — CSMT Gitanjali Express",
    type: "SUPERFAST",
    typeLabel: "Superfast Exp (P2)",
    track: "UP-MAIN",
    direction: "UP",
    currentKm: 298.0,
    speedKmph: 105,
    maxSpeed: 110,
    status: "Approaching Manmad Yard",
    signalAspect: "YELLOW",
    delayMins: 6,
    locoNo: "WAP-7 #30412 (Tatanagar)",
    locoPilot: "A. K. Ganguly",
    assistantPilot: "T. B. Das",
    guard: "S. R. Chakraborty",
    coaches: 22,
    passengers: 1650,
    tractionAmps: 370,
    catenaryVoltage: 24.7,
    nextStation: "Manmad Junction (MMR)",
    nextStationCode: "MMR",
    nextStationKm: 261.0,
    distToNextKm: 37.0,
    etaNext: "11:15",
    color: "#06b6d4",
  },
  {
    id: "TR-11058",
    trainNo: "11058",
    name: "Amritsar — CSMT Express",
    type: "EXPRESS",
    typeLabel: "Mail/Express (P3)",
    track: "UP-MAIN",
    direction: "UP",
    currentKm: 432.0,
    speedKmph: 92,
    maxSpeed: 100,
    status: "Departed Bhusawal Junction",
    signalAspect: "GREEN",
    delayMins: 15,
    locoNo: "WAP-4 #22510 (BSL)",
    locoPilot: "H. S. Gill",
    assistantPilot: "M. S. Dhillon",
    guard: "R. K. Singh",
    coaches: 20,
    passengers: 1890,
    tractionAmps: 340,
    catenaryVoltage: 24.9,
    nextStation: "Jalgaon Junction (JL)",
    nextStationCode: "JL",
    nextStationKm: 420.0,
    distToNextKm: 12.0,
    etaNext: "16:05",
    color: "#06b6d4",
  },
  {
    id: "TR-FRT-8812",
    trainNo: "FRT-CNTR-8812",
    name: "CONCOR Double Stack Container (JNPT — Dadri)",
    type: "FREIGHT",
    typeLabel: "Freight Container",
    track: "DN-MAIN",
    direction: "DN",
    currentKm: 348.0,
    speedKmph: 74,
    maxSpeed: 75,
    status: "Cruising Freight Slot",
    signalAspect: "GREEN",
    delayMins: 20,
    locoNo: "Twin WAG-9HC #31580 / #31581",
    locoPilot: "T. R. Sonawane",
    assistantPilot: "P. R. Shinde",
    guard: "P. M. Koli",
    wagons: 45,
    tonnage: "4,400 T",
    tractionAmps: 520,
    catenaryVoltage: 24.8,
    nextStation: "Pachora Junction (PC)",
    nextStationCode: "PC",
    nextStationKm: 373.0,
    distToNextKm: 25.0,
    etaNext: "12:15",
    color: "#64748b",
  },
  {
    id: "TR-FRT-9943",
    trainNo: "FRT-COAL-9943",
    name: "BOXNHL Coal Rake (NTPC Thermal Power)",
    type: "FREIGHT",
    typeLabel: "Heavy Coal Freight",
    track: "3RD-LINE",
    direction: "UP",
    currentKm: 412.5,
    speedKmph: 68,
    maxSpeed: 70,
    status: "Running on 3rd Corridor",
    signalAspect: "GREEN",
    delayMins: 8,
    locoNo: "WAG-12B #60018 (12,000 HP)",
    locoPilot: "B. L. Meena",
    assistantPilot: "K. L. Sharma",
    guard: "C. R. Solanki",
    wagons: 58,
    tonnage: "5,200 T",
    tractionAmps: 680,
    catenaryVoltage: 25.0,
    nextStation: "Jalgaon Junction (JL)",
    nextStationCode: "JL",
    nextStationKm: 420.0,
    distToNextKm: 7.5,
    etaNext: "11:40",
    color: "#f59e0b",
  },
];

// Corridor Stations definition for live distance resolution
const STATIONS = [
  { code: "IGP", name: "Igatpuri", km: 137.0 },
  { code: "DVL", name: "Devlali", km: 179.0 },
  { code: "NK", name: "Nashik Road", km: 188.0 },
  { code: "MMR", name: "Manmad Junction", km: 261.0 },
  { code: "CSN", name: "Chalisgaon Junction", km: 328.0 },
  { code: "PC", name: "Pachora Junction", km: 373.0 },
  { code: "JL", name: "Jalgaon Junction", km: 420.0 },
  { code: "BSL", name: "Bhusawal Junction", km: 444.0 },
];

const MIN_KM = 137.0;
const MAX_KM = 444.0;

/**
 * Updates train positions and operational statuses based on elapsed real-world seconds
 * and simulation speed multiplier.
 */
export function updateTrainsLiveMovement(trains, dtSeconds, simMultiplier = 10, reroutedTrainIds = []) {
  // Convert elapsed seconds into simulated hours:
  const simSeconds = dtSeconds * simMultiplier;
  const deltaHours = simSeconds / 3600.0;

  return trains.map((t) => {
    let km = t.currentKm;
    let speed = t.speedKmph;
    let status = t.status;
    let signal = "GREEN";
    let track = t.track;
    let amps = t.tractionAmps;

    // Active Maintenance Block Zone: MMR — CSN Km 284.2 to 286.0 on DN-MAIN
    const isApproachingCautionZone =
      t.direction === "DN" && km >= 282.0 && km <= 286.5;

    const isInsideCautionZone =
      t.direction === "DN" && km >= 284.0 && km <= 286.0;

    // Check if rerouted to loop
    const isRerouted = reroutedTrainIds.includes(t.trainNo);

    if (isRerouted && km >= 282.0 && km <= 288.0) {
      track = "LOOP-3";
      speed = Math.min(speed, 40);
      status = "Diverted via Loop Line (40 km/h) • Clearing Block";
      signal = "YELLOW";
    } else if (isInsideCautionZone) {
      speed = Math.min(speed, 30);
      status = "SR 30 km/h Caution Order Active: MMR-CSN Joint Work Zone";
      signal = "DOUBLE_YELLOW";
    } else if (isApproachingCautionZone) {
      speed = Math.max(30, speed - 15 * deltaHours * 60);
      status = "Decelerating for Caution Zone Km 284/10";
      signal = "YELLOW";
    } else {
      // Normal cruising: smoothly accelerate back to maxSpeed if clear
      if (speed < t.maxSpeed) {
        speed = Math.min(t.maxSpeed, speed + 20 * deltaHours * 60);
      }
      status = "Cruising Line Speed";
      signal = "GREEN";
    }

    // Neutral Section Zone: Km 210/14 on UP-MAIN
    if (t.direction === "UP" && km >= 209.5 && km <= 211.5) {
      status = "PTFE Neutral Section Coasting (0 Amps)";
      amps = 0;
      signal = "YELLOW";
    } else if (amps === 0) {
      amps = t.type === "FREIGHT" ? 540 : 420;
    }

    // Physical displacement along track
    const deltaKm = speed * deltaHours;
    if (t.direction === "DN") {
      km += deltaKm;
      // Loop around at corridor boundary for endless continuous simulation
      if (km > MAX_KM) {
        km = MIN_KM + (km - MAX_KM);
      }
    } else {
      km -= deltaKm;
      if (km < MIN_KM) {
        km = MAX_KM - (MIN_KM - km);
      }
    }

    // Determine next station
    let nextStn = STATIONS[0];
    let distToNext = 999;
    if (t.direction === "DN") {
      const ahead = STATIONS.filter((s) => s.km >= km);
      if (ahead.length > 0) {
        nextStn = ahead[0];
        distToNext = Math.max(0.1, nextStn.km - km);
      } else {
        nextStn = STATIONS[STATIONS.length - 1];
        distToNext = 0.5;
      }
    } else {
      const ahead = STATIONS.filter((s) => s.km <= km).reverse();
      if (ahead.length > 0) {
        nextStn = ahead[0];
        distToNext = Math.max(0.1, km - nextStn.km);
      } else {
        nextStn = STATIONS[0];
        distToNext = 0.5;
      }
    }

    return {
      ...t,
      currentKm: Math.round(km * 10) / 10,
      speedKmph: Math.round(speed),
      status,
      signalAspect: signal,
      track,
      tractionAmps: amps,
      nextStation: `${nextStn.name} (${nextStn.code})`,
      nextStationCode: nextStn.code,
      nextStationKm: nextStn.km,
      distToNextKm: Math.round(distToNext * 10) / 10,
    };
  });
}
