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
} from 'lucide-react';
import {
  TIMETABLE_TRAINS,
  GOODS_TRAIN_FORECAST,
  AI_OPTIMIZED_PLAN_RESULT,
} from '../../data/railwayData';

export default function AIPlannerModule({
  maintenanceRequests,
  onNavigate,
  isOptimized,
  setIsOptimized,
}) {
  const [isSolving, setIsSolving] = useState(false);
  const [solverStage, setSolverStage] = useState(0);
  const [weights, setWeights] = useState({
    severity: 40,
    tqi: 25,
    trafficHeadway: 20,
    multiDeptSynergy: 15,
  });

  const solverSteps = [
    'Ingesting real-time COA coaching timetables & FOIS freight paths...',
    'Evaluating Section Capacity & Headway Margins (MMR - CSN - BSL)...',
    'Detecting spatial-temporal clashes across 7 maintenance requests...',
    'Executing Multi-Department Joint Bundling (TMS + TDMS + SMMS)...',
    'Heuristic MIP Solver: Minimizing passenger punctuality penalty...',
    'Synthesizing conflict-free, safety-verified Divisional Block Plan!',
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
        setTimeout(() => {
          setIsSolving(false);
          setIsOptimized(true);
        }, 700);
      }
    }, 600);
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
              <span>AI Block Planner</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">
                Neural MIP Solver
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-department block scheduling with real-time timetable clash avoidance and goods-train path preservation
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
                <span>{isOptimized ? 'Re-Generate Optimized Block Plan' : 'Generate Optimized Block Plan'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solver In-Progress Animation Banner */}
      {isSolving && (
        <div className="bg-purple-950/40 rounded-2xl border border-purple-500/60 p-5 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Multi-Objective Optimization in Progress</span>
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
            <span>Critical Defect Ratio:</span>
            <span className="font-bold text-red-400">42.8%</span>
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

        {/* Stream 4: Corridor Availability */}
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

      {/* AI Priority Matrix & Multi-Department Coordination Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Multi-Factor Priority Engine */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                AI Priority Calculation Engine
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Weights Total: 100%
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Calculates composite maintenance urgency by blending track safety severity, ultrasonic flaw severity, train headway penalty, and inter-departmental bundling potential.
          </p>

          {/* Weight sliders interactive */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Defect Severity & Safety Risk Weight</span>
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
                <span className="text-slate-300 font-medium">Track Quality Index (TQI) / Wear Weight</span>
                <span className="text-blue-400 font-mono font-bold">{weights.tqi}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={weights.tqi}
                onChange={(e) => setWeights({ ...weights, tqi: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Traffic Density & Delay Penalty Weight</span>
                <span className="text-emerald-400 font-mono font-bold">{weights.trafficHeadway}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={weights.trafficHeadway}
                onChange={(e) => setWeights({ ...weights, trafficHeadway: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Multi-Department Bundling Synergy Weight</span>
                <span className="text-amber-400 font-mono font-bold">{weights.multiDeptSynergy}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.multiDeptSynergy}
                onChange={(e) => setWeights({ ...weights, multiDeptSynergy: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
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
                Multi-Department Coordination Engine
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Joint Bundling Active
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Detects adjacent spatial maintenance demands and synchronizes them into a single track possession, eliminating duplicate corridor shutdowns.
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

      {/* Generated Plan Results (Always Visible or when Generated) */}
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
              onClick={() => onNavigate('impact')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Train className="w-4 h-4" />
              <span>Inspect Train Impact</span>
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
  );
}
