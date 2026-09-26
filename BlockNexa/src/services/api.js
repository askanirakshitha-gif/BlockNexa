/**
 * BlockNexa Frontend — Backend API Client Service
 * Connects React UI to FastAPI server on http://127.0.0.1:8000
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (window.location.port === '8000' || window.location.port === '5173' ? '' : 'http://127.0.0.1:8000')
  : 'http://127.0.0.1:8000';

/**
 * Check backend connection and model availability
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Backend health check failed:', err.message);
    return { status: 'offline', error: err.message };
  }
}

/**
 * Predict defect failure/deferral risk using RandomForestClassifier
 */
export async function predictDefectRisk(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ml/predict-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Predict risk failed, falling back:', err.message);
    // Client-side fallback calculation
    const score = Math.min(100, Math.round(
      0.35 * (payload.severity * 10) +
      0.30 * (payload.safety_criticality * 10) +
      0.20 * Math.min(100, (payload.overdue_days / 14) * 100) +
      0.15 * Math.min(100, (payload.rail_wear_mm / 5.0) * 100)
    ));
    return {
      predicted_risk_prob: score / 100,
      predicted_risk_percent: score,
      priority_class: score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'ROUTINE',
      is_emergency_bypass: score >= 80,
      recommended_action: score >= 75 ? 'Emergency Corridor Intervention' : 'Scheduled Megablock',
      top_risk_factors: [{ factor: 'Fallback Calculation (Server Booting)', contribution: `${score}%` }],
      isFallback: true,
    };
  }
}

/**
 * Predict train delay minutes using GradientBoostingRegressor
 */
export async function predictTrainDelay(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ml/predict-delay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Predict delay failed, falling back:', err.message);
    const delay = Math.max(1.0, Math.round(
      (payload.block_duration_hours * 6.0) * (payload.traffic_intensity || 1.0)
      - ((payload.activities_bundled || 1) - 1) * 3.0
      - (payload.has_loop_reroute ? 8.0 : 0)
    ));
    return {
      predicted_delay_minutes: delay,
      mitigation_strategy: payload.has_loop_reroute ? 'Loop Line Bypass' : 'Standard Possession',
      mitigation_options: [
        { strategy: 'Standalone Possession', delay_minutes: delay * 2 },
        { strategy: 'Joint Megablock', delay_minutes: delay },
      ],
      isFallback: true,
    };
  }
}

/**
 * Fetch trained model evaluation metrics
 */
export async function fetchModelMetrics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ml/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Fetch metrics failed:', err.message);
    return null;
  }
}

/**
 * Run combinatorial block optimization
 */
export async function solveBlockPlan(payload = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/planner/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Solve block plan failed:', err.message);
    return null;
  }
}

/**
 * Query Indian Railways train timetable by station code from Trains_Schedule_CLEANED.csv
 */
export async function fetchStationTrains(stationCode = 'BSL') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/timetable/trains?station_code=${encodeURIComponent(stationCode)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Fetch station trains failed:', err.message);
    return null;
  }
}

/**
 * Fetch historical maintenance block records
 */
export async function fetchBlockHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history/blocks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[BlockNexa API] Fetch block history failed:', err.message);
    return [];
  }
}
