import React from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  Train,
  CheckCircle2,
  Cpu,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  Zap,
  Gauge,
} from 'lucide-react';

export default function DashboardModule({
  maintenanceRequests,
  activeBlocks,
  conflicts,
  onNavigate,
  onRunPlanner,
  isOptimized,
  isPlanApproved,
}) {
  const criticalDefects = maintenanceRequests.filter(
    (r) => r.severity === 'Critical' || r.severity === 'Emergency'
  );
  const pendingRequests = maintenanceRequests.filter((r) => r.status.includes('Pending'));

  return (
    <div className="space-y-6">
      {/* Hero Control Room Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-900/50 p-5 sm:p-6 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Live Automated Operations
              </span>
              <span className="text-xs text-slate-400">
                Shift Status: Day Window Planning Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Divisional Block & Maintenance Operations Console
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              AI-driven coordination across <strong>Engineering (TMS)</strong>, <strong>Traction (TDMS)</strong>, and <strong>S&T (SMMS)</strong>. Minimizing train delays while ensuring 100% track safety integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('requests')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Review Requests ({pendingRequests.length})</span>
            </button>

            <button
              onClick={() => {
                onNavigate('planner');
                onRunPlanner();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/30 border border-purple-400/40 transition cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-yellow-300" />
              <span>{isOptimized ? 'Re-run AI Optimizer' : 'Run AI Block Planner'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Essential Metrics Cards (As specified in Module 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Pending Maintenance */}
        <div
          onClick={() => onNavigate('requests')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-blue-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Maint.</span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{pendingRequests.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-blue-400 mt-1">
            <span>TMS, TDMS & SMMS feeds</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 2. Critical Defects */}
        <div
          onClick={() => onNavigate('assets')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-red-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Defects</span>
            <div className="p-2 rounded-lg bg-red-950/60 text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400 tracking-tight">{criticalDefects.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
            <span>1 Emergency • 2 Severe</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 3. Active Blocks */}
        <div
          onClick={() => onNavigate('gantt')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-amber-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Blocks</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300 tracking-tight">{activeBlocks.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400/90 mt-1">
            <span>Live on Up/Dn Lines</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 4. Conflicts */}
        <div
          onClick={() => onNavigate('conflicts')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-rose-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conflicts</span>
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">{conflicts.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
            <span>AI solutions ready</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 5. Asset Availability */}
        <div
          onClick={() => onNavigate('assets')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-emerald-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Asset Availability</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">94.2%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <span>Target: &gt;92% (Normal)</span>
          </div>
        </div>

        {/* 6. Today's Block Schedule */}
        <div
          onClick={() => onNavigate('gantt')}
          className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-purple-500/60 transition cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Schedule</span>
            <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-300 tracking-tight">3 Windows</div>
          <div className="flex items-center gap-1 text-[11px] text-purple-400 mt-1">
            <span>2 Joint Multi-Dept</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Blocks Live Status & AI Optimization Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Blocks in Progress & Today's Block Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Blocks Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-base font-bold text-white">
                  Active Live Railway Blocks (Corridor Possession)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Divisional Caution Orders in force
              </span>
            </div>

            <div className="space-y-3">
              {activeBlocks.map((block) => (
                <div
                  key={block.blockId}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                        {block.blockId}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {block.type}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-medium">
                      {block.startTime} — {block.endTime} ({block.remainingMins}m remaining)
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <span><strong>Section:</strong> {block.section}</span>
                    <span><strong>Track:</strong> {block.line}</span>
                    <span><strong>Supervisor:</strong> {block.crewSupervisor}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        block.deptColor === 'amber'
                          ? 'bg-amber-500'
                          : block.deptColor === 'cyan'
                          ? 'bg-cyan-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${block.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{block.safetyStatus}</span>
                    <span className="font-semibold text-amber-300">{block.cautionOrder}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Block Schedule Overview */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Today's Sanctioned & AI Proposed Block Windows</span>
              </h3>
              <button
                onClick={() => onNavigate('gantt')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View Full Interactive Gantt</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Window 1 */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/50 hover:border-purple-600 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                    Joint Integrated Block (TMS + TDMS + SMMS)
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    10:45 — 13:45
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  MMR — CSN Down Mainline Mega Window
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Ballast cleaning, contact wire replacement & point 104A test combined into single 3h corridor possession.
                </p>
                <div className="flex items-center justify-between text-xs text-emerald-400 border-t border-purple-900/40 pt-2 font-mono">
                  <span>Punctuality impact: -4 mins</span>
                  <span>Delay saved: 165 mins</span>
                </div>
              </div>

              {/* Window 2 */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/50 hover:border-blue-600 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700">
                    Emergency TRD Power Block
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    14:15 — 16:00
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  NK — MMR Up Mainline Neutral Section
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  PTFE Insulator flashover defect rectification under isolated power shut-off.
                </p>
                <div className="flex items-center justify-between text-xs text-cyan-400 border-t border-blue-900/40 pt-2 font-mono">
                  <span>Traffic: Diesel pilot working</span>
                  <span>Safety: Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Planner Engine Status & Quick Navigation */}
        <div className="space-y-6">
          {/* AI Optimizer Card */}
          <div className="bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 rounded-2xl border border-purple-900/40 p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40">
                <Cpu className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">BlockNexa AI Core</h4>
                <span className="text-[11px] text-purple-300">Continuous Optimization Engine</span>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Timetable Conflict Check</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Freight Rake Flexibility</span>
                <span className="text-blue-400 font-semibold">3 Goods Slots Slotted</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Joint Bundling Efficiency</span>
                <span className="text-purple-300 font-semibold">+68% Track Time Saved</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Punctuality Projection</span>
                <span className="text-emerald-400 font-mono font-bold">98.2%</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('planner')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Open AI Block Planner (CORE)</span>
            </button>
          </div>

          {/* Quick Critical Defects Alert */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Urgent Action Required</span>
              </h4>
              <span className="text-[11px] font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/60">
                2 High Priority
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs">
                <div className="font-semibold text-white mb-0.5">
                  PTFE Insulator Flashover Warning
                </div>
                <div className="text-slate-400 text-[11px] mb-2">
                  NK — MMR Up Line Km 210/14 • Electrical TRD
                </div>
                <button
                  onClick={() => onNavigate('conflicts')}
                  className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Resolve in Conflict Center</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs">
                <div className="font-semibold text-white mb-0.5">
                  Rail Ultrasonic Flaw (IMR defect)
                </div>
                <div className="text-slate-400 text-[11px] mb-2">
                  MMR — CSN Down Line Km 284/12 • P-Way TMS
                </div>
                <button
                  onClick={() => onNavigate('planner')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Slot in Joint Block</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
