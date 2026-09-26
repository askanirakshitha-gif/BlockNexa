import React, { useState } from 'react';
import {
  GitBranch,
  Database,
  MapPin,
  BarChart3,
  Cpu,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  Clock,
  Train,
  Check,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { STAGES_PIPELINE_DATA, DIVISION_INFO } from '../../data/railwayData';

export default function PipelineArchitectureModule({ onNavigate }) {
  const [selectedStage, setSelectedStage] = useState(1);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'cadence' | 'schema'

  const currentStageData = STAGES_PIPELINE_DATA.find((s) => s.stageNumber === selectedStage) || STAGES_PIPELINE_DATA[0];

  const stageModuleMap = {
    1: 'requests',
    2: 'map',
    3: 'requests',
    4: 'planner',
    5: 'conflicts',
    6: 'safety',
    7: 'simulation',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border border-blue-900/60 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                End-to-End System Blueprint
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Central Railway • {DIVISION_INFO.division} ({DIVISION_INFO.code})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              7-Stage Automatic Railway Block Planning Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl">
              From heterogeneous field requisitions (TMS, SMMS, TDMS, BDMS) to spatial normalization, AI risk indexing, MILP/CP-SAT multi-objective bundling, safety validation, and closed-loop telemetry audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('map')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore Railway Map</span>
            </button>
            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch AI Optimizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>7-Stage Pipeline Workflow</span>
        </button>
        <button
          onClick={() => setActiveTab('cadence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'cadence'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Planning Cadence Across 3 Horizons</span>
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Mathematical Formulation & Schema</span>
        </button>
      </div>

      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Horizontal Step Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {STAGES_PIPELINE_DATA.map((stg) => {
              const isSelected = selectedStage === stg.stageNumber;
              return (
                <button
                  key={stg.stageNumber}
                  onClick={() => setSelectedStage(stg.stageNumber)}
                  className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 shadow-lg shadow-blue-950 text-white'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-blue-300">
                      Stage {stg.stageNumber}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-xs font-bold line-clamp-2 leading-snug">
                    {stg.title.replace(`Stage ${stg.stageNumber}: `, '')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Breakdown Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    STAGE {currentStageData.stageNumber} OF 7
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {currentStageData.title}
                  </h2>
                </div>
                <div className="text-xs text-blue-400 font-medium mt-1">
                  {currentStageData.tagline}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {currentStageData.status}
                </span>
                <button
                  onClick={() => onNavigate(stageModuleMap[currentStageData.stageNumber])}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <span>Open Dedicated Module</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStageData.description}
            </p>

            {/* Inputs & Data Streams */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Ingestion Streams & Functional Vectors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStageData.inputs.map((inp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {inp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {inp.items}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 shrink-0">
                      {inp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Highlights / Engineering Guardrails */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Key Algorithmic Rules & Technical Guardrails
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {currentStageData.technicalHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2"
                  >
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cadence' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Planning Cadence Across Time Horizons
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hierarchical multi-tier railway scheduling spanning 30-day capacity reservations to real-time rolling adjustments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Horizon 1: Monthly Strategic */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      30-Day Window
                    </span>
                    <span className="text-[10px] text-slate-400">Headquarters Level</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Monthly Strategic</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Periodic maintenance schedules, mega-block requests, long-distance train timetables.
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Optimization Focus:</span>
                      <span className="text-slate-200">Corridor capacity reservation, major work-train allocations (BCM, TRT).</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Output / Artifact:</span>
                      <span className="text-blue-300 font-mono font-medium">Monthly block calendar and departmental quota allocations.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('gantt')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-blue-300 border border-blue-900/50 transition cursor-pointer"
                >
                  View Monthly Calendar
                </button>
              </div>

              {/* Horizon 2: Weekly Tactical */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-purple-900/40 shadow-lg shadow-purple-950/20 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      7-Day Rolling
                    </span>
                    <span className="text-[10px] text-purple-400">Divisional Level</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Weekly Tactical</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Overdue work queues, equipment/crew rosters, 7-day freight flow projections.
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Optimization Focus:</span>
                      <span className="text-slate-200">Inter-departmental work bundling, minimizing passenger service cancellations.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Output / Artifact:</span>
                      <span className="text-purple-300 font-mono font-medium">Finalized divisional weekly block schedule (Circular).</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('gantt')}
                  className="w-full py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-xs font-bold text-purple-200 border border-purple-700/50 transition cursor-pointer"
                >
                  View Weekly Schedule
                </button>
              </div>

              {/* Horizon 3: Daily Dynamic */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/40 shadow-lg shadow-emerald-950/20 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Live 24h Shift
                    </span>
                    <span className="text-[10px] text-emerald-400">Section Controller</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Daily / Dynamic Rolling</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time train positions from COA, emergent defects (TMS/SMMS), weather alerts.
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Optimization Focus:</span>
                      <span className="text-slate-200">Real-time slot adjustments, conflict resolution, execution telemetry.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-semibold">Output / Artifact:</span>
                      <span className="text-emerald-300 font-mono font-medium">Live digital block permits, real-time BDMS memos.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('safety')}
                  className="w-full py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-xs font-bold text-emerald-200 border border-emerald-700/50 transition cursor-pointer"
                >
                  Issue Digital Permits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Mathematical Formulations & System Schemas
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Rigorous operational research models governing BlockNexa's AI decision engine.
              </p>
            </div>

            {/* Formula 1: Linear Referencing */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                1. Linear Referencing Synchronization Tuple
              </span>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs sm:text-sm text-cyan-300 border border-slate-800 overflow-x-auto">
                Asset Location = (Division, Line Code, Chainage km Start, Chainage km End)
              </div>
              <p className="text-xs text-slate-400">
                Example: <code>(BSL, DN-MAIN, 284.2, 286.03)</code> links overlapping work zones regardless of department-specific naming schemes.
              </p>
            </div>

            {/* Formula 2: Composite Priority Index (CPI) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                2. Composite Priority Index (CPI)
              </span>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs sm:text-sm text-purple-300 border border-slate-800 overflow-x-auto">
                CPI = w1 · S_defect + w2 · D_overdue + w3 · C_asset + w4 · T_traffic
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <strong className="text-purple-300">w1 = 0.40:</strong> Technical defect severity (IMR flaws, cant deficiency)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <strong className="text-purple-300">w2 = 0.25:</strong> Time elapsed past regulatory deadline
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <strong className="text-purple-300">w3 = 0.20:</strong> Criticality index of asset (Mainline vs loop line)
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <strong className="text-purple-300">w4 = 0.15:</strong> Section throughput (GMT/day and peak passenger density)
                </div>
              </div>
              <div className="p-2 rounded bg-red-950/40 border border-red-900/40 text-xs text-red-300">
                <strong>Hard Safety Rule:</strong> Safety-critical defects (e.g. Neutral Section Arc Flashover) bypass batch schedules and route directly to the Emergency Corridor Intervention Queue.
              </div>
            </div>

            {/* Formula 3: MILP / CP-SAT Objective Function */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                3. Mixed-Integer Linear Programming (MILP) Objective Function
              </span>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs sm:text-sm text-emerald-300 border border-slate-800 overflow-x-auto">
                max [ α · RiskReduction + β · AssetAvailability ] - [ γ · PunctualityDegradation + δ · PossessionDuration ]
              </div>
              <p className="text-xs text-slate-400">
                Subject to: Work train turnaround times, power shut-off switching intervals (18 mins), material/crew availability, mandatory minimum headway gaps (15 mins), and safety clearing margins.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
