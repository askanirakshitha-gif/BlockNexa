import React, { useState, useEffect } from 'react';
import {
  Cpu,
  TrainTrack,
  Leaf,
  Layers,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Play,
  Send,
  Smartphone,
  WifiOff,
  Database,
  Key,
  Bluetooth,
  Gauge,
  Info,
  ChevronRight,
  Eye,
  FileCheck2,
} from 'lucide-react';
import {
  simulateSLW,
  fetchXAIExplanation,
  optimizeESG,
  forecastCTMC,
  generateOfflineToken,
  fetchShadowPossessions,
  calculateCPI,
  fetchDegradationTrajectory
} from '../../services/api';

export default function AdvancedCapabilitiesModule({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, SLW, XAI, ESG, CTMC, BLE_TOKEN, SHADOW

  // 1. SLW Simulator State
  const [slwParams, setSlwParams] = useState({
    section_name: 'Manmad (MMR) — Chalisgaon (CSN)',
    blocked_line: 'UP-MAIN',
    active_line: 'DN-MAIN',
    section_length_km: 68.0,
    avg_speed_kmh: 75.0,
    num_up_trains: 6,
    num_dn_trains: 5,
    available_loops: 3
  });
  const [slwResult, setSlwResult] = useState(null);
  const [isSlwLoading, setIsSlwLoading] = useState(false);

  // 2. XAI Engine State
  const [xaiParams, setXaiParams] = useState({
    window_time: '11:15 — 13:45',
    defer_hour: 14
  });
  const [xaiResult, setXaiResult] = useState(null);
  const [isXaiLoading, setIsXaiLoading] = useState(false);

  // 3. Green Traction ESG State
  const [esgParams, setEsgParams] = useState({
    train_mass_tonnes: 5000.0,
    v_approach_kmh: 75.0,
    v_hold_kmh: 0.0,
    idle_duration_mins: 30.0
  });
  const [esgResult, setEsgResult] = useState(null);
  const [isEsgLoading, setIsEsgLoading] = useState(false);

  // 4. CTMC Digital Twin State
  const [ctmcParams, setCtmcParams] = useState({
    days_ahead: 14,
    initial_state: 1 // Alert
  });
  const [ctmcResult, setCtmcResult] = useState(null);
  const [isCtmcLoading, setIsCtmcLoading] = useState(false);

  // 5. Offline BLE Token State
  const [tokenParams, setTokenParams] = useState({
    gang_id: 'GANG-PWI-42',
    supervisor_pin: 'PIN-8821',
    block_id: 'BLK-BSL-01',
    line_restored: 'DN-MAIN',
    chainage: 'Km 284/10 - 286/20',
    track_fitness_status: 'FIT_FOR_NORMAL_SPEED'
  });
  const [tokenResult, setTokenResult] = useState(null);
  const [isTokenGenerating, setIsTokenGenerating] = useState(false);

  // 6. Shadow Possessions State
  const [shadowOpportunities, setShadowOpportunities] = useState([]);
  const [isShadowLoading, setIsShadowLoading] = useState(false);

  // Initial loads
  useEffect(() => {
    runSlwSimulation();
    runXaiExplanation();
    runEsgCalculation();
    runCtmcForecast();
    runTokenGeneration();
    loadShadowOpportunities();
  }, []);

  const runSlwSimulation = async () => {
    setIsSlwLoading(true);
    const res = await simulateSLW(slwParams);
    setSlwResult(res);
    setIsSlwLoading(false);
  };

  const runXaiExplanation = async () => {
    setIsXaiLoading(true);
    const res = await fetchXAIExplanation(xaiParams);
    setXaiResult(res);
    setIsXaiLoading(false);
  };

  const runEsgCalculation = async () => {
    setIsEsgLoading(true);
    const res = await optimizeESG(esgParams);
    setEsgResult(res);
    setIsEsgLoading(false);
  };

  const runCtmcForecast = async () => {
    setIsCtmcLoading(true);
    const res = await forecastCTMC(ctmcParams);
    setCtmcResult(res);
    setIsCtmcLoading(false);
  };

  const runTokenGeneration = async () => {
    setIsTokenGenerating(true);
    const res = await generateOfflineToken(tokenParams);
    setTokenResult(res);
    setIsTokenGenerating(false);
  };

  const loadShadowOpportunities = async () => {
    setIsShadowLoading(true);
    const res = await fetchShadowPossessions();
    setShadowOpportunities(res);
    setIsShadowLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 07 • ADVANCED CAPABILITIES
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              CRIS & RDSO Spec Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <span>Cutting-Edge System Capabilities (6 Value-Adds)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic Single Line Working, SHAP & Counterfactual XAI, Green ESG Traction, CTMC Digital Twin, BLE Mesh PWA Token, and Shadow Block Opportunism.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('planner')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Open MILP Optimizer</span>
          </button>
        </div>
      </div>

      {/* Value-Add Feature Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Capability Matrix (All 6)</span>
        </button>

        <button
          onClick={() => setActiveTab('SLW')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'SLW'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrainTrack className="w-3.5 h-3.5 text-blue-400" />
          <span>1. SLW Simulator</span>
          <span className="text-[10px] px-1 rounded bg-blue-950 text-blue-300">65% Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('XAI')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'XAI'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>2. Counterfactual XAI</span>
          <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-300">SHAP</span>
        </button>

        <button
          onClick={() => setActiveTab('ESG')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ESG'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Green ESG Optimizer</span>
          <span className="text-[10px] px-1 rounded bg-emerald-950 text-emerald-300">Kinetic CO₂</span>
        </button>

        <button
          onClick={() => setActiveTab('CTMC')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'CTMC'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Digital Twin (Auto-TSR)</span>
          <span className="text-[10px] px-1 rounded bg-amber-950 text-amber-300">Markov CTMC</span>
        </button>

        <button
          onClick={() => setActiveTab('BLE_TOKEN')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'BLE_TOKEN'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bluetooth className="w-3.5 h-3.5 text-sky-400" />
          <span>5. Offline Mesh Token</span>
          <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-300">PWA Zero-Cell</span>
        </button>

        <button
          onClick={() => setActiveTab('SHADOW')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'SHADOW'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-300" />
          <span>6. Shadow Possession</span>
          <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-300">0 Delay</span>
        </button>
      </div>

      {/* TAB 0: ALL 6 CAPABILITY CARDS MATRIX */}
      {activeTab === 'ALL' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: SLW Simulator */}
            <div
              onClick={() => setActiveTab('SLW')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                    <TrainTrack className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">
                    FEATURE 01
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                  Dynamic Single Line Working (SLW)
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Converts intact track into reversible bi-directional signaling during UP/DN possessions. Simulates loop-line overtakes, preserving up to <strong>65% passenger throughput</strong>.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-300">
                  T_headway = t_run(A→B) + t_overlap + t_reversal
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Launch Interactive Trajectory Plot</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 2: Counterfactual XAI */}
            <div
              onClick={() => setActiveTab('XAI')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    FEATURE 02
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                  Counterfactual XAI Controller Interface
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Overcomes controller hesitancy with transparent <strong>SHAP waterfall attributions</strong> (+38% Risk, +22% OHE) and counterfactual "what-if" deferral impact cards.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                  Confidence: 94.6% | 3 Express Regs Predicted
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Inspect SHAP & Deferral Cascade</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 3: Green Traction ESG */}
            <div
              onClick={() => setActiveTab('ESG')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
                    FEATURE 03
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  Green Traction Energy & Idling Minimizer
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Quantifies kinetic energy losses from dead-stopping 5,000-tonne freight trains. Ranks slots that allow high-inertia freight to glide through crossovers.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                  E_loss = ½ M (v1² - v2²) + ∫ P_aux dt
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Calculate Freight Kinetic & CO₂ Offset</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 4: Digital Twin Track Deformation */}
            <div
              onClick={() => setActiveTab('CTMC')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/40">
                    FEATURE 04
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                  Digital Twin Track Deformation Forecast
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Applies a Continuous-Time Markov Chain (CTMC) <strong>P(t) = exp(Q·t)</strong> over axle load and weather telemetry, automatically flagging upcoming TSR speed restrictions.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300">
                  Auto-TSR: Bundles Tamping Before TSR Imposed
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>View 14-Day CTMC State Evolution</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 5: Offline BLE Mesh Token */}
            <div
              onClick={() => setActiveTab('BLE_TOKEN')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                    <Bluetooth className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    FEATURE 05
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                  Offline-First Edge-Mesh Digital Token
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Resolves zero-cellular connectivity in deep cuttings. Gang supervisors sign off track fitness via local cryptographic keys relayed through BLE peer-to-peer mesh.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                  Zero Manual Telephonic Block Clear Delay
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Simulate BLE PWA Mesh Sign-off</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 6: Shadow Possession Opportunism */}
            <div
              onClick={() => setActiveTab('SHADOW')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 transition">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    FEATURE 06
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-slate-200 transition">
                  Predictive Shadow Possession Opportunism
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Detects natural passenger lulls, mandatory train regulations, and terminal turnaround margins, executing maintenance with <strong>zero incremental delay</strong>.
                </p>
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                  Identified 2 Zero-Cost Corridor Windows
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Review Active Shadow Slots</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: SLW SIMULATOR */}
      {activeTab === 'SLW' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Feature 01 Simulator
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrainTrack className="w-5 h-5 text-blue-400" />
                  <span>Dynamic Single Line Working (SLW) Bi-Directional Simulator</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Models reversible bi-directional signaling on intact track during double-track line possessions.
                </p>
              </div>

              <button
                onClick={runSlwSimulation}
                disabled={isSlwLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSlwLoading ? 'animate-spin' : ''}`} />
                <span>Re-Simulate Trajectory</span>
              </button>
            </div>

            {/* Formula Banner */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                  Mathematical Headway Model
                </span>
                <div className="font-mono text-xs sm:text-sm text-blue-200 mt-1">
                  T_headway^SLW = t_run(Station A → B) + t_block_overlap + t_switch_reversal
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-800/80">
                  <span className="text-slate-400">Overlap Margin:</span>{' '}
                  <strong className="text-blue-300">3.5 mins</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-800/80">
                  <span className="text-slate-400">Switch Reversal:</span>{' '}
                  <strong className="text-blue-300">2.5 mins</strong>
                </div>
              </div>
            </div>

            {/* KPI Gauges */}
            {slwResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Throughput Retained</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1">
                    {slwResult.capacity_retention_percent}%
                  </div>
                  <span className="text-[11px] text-emerald-500/80">Prevents Total Cancellation</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">SLW Headway</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 mt-1">
                    {slwResult.t_headway_slw_mins}m
                  </div>
                  <span className="text-[11px] text-slate-500">Includes Overlap & Reversal</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Single Section Run</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-400 mt-1">
                    {slwResult.t_run_mins}m
                  </div>
                  <span className="text-[11px] text-slate-500">68 km @ 75 km/h Avg</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Dispatched Trains</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1">
                    {slwResult.trajectories.length}
                  </div>
                  <span className="text-[11px] text-slate-500">Alternating Batches</span>
                </div>
              </div>
            )}

            {/* Trajectory String Schedule */}
            {slwResult && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>SLW Station Loop-Line Overtake & Dispatch Trajectory</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3">Train No</th>
                        <th className="p-3">Train Name</th>
                        <th className="p-3">Direction</th>
                        <th className="p-3">Departure (Entry)</th>
                        <th className="p-3">Arrival (Clearance)</th>
                        <th className="p-3">Loop Holding Point</th>
                        <th className="p-3">Pilot Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-mono">
                      {slwResult.trajectories.map((tr, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">{tr.train_no}</td>
                          <td className="p-3 text-slate-200">{tr.train_name}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tr.direction === 'UP'
                                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                                  : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                              }`}
                            >
                              {tr.direction} LINE
                            </span>
                          </td>
                          <td className="p-3 text-sky-300">{tr.departure_time}</td>
                          <td className="p-3 text-blue-300">{tr.arrival_time}</td>
                          <td className="p-3 text-amber-300">{tr.loop_holding_station}</td>
                          <td className="p-3 text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{tr.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: XAI DECISION CARDS */}
      {activeTab === 'XAI' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Feature 02 Controller Dashboard
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span>Explainable AI (XAI) Controller Decision Cards (SHAP & Counterfactuals)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Replaces black-box AI recommendations with transparent attributions and "what-if deferral" consequence trees.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Test Deferral Hour:</span>
                <select
                  value={xaiParams.defer_hour}
                  onChange={(e) => {
                    const h = parseInt(e.target.value);
                    setXaiParams((prev) => ({ ...prev, defer_hour: h }));
                    fetchXAIExplanation({ ...xaiParams, defer_hour: h }).then(setXaiResult);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-300 cursor-pointer"
                >
                  <option value={14}>14:00 (Peak Freight)</option>
                  <option value={15}>15:00 (Shatabdi Rush)</option>
                  <option value={16}>16:00 (Evening Superfast)</option>
                </select>
              </div>
            </div>

            {/* SHAP Waterfall Attribution */}
            {xaiResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span>SHAP Waterfall Feature Attribution (Recommended Window: {xaiResult.window})</span>
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60 text-xs font-mono font-bold">
                    Net Controller Confidence: {xaiResult.controller_confidence_index}%
                  </div>
                </div>

                <div className="space-y-2.5">
                  {xaiResult.shap_waterfall.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{item.factor}</span>
                        <span
                          className={`font-mono font-bold ${
                            item.impact === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {item.attribution_percent > 0 ? `+${item.attribution_percent}%` : `${item.attribution_percent}%`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.abs(item.attribution_percent) * 2}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counterfactual Alternative Card */}
            {xaiResult && (
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Counterfactual What-If Comparison: Defer Window to {xaiParams.defer_hour}:00</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-900/60 text-red-200 border border-red-700">
                    Punctuality Penalty: ₹{(xaiResult.counterfactual.estimated_delay_cost_inr / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                <p className="text-xs text-red-200 font-medium">
                  {xaiResult.counterfactual.impact_summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {xaiResult.counterfactual.cascaded_trains.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-red-900/40 text-xs space-y-1">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{t.train_no}</span>
                        <span className="text-red-400 font-mono">+{t.delay_mins}m</span>
                      </div>
                      <div className="text-[11px] text-slate-300">{t.name}</div>
                      <div className="text-[10px] text-slate-400">Held at: {t.holding_point}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-center justify-between">
                  <span><strong>AI Controller Verdict:</strong> {xaiResult.counterfactual.recommendation}</span>
                  <button
                    onClick={() => onNavigate('planner')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition text-[11px]"
                  >
                    Lock Proposed Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GREEN ESG OPTIMIZER */}
      {activeTab === 'ESG' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Feature 03 ESG Optimizer
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span>Green Traction Energy & Carbon Minimization (ESG Metric)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Models kinetic energy loss E_loss = ½ M_r (v_approach² - v_hold²) + ∫ P_aux dt from halting 5,000t freight rakes.
                </p>
              </div>

              <button
                onClick={runEsgCalculation}
                disabled={isEsgLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isEsgLoading ? 'animate-spin' : ''}`} />
                <span>Re-Calculate Kinetic Footprint</span>
              </button>
            </div>

            {/* Interactive Parameters Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Train Mass: <strong className="text-white">{esgParams.train_mass_tonnes} tonnes</strong>
                </label>
                <input
                  type="range"
                  min="2000"
                  max="8000"
                  step="500"
                  value={esgParams.train_mass_tonnes}
                  onChange={(e) => {
                    const m = parseFloat(e.target.value);
                    setEsgParams((prev) => ({ ...prev, train_mass_tonnes: m }));
                    optimizeESG({ ...esgParams, train_mass_tonnes: m }).then(setEsgResult);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Approach Speed: <strong className="text-white">{esgParams.v_approach_kmh} km/h</strong>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={esgParams.v_approach_kmh}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setEsgParams((prev) => ({ ...prev, v_approach_kmh: v }));
                    optimizeESG({ ...esgParams, v_approach_kmh: v }).then(setEsgResult);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Hold/Crossover Speed: <strong className="text-white">{esgParams.v_hold_kmh} km/h</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={esgParams.v_hold_kmh}
                  onChange={(e) => {
                    const vh = parseFloat(e.target.value);
                    setEsgParams((prev) => ({ ...prev, v_hold_kmh: vh }));
                    optimizeESG({ ...esgParams, v_hold_kmh: vh }).then(setEsgResult);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">0 = Dead Stop, 40 = Glide</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Idling Time: <strong className="text-white">{esgParams.idle_duration_mins} mins</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={esgParams.idle_duration_mins}
                  onChange={(e) => {
                    const d = parseFloat(e.target.value);
                    setEsgParams((prev) => ({ ...prev, idle_duration_mins: d }));
                    optimizeESG({ ...esgParams, idle_duration_mins: d }).then(setEsgResult);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Meters */}
            {esgResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Kinetic Loss</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1">
                    {esgResult.kinetic_energy_loss_kwh} kWh
                  </div>
                  <span className="text-[11px] text-slate-500">Braking Deceleration</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Auxiliary Idling</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 mt-1">
                    {esgResult.auxiliary_energy_kwh} kWh
                  </div>
                  <span className="text-[11px] text-slate-500">Compressors & Aux Loads</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Carbon Emissions</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-red-400 mt-1">
                    {esgResult.co2_emissions_kg} kg
                  </div>
                  <span className="text-[11px] text-slate-500">Grid CO₂ Footprint</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Diesel Equivalent</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1">
                    {esgResult.equivalent_diesel_litres} L
                  </div>
                  <span className="text-[11px] text-emerald-500/80">Fuel Saved via Gliding</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CTMC DIGITAL TWIN TRACK DEFORMATION */}
      {activeTab === 'CTMC' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Feature 04 Digital Twin
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>Digital Twin Track Deformation Forecast (Auto-TSR Imposer)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Continuous-Time Markov Chain <strong>P(t) = exp(Q·t)</strong> over historic lifespans and axle load telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Horizon:</span>
                <select
                  value={ctmcParams.days_ahead}
                  onChange={(e) => {
                    const d = parseInt(e.target.value);
                    setCtmcParams((prev) => ({ ...prev, days_ahead: d }));
                    forecastCTMC({ ...ctmcParams, days_ahead: d }).then(setCtmcResult);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 cursor-pointer"
                >
                  <option value={7}>7 Days Ahead</option>
                  <option value={14}>14 Days Ahead</option>
                  <option value={30}>30 Days Ahead</option>
                </select>
              </div>
            </div>

            {/* CTMC Auto-TSR Imposer Alert */}
            {ctmcResult && ctmcResult.auto_tsr_imposed && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-amber-200">AUTO-TSR WARNING TRIGGERED:</strong> Day 14 Speed Restriction Probability is{' '}
                    <span className="font-mono font-bold text-amber-300">{ctmcResult.day_14_tsr_probability_percent}%</span>.
                    <div className="text-[11px] text-amber-300/80 mt-0.5">
                      {ctmcResult.preventative_action}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('planner')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer transition shrink-0"
                >
                  Bundle Tamping Now
                </button>
              </div>
            )}

            {/* 14-Day Trajectory Table */}
            {ctmcResult && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Markov State Probability Evolution (Good → Alert → Maintenance Needed → TSR)</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3">Day</th>
                        <th className="p-3">State 0: Good</th>
                        <th className="p-3">State 1: Alert</th>
                        <th className="p-3">State 2: Maint Needed</th>
                        <th className="p-3 text-red-400">State 3: TSR Imposed</th>
                        <th className="p-3">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-mono">
                      {ctmcResult.trajectory.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">Day +{row.day}</td>
                          <td className="p-3 text-emerald-400">{row.prob_good}%</td>
                          <td className="p-3 text-blue-400">{row.prob_alert}%</td>
                          <td className="p-3 text-amber-400">{row.prob_maintenance_needed}%</td>
                          <td className="p-3 font-bold text-red-400">{row.prob_tsr}%</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.prob_tsr > 20
                                  ? 'bg-red-900/60 text-red-300 border border-red-700'
                                  : row.prob_maintenance_needed > 25
                                  ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                              }`}
                            >
                              {row.prob_tsr > 20 ? 'TSR IMMINENT' : row.prob_maintenance_needed > 25 ? 'PLAN BUNDLE' : 'NORMAL'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: OFFLINE BLE MESH TOKEN */}
      {activeTab === 'BLE_TOKEN' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Feature 05 PWA Mobile Sign-off
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bluetooth className="w-5 h-5 text-sky-400" />
                  <span>Offline-First Edge-Mesh Digital Token System (PWI / SI Mobile Sign-off)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enables instant block clearance in zero-cellular tunnels/cuttings via cryptographic peer-to-peer BLE relay.
                </p>
              </div>

              <button
                onClick={runTokenGeneration}
                disabled={isTokenGenerating}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Mint New Verification Token</span>
              </button>
            </div>

            {/* Token Card & BLE Relay Hops */}
            {tokenResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Cryptographic Token Details */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span>Cryptographic Clearance Certificate</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {tokenResult.verification_status}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 font-mono text-sm sm:text-base text-blue-300 border border-slate-800 flex items-center justify-between">
                    <span>{tokenResult.token}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Supervisor / Gang ID:</span>
                      <strong>{tokenResult.gang_id}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Block ID:</span>
                      <strong>{tokenResult.block_id}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Line Restored:</span>
                      <strong className="text-emerald-400">{tokenResult.line_restored}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Track Fitness:</span>
                      <strong className="text-emerald-400">{tokenResult.track_fitness_status}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-xs text-emerald-300">
                    <strong>Zero-Cellular Verification:</strong> Cryptographically sanctioned at Station Master Electronic Interlocking panel without telephonic delays.
                  </div>
                </div>

                {/* Simulated BLE Mesh Relay Hops */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <WifiOff className="w-4 h-4 text-slate-400" />
                      <span>BLE Mesh Peer-to-Peer Relay Trajectory</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">Zero-4G Cellular</span>
                  </div>

                  <div className="space-y-3">
                    {tokenResult.mesh_hops.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-blue-300 flex items-center justify-center font-mono font-bold text-[10px]">
                          {h.hop}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-200">{h.node}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            RSSI: {h.ble_rssi_dbm} dBm • Status: {h.status}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono">
                          HOP {h.hop}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SHADOW POSSESSION OPPORTUNISM */}
      {activeTab === 'SHADOW' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Feature 06 Timetable Mining
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Predictive Shadow Possession Opportunism</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mines timetable gaps, terminal turnaround buffers, and mandatory train overtakes for zero-delay possessions.
                </p>
              </div>

              <button
                onClick={loadShadowOpportunities}
                disabled={isShadowLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isShadowLoading ? 'animate-spin' : ''}`} />
                <span>Re-Scan Timetable Shadows</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shadowOpportunities.map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                      {s.shadow_id}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{s.incremental_delay_minutes} min Extra Delay</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{s.parent_event}</h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Section: <strong className="text-slate-200">{s.section}</strong> • Window: <strong className="text-sky-300">{s.window}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Bundled Zero-Delay Requisitions:
                    </span>
                    {s.feasible_tasks.map((task, tIdx) => (
                      <div key={tIdx} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300 font-semibold">{s.efficiency_gain}</span>
                    <button
                      onClick={() => onNavigate('planner')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition text-[11px] shadow-sm"
                    >
                      Sanction Shadow Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
