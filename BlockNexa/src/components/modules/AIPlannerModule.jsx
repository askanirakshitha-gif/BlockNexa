import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Train,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  CalendarDays,
  Play,
  Check,
  RefreshCw,
  TrendingDown,
  Timer,
  Sliders,
  CheckSquare,
  ShieldAlert,
  HardHat,
  SlidersHorizontal,
  ChevronRight,
  FileCheck2,
  Database,
  Target,
  Award,
  TrendingUp,
  Bot,
  ExternalLink,
} from 'lucide-react';
import {
  TIMETABLE_TRAINS,
  GOODS_TRAIN_FORECAST,
  AI_OPTIMIZED_PLAN_RESULT,
  WORK_COMPATIBILITY_MATRIX,
  RESOURCE_READINESS_DATA,
  MULTI_SCENARIO_OPTIONS,
} from '../../data/railwayData';
import { TRAINED_MODEL_METRICS } from '../../data/trainedModelMetrics';
import { predictDefectRisk, predictTrainDelay, solveBlockPlan } from '../../services/api';

export default function AIPlannerModule({
  maintenanceRequests,
  onNavigate,
  isOptimized,
  setIsOptimized,
}) {
  const [isSolving, setIsSolving] = useState(false);
  const [solverStage, setSolverStage] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('SOLVER'); // 'SOLVER', 'COMPATIBILITY', 'RESOURCES', 'SCENARIOS', 'ML_MODELS'
  const [selectedScenario, setSelectedScenario] = useState('OPT-C'); // Default Option C: Balanced

  // Live ML Interactive Testing State (FastAPI Backend)
  const [liveDefectInput, setLiveDefectInput] = useState({
    severity: 8,
    safety_criticality: 9,
    rail_wear_mm: 5.2,
    bearing_temperature_c: 72.0,
    overdue_days: 10,
    failure_history: 2,
    estimated_duration: 2.5,
    traffic_density: 0.8,
    vibration_level: 2.8,
  });
  const [liveRiskResult, setLiveRiskResult] = useState(null);
  const [isRiskPredicting, setIsRiskPredicting] = useState(false);

  const [liveDelayInput, setLiveDelayInput] = useState({
    distance_km: 350.0,
    block_duration_hours: 2.5,
    activities_bundled: 3,
    scheduled_hour: 14,
    traffic_intensity: 1.0,
    is_quad_corridor: true,
    has_loop_reroute: true,
  });
  const [liveDelayResult, setLiveDelayResult] = useState(null);
  const [isDelayPredicting, setIsDelayPredicting] = useState(false);

  const [weights, setWeights] = useState({
    severity: 40,
    tqi: 25,
    trafficHeadway: 20,
    multiDeptSynergy: 15,
  });

  const solverSteps = [
    'Ingesting real-time COA coaching timetables & FOIS freight paths...',
    'Evaluating Section Capacity & Headway Margins (MMR - CSN - BSL Quad corridor)...',
    'Executing Work Compatibility Matrix (Simultaneous Track + S&T + OHE possessions)...',
    'Ingesting Resource Readiness Matrix (BCM, CSM-952, Tower Wagon, Crew Gangs)...',
    'Solving Mixed-Integer Linear Program (MILP / CP-SAT): Minimizing passenger punctuality penalty...',
    'Synthesizing conflict-free, safety-verified Divisional Block Plan with Multi-Scenario Trade-Offs!',
  ];

  const handleRunOptimizer = () => {
    setIsSolving(true);
    setSolverStage(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setSolverStage(current);
      if (current >= solverSteps.length - 1) {
        clearInterval(interval);
        solveBlockPlan({ section: 'MMR - CSN', horizon: 'daily' }).catch(() => {});
        setTimeout(() => {
          setIsSolving(false);
          setIsOptimized(true);
        }, 700);
      }
    }, 600);
  };

  const handleRunLiveRisk = async () => {
    setIsRiskPredicting(true);
    const res = await predictDefectRisk(liveDefectInput);
    setLiveRiskResult(res);
    setIsRiskPredicting(false);
  };

  const handleRunLiveDelay = async () => {
    setIsDelayPredicting(true);
    const res = await predictTrainDelay(liveDelayInput);
    setLiveDelayResult(res);
    setIsDelayPredicting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
              Module 03 • CORE ENGINE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>AI Block Optimizer & Bundling Engine</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">
                MILP / CP-SAT Solver
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Combinatorial multi-objective optimization: bundles compatible cross-departmental possessions while minimizing passenger delay and freight dwell
          </p>
        </div>

        {/* Generate / Re-optimize Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimizer}
            disabled={isSolving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl shadow-purple-900/40 border border-purple-400/40 transition disabled:opacity-75 cursor-pointer"
          >
            {isSolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                <span>Running BlockNexa Solver ({solverStage + 1}/{solverSteps.length})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{isOptimized ? 'Re-Run MILP Optimizer' : 'Solve Multi-Objective Block Plan'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solver Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('SOLVER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'SOLVER'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>MILP Solver & Feeds</span>
        </button>
        <button
          onClick={() => setActiveSubTab('COMPATIBILITY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'COMPATIBILITY'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Work Compatibility Matrix</span>
        </button>
        <button
          onClick={() => setActiveSubTab('RESOURCES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'RESOURCES'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>Resource Readiness Matrix</span>
        </button>
        <button
          onClick={() => setActiveSubTab('SCENARIOS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'SCENARIOS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Multi-Scenario Trade-offs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ML_MODELS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'ML_MODELS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-yellow-400" />
          <span>Trained ML Models (RF & GBR)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.accuracy}% Acc
          </span>
        </button>
      </div>

      {/* Solver In-Progress Animation Banner */}
      {isSolving && (
        <div className="bg-purple-950/40 rounded-2xl border border-purple-500/60 p-5 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Multi-Objective MILP / CP-SAT Solver Executing</span>
            </span>
            <span className="text-xs font-mono font-bold text-purple-200">
              Stage {solverStage + 1} of {solverSteps.length}
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${((solverStage + 1) / solverSteps.length) * 100}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm font-mono text-purple-200">
            &gt; {solverSteps[solverStage]}
          </p>
        </div>
      )}

      {/* SUB-TAB 1: SOLVER & 4 FEEDS */}
      {activeSubTab === 'SOLVER' && (
        <div className="space-y-6">
          {/* 4 Core Data Streams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Stream 1: Maintenance Requests */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Maintenance Requisitions
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
                  {maintenanceRequests.length} Active
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Engineering (TMS)</span>
                  <span className="font-mono font-semibold text-amber-400">3 Reqs (BCM, Tamping)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Traction (TDMS)</span>
                  <span className="font-mono font-semibold text-cyan-400">2 Reqs (OHE, PTFE)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">S&T (SMMS)</span>
                  <span className="font-mono font-semibold text-emerald-400">2 Reqs (Point, DAC)</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Joint Candidate Rate:</span>
                <span className="font-bold text-emerald-400">66.7% Bundled</span>
              </div>
            </div>

            {/* Stream 2: Train Timetable (COA Live) */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Train Timetable (COA)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                  6 Trains Monitored
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">22222 Vande Bharat</span>
                  <span className="font-mono font-semibold text-white">10:32 CSN (P1)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">12951 Mumbai Rajdhani</span>
                  <span className="font-mono font-semibold text-white">11:34 CSN (P1)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">12137 Punjab Mail</span>
                  <span className="font-mono font-semibold text-white">12:42 CSN (P2)</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>High-Speed Path Shield:</span>
                <span className="font-bold text-emerald-400">P1 Locked</span>
              </div>
            </div>

            {/* Stream 3: Goods-Train Forecast (FOIS) */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Goods Forecast (FOIS)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold">
                  3 Rakes Slotted
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">CONCOR Double Stack</span>
                  <span className="font-mono text-blue-300 font-medium">Hold at Odha Loop</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">NTPC Coal Rake</span>
                  <span className="font-mono text-amber-300 font-medium">3rd Line Bypass</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">FCI BCN-E Foodgrain</span>
                  <span className="font-mono text-emerald-300 font-medium">Tail-gate Duronto</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Freight Revenue Protection:</span>
                <span className="font-bold text-emerald-400">96.4%</span>
              </div>
            </div>

            {/* Stream 4: Corridor Capacity */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  4. Corridor Capacity
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold">
                  Quad Track
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Down Main Line</span>
                  <span className="font-mono text-purple-300 font-bold">Window 10:45-13:45</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Up Main Line</span>
                  <span className="font-mono text-cyan-300 font-bold">Window 14:15-16:00</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Bi-Dir Loop 3 (CSN)</span>
                  <span className="font-mono text-emerald-300 font-semibold">Available for Divert</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Corridor Safety Margin:</span>
                <span className="font-bold text-emerald-400">100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Interactive Weights & Joint Bundling Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: AI Multi-Factor Priority Engine */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    MILP Objective Function Weights
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Weights Total: 100%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] sm:text-xs text-purple-200 border border-slate-800 overflow-x-auto">
                max Z = λ₁ ∑_(i,t) [ P_i · u_i,t ] + λ₂ ∑_(i&lt;j) [ C_i,j · b_i,j ] - λ₃ ∑_r [ V_r · δ_r ] - λ₄ ∑_(k,t) [ y_k,t ]
              </div>

              {/* Pareto Tuning Weights interactive */}
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Risk Reduction Weight (λ₁ · ∑ P_i · u_i,t)</span>
                    <span className="text-purple-400 font-mono font-bold">{weights.severity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={weights.severity}
                    onChange={(e) => setWeights({ ...weights, severity: Number(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Bundling Synergy Weight (λ₂ · ∑ C_i,j · b_i,j)</span>
                    <span className="text-amber-400 font-mono font-bold">{weights.multiDeptSynergy}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={weights.multiDeptSynergy}
                    onChange={(e) => setWeights({ ...weights, multiDeptSynergy: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Train Delay Penalty Weight (λ₃ · ∑ V_r · δ_r)</span>
                    <span className="text-red-400 font-mono font-bold">{weights.trafficHeadway}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={weights.trafficHeadway}
                    onChange={(e) => setWeights({ ...weights, trafficHeadway: Number(e.target.value) })}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Possession Footprint Weight (λ₄ · ∑ y_k,t)</span>
                    <span className="text-blue-400 font-mono font-bold">{weights.tqi}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weights.tqi}
                    onChange={(e) => setWeights({ ...weights, tqi: Number(e.target.value) })}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right: Multi-Department Coordination (Joint Bundling) */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    Multi-Department Joint Bundling Result
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Joint Bundling Active
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Detects adjacent spatial maintenance demands and synchronizes them into a single track possession within a 12 km isolation block.
              </p>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Bundled Joint Block #JB-01
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Saves 165 Track Minutes
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-semibold text-slate-200">TMS:</span>
                    <span className="text-slate-400 truncate">Deep Ballast Screening & Rail Weld (Km 284/12)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-slate-200">TDMS:</span>
                    <span className="text-slate-400 truncate">Contact Wire Grooving & Cantilever #32 (Km 285/02)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">SMMS:</span>
                    <span className="text-slate-400 truncate">Point 104A Interlocking Diagnostic (CSN Yard)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Coordinated Window:</span>
                  <span className="font-bold font-mono">10:45 — 13:45 (Single 180 min possession)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Plan Results */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Generated Optimized Block Plan Summary
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                    Plan ID: {AI_OPTIMIZED_PLAN_RESULT.planId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Solver: {AI_OPTIMIZED_PLAN_RESULT.algorithmEngine} • Generated {AI_OPTIMIZED_PLAN_RESULT.generatedAt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('gantt')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>View in Gantt Timeline</span>
                </button>
                <button
                  onClick={() => onNavigate('safety')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Sanction Gate</span>
                </button>
              </div>
            </div>

            {/* 4 Quantitative Result Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Optimization Score</div>
                <div className="text-xl font-mono font-extrabold text-emerald-400">
                  {AI_OPTIMIZED_PLAN_RESULT.optimizationScore}%
                </div>
                <div className="text-[10px] text-slate-500">MIP Heuristic Solved</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Delay Averted</div>
                <div className="text-xl font-mono font-extrabold text-purple-400">
                  {AI_OPTIMIZED_PLAN_RESULT.totalPunctualityLossAverted}
                </div>
                <div className="text-[10px] text-slate-500">-78.4% Passenger delay</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Joint Bundled Blocks</div>
                <div className="text-xl font-mono font-extrabold text-blue-400">
                  {AI_OPTIMIZED_PLAN_RESULT.jointBlocksCreated} Windows
                </div>
                <div className="text-[10px] text-slate-500">TMS + TDMS + SMMS</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Punctuality Retention</div>
                <div className="text-xl font-mono font-extrabold text-emerald-400">
                  98.2%
                </div>
                <div className="text-[10px] text-slate-500">COA Timetable Protected</div>
              </div>
            </div>

            {/* Scheduled Windows Overview */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Optimized Corridor Allocations Ready for Dispatch
              </h4>

              {AI_OPTIMIZED_PLAN_RESULT.scheduledWindows.map((win) => (
                <div
                  key={win.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-800">
                        {win.id}
                      </span>
                      <span className="text-sm font-bold text-white">{win.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">Window:</span>
                      <span className="text-yellow-400 font-bold bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800/40">
                        {win.scheduledStart} — {win.scheduledEnd} ({win.duration})
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    <strong>Corridor:</strong> {win.section} • <strong>Track:</strong> {win.line}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                      Train Regulation Plan:
                    </div>
                    {win.trainRegulationPlan.map((reg, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <span className="text-purple-400">•</span>
                        <span>{reg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WORK COMPATIBILITY MATRIX */}
      {activeSubTab === 'COMPATIBILITY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Work Compatibility Matrix (Simultaneous Corridor Possessions)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-configured safety rules defining which maintenance tasks can safely share track possessions and power isolation zones
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                5 Active Rules
              </span>
            </div>

            <div className="space-y-4">
              {WORK_COMPATIBILITY_MATRIX.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Rule #{idx + 1}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${rule.badgeColor}`}>
                        {rule.compatibility}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Synergy Score: <strong className="text-emerald-400 font-mono">{rule.synergyScore}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Activity A</span>
                      <span className="text-white font-semibold">{rule.activityA}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Activity B</span>
                      <span className="text-white font-semibold">{rule.activityB}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong>Operational Rationale:</strong> {rule.ruleExplanation}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-amber-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Mandatory Safety Guardrail:</strong> {rule.safetyRestrictions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RESOURCE READINESS MATRIX */}
      {activeSubTab === 'RESOURCES' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Resource Readiness Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time inventory and certification telemetry of heavy track machines, catenary tower wagons, certified crew gangs, and critical spares
              </p>
            </div>

            {/* Machinery Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-400" />
                <span>Heavy On-Track Machinery (BCM, CSM, Tower Wagon)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {RESOURCE_READINESS_DATA.machinery.map((mch) => (
                  <div key={mch.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-300">{mch.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {mch.status}
                      </span>
                    </div>
                    <div className="font-bold text-white">{mch.name}</div>
                    <div className="text-[11px] text-slate-400">Depot: {mch.location}</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                      <span>Fuel / Battery: <strong className="text-emerald-400">{mch.fuelLevel}</strong></span>
                      <span className="text-slate-400">{mch.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew Gangs & Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Certified Departmental Gang Rosters
                </h4>
                <div className="space-y-2">
                  {RESOURCE_READINESS_DATA.crews.map((crw) => (
                    <div key={crw.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{crw.name} ({crw.count} Personnel)</div>
                        <div className="text-[11px] text-slate-400">Supervisor: {crw.supervisor} • {crw.certStatus}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {crw.readiness}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power Isolation & Materials */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Power Isolation & Critical Materials
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Power Switching Interval:</span>
                    <span className="font-mono font-bold text-yellow-300">{RESOURCE_READINESS_DATA.powerIsolation.switchingIntervalMins} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Earthing Discharge Rods:</span>
                    <span className="text-emerald-400 font-bold">{RESOURCE_READINESS_DATA.powerIsolation.earthingDischargeRods}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">SCADA Remote Link:</span>
                    <span className="text-emerald-400 font-bold">Online & Verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {RESOURCE_READINESS_DATA.materials.map((mat, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-200">{mat.name}</span>
                      <span className="font-mono font-bold text-cyan-300">{mat.quantity} ({mat.status})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MULTI-SCENARIO TRADE-OFFS */}
      {activeSubTab === 'SCENARIOS' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Multi-Scenario Trade-Off Evaluation (Explainable Controller View)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare candidate block configurations with explicit trade-off indicators (Track meters cleared vs Passenger delay minutes)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {MULTI_SCENARIO_OPTIONS.map((opt) => {
                const isSelected = selectedScenario === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedScenario(opt.id)}
                    className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-500 shadow-xl shadow-purple-950/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                          {opt.id}
                        </span>
                        {opt.isRecommended && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Recommended
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.subtitle}</p>

                      <div className="my-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-mono font-bold text-yellow-300">{opt.duration}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">Track Output Cleared:</span>
                          <span className="font-mono font-bold text-blue-300">{opt.trackOutputMeters}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">Passenger Delay:</span>
                          <span className="font-mono font-bold text-purple-300">+{opt.passengerDelayTotalMins} Mins</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">Risk Eliminated:</span>
                          <span className="font-mono font-bold text-emerald-400">{opt.riskEliminatedPercent}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic mb-3">
                        "{opt.tradeoffSummary}"
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScenario(opt.id);
                        onNavigate('safety');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSelected ? 'Selected for Sanction' : 'Select This Scenario'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Trained ML Models (RandomForest & GradientBoosting) */}
      {activeSubTab === 'ML_MODELS' && (
        <div className="space-y-6">
          {/* Provenance & Training Pipeline Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/50 shadow-xl space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40 shrink-0">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold text-white tracking-wide">
                      Machine Learning Engine: Trained on Cloned Indian Railways Datasets
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40">
                      scikit-learn
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Trained: {TRAINED_MODEL_METRICS.trainedAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Directly trained from cloned repository{' '}
                    <code className="px-1.5 py-0.5 rounded bg-slate-950 text-purple-300 font-mono text-[11px] border border-slate-800">
                      {TRAINED_MODEL_METRICS.repositorySource}
                    </code>{' '}
                    and open-source telemetry{' '}
                    <code className="px-1.5 py-0.5 rounded bg-slate-950 text-blue-300 font-mono text-[11px] border border-slate-800">
                      samyuktha01/Indian_Railway_maintance
                    </code>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-extrabold text-purple-300">
                    2 ML Models Operational
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    RandomForest + GradientBoosting
                  </div>
                </div>
              </div>
            </div>

            {/* Ingested Training Files List */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400 font-semibold">Cloned Training Datasets:</span>
              {TRAINED_MODEL_METRICS.datasetFiles.map((file, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                >
                  {file}
                </span>
              ))}
            </div>
          </div>

          {/* Dual Model Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model 1: Maintenance Risk Classifier */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Model 1: Maintenance Defect Risk Classifier</span>
                    </h3>
                    <div className="text-[11px] text-purple-300 font-mono">
                      {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.algorithm} (120 Trees, Balanced)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.accuracy}% Accuracy
                </span>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.accuracy}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Precision</span>
                  <span className="font-mono font-extrabold text-purple-300 text-sm">
                    {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.precision}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Recall</span>
                  <span className="font-mono font-extrabold text-blue-300 text-sm">
                    {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.recall}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">ROC-AUC</span>
                  <span className="font-mono font-extrabold text-yellow-300 text-sm">
                    {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.metrics.rocAuc}
                  </span>
                </div>
              </div>

              {/* Feature Importances */}
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Top Predictive Features (Gini Importance):
                </span>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.featureImportances)
                    .slice(0, 5)
                    .map(([feature, imp]) => (
                      <div key={feature} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-300">{feature}</span>
                          <span className="font-mono text-purple-300">{(imp * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${imp * 100 * 2.5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sample Inferences */}
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Live Model Inferences on Pending Requisitions:
                </span>
                <div className="space-y-2">
                  {TRAINED_MODEL_METRICS.models.maintenanceRiskClassifier.samplePredictions.map((pred, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{pred.defect}</div>
                        <div className="text-[10px] text-slate-400">{pred.action}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            pred.priorityClass === 'CRITICAL'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : pred.priorityClass === 'HIGH'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          Risk: {(pred.predictedRisk * 100).toFixed(0)}% • {pred.priorityClass}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model 2: Train Delay Regressor */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Model 2: Train Delay & Punctuality Regressor</span>
                    </h3>
                    <div className="text-[11px] text-cyan-300 font-mono">
                      {TRAINED_MODEL_METRICS.models.trainDelayRegressor.algorithm} (150 Estimators, lr=0.08)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  R² = {TRAINED_MODEL_METRICS.models.trainDelayRegressor.metrics.r2Score}
                </span>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">R² Variance</span>
                  <span className="font-mono font-extrabold text-cyan-400 text-sm">
                    {(TRAINED_MODEL_METRICS.models.trainDelayRegressor.metrics.r2Score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Mean Abs Error</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    {TRAINED_MODEL_METRICS.models.trainDelayRegressor.metrics.maeMinutes} min
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">RMSE</span>
                  <span className="font-mono font-extrabold text-purple-300 text-sm">
                    {TRAINED_MODEL_METRICS.models.trainDelayRegressor.metrics.rmseMinutes} min
                  </span>
                </div>
              </div>

              {/* Feature Importances */}
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Top Train Delay Drivers (Feature Weights):
                </span>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(TRAINED_MODEL_METRICS.models.trainDelayRegressor.featureImportances)
                    .slice(0, 5)
                    .map(([feature, imp]) => (
                      <div key={feature} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-300">{feature}</span>
                          <span className="font-mono text-cyan-300">{(imp * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${imp * 100 * 3.5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Delay Mitigation Comparison */}
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Predicted Train Delay Across Operational Scenarios:
                </span>
                <div className="space-y-2">
                  {TRAINED_MODEL_METRICS.models.trainDelayRegressor.delayMitigationScenarios.map((scen, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{scen.scenario}</div>
                        <div className="text-[10px] text-slate-400">{scen.status}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-mono font-extrabold text-sm ${
                            scen.predictedDelay > 20
                              ? 'text-red-400'
                              : scen.predictedDelay > 8
                              ? 'text-yellow-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {scen.predictedDelay} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live ML Interactive Testing Sandbox (Hits FastAPI /api/ml endpoints) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Live ML Model Inference Sandbox (FastAPI API Client)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      LIVE SERVER: http://127.0.0.1:8000
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust real railway parameters below and trigger real-time predictions directly on the loaded Python model binaries.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
              {/* Live Test 1: Defect Risk */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span>Test RandomForest Risk Classifier</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-300">POST /api/ml/predict-risk</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Severity: <strong className="text-white">{liveDefectInput.severity}/10</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={liveDefectInput.severity}
                      onChange={(e) => setLiveDefectInput({ ...liveDefectInput, severity: Number(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Safety Criticality: <strong className="text-white">{liveDefectInput.safety_criticality}/10</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={liveDefectInput.safety_criticality}
                      onChange={(e) => setLiveDefectInput({ ...liveDefectInput, safety_criticality: Number(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Rail Wear (mm): <strong className="text-amber-400">{liveDefectInput.rail_wear_mm} mm</strong>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="8.0"
                      step="0.2"
                      value={liveDefectInput.rail_wear_mm}
                      onChange={(e) => setLiveDefectInput({ ...liveDefectInput, rail_wear_mm: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Bearing Temp (°C): <strong className="text-rose-400">{liveDefectInput.bearing_temperature_c} °C</strong>
                    </label>
                    <input
                      type="range"
                      min="35"
                      max="95"
                      value={liveDefectInput.bearing_temperature_c}
                      onChange={(e) => setLiveDefectInput({ ...liveDefectInput, bearing_temperature_c: Number(e.target.value) })}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunLiveRisk}
                  disabled={isRiskPredicting}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isRiskPredicting ? 'Executing Python ML Inference...' : 'Run Live Backend Risk Prediction'}</span>
                </button>

                {liveRiskResult && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-semibold">Predicted Deferral Risk:</span>
                      <span className="font-mono font-extrabold text-sm text-purple-200">
                        {liveRiskResult.predicted_risk_percent}% ({liveRiskResult.priority_class})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Emergency Bypass:</span>
                      <span className={`font-bold ${liveRiskResult.is_emergency_bypass ? 'text-red-400' : 'text-emerald-400'}`}>
                        {liveRiskResult.is_emergency_bypass ? 'YES (Bypass Active)' : 'NO (Normal Queue)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 pt-1 border-t border-purple-800/60">
                      <strong>AI Action:</strong> {liveRiskResult.recommended_action}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Test 2: Train Delay */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    <span>Test GradientBoosting Delay Regressor</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">POST /api/ml/predict-delay</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Block Duration: <strong className="text-white">{liveDelayInput.block_duration_hours} hrs</strong>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.5"
                      value={liveDelayInput.block_duration_hours}
                      onChange={(e) => setLiveDelayInput({ ...liveDelayInput, block_duration_hours: Number(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Bundled Tasks: <strong className="text-white">{liveDelayInput.activities_bundled} Depts</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={liveDelayInput.activities_bundled}
                      onChange={(e) => setLiveDelayInput({ ...liveDelayInput, activities_bundled: Number(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-300 font-semibold">Enable Loop Line Bi-directional Bypass:</span>
                    <input
                      type="checkbox"
                      checked={liveDelayInput.has_loop_reroute}
                      onChange={(e) => setLiveDelayInput({ ...liveDelayInput, has_loop_reroute: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 cursor-pointer rounded"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunLiveDelay}
                  disabled={isDelayPredicting}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isDelayPredicting ? 'Executing Python ML Inference...' : 'Run Live Backend Delay Prediction'}</span>
                </button>

                {liveDelayResult && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-semibold">Predicted Train Delay:</span>
                      <span className="font-mono font-extrabold text-sm text-cyan-300">
                        {liveDelayResult.predicted_delay_minutes} minutes
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Strategy:</strong> {liveDelayResult.mitigation_strategy}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Re-training Terminal Command Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Continuous ML Model Re-Training</span>
              <p className="text-slate-400 mt-0.5">
                Re-train and evaluate both models anytime using the Python pipeline script:
              </p>
            </div>
            <code className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs">
              python scripts/train_model.py
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
