import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Train,
  CheckCircle2,
  HardHat,
  Zap,
  Radio,
  Layers,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Flame,
  FileCheck2,
  Send,
  Timer,
  Check,
} from 'lucide-react';
import { DYNAMIC_REPLANNING_DATA } from '../../data/railwayData';

export default function SimulationReplanningModule({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('REPLANNER'); // 'REPLANNER' | 'COUNTDOWN' | 'AUDIT'
  const [microShiftMins, setMicroShiftMins] = useState(15);
  const [isApplyingShift, setIsApplyingShift] = useState(false);
  const [shiftApplied, setShiftApplied] = useState(false);

  // What-if simulator state
  const [blockStartTime, setBlockStartTime] = useState(10.75); // 10:45 = 10.75
  const [durationMins, setDurationMins] = useState(180); // 3h = 180 mins
  const [enableSLW, setEnableSLW] = useState(true);
  const [divertFreight, setDivertFreight] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState({
    before: {
      totalDelayMins: 148,
      trainsAffected: 6,
      trackOutputKm: 1.8,
      freightThroughput: '84%',
      passengerSatisfaction: '74%',
    },
    after: {
      totalDelayMins: 32,
      trainsAffected: 2,
      trackOutputKm: 2.4,
      freightThroughput: '95%',
      passengerSatisfaction: '94%',
    },
    status: 'Ready to Run',
  });

  const formatHoursToTime = (decHours) => {
    const h = Math.floor(decHours);
    const m = Math.round((decHours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleApplyMicroShift = () => {
    setIsApplyingShift(true);
    setTimeout(() => {
      setIsApplyingShift(false);
      setShiftApplied(true);
    }, 600);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const delayCalculated = Math.max(
        12,
        Math.round((durationMins / 60) * 16 - (enableSLW ? 14 : 0) - (divertFreight ? 8 : 0))
      );
      const trainsCount = delayCalculated < 25 ? 1 : delayCalculated < 50 ? 2 : 4;
      const trackKm = ((durationMins / 60) * 0.8).toFixed(1);

      setSimResults({
        before: {
          totalDelayMins: 148,
          trainsAffected: 6,
          trackOutputKm: 1.8,
          freightThroughput: '84%',
          passengerSatisfaction: '74%',
        },
        after: {
          totalDelayMins: delayCalculated,
          trainsAffected: trainsCount,
          trackOutputKm: trackKm,
          freightThroughput: enableSLW ? '96%' : '88%',
          passengerSatisfaction: delayCalculated < 30 ? '96%' : '89%',
        },
        status: 'Simulation Completed Successfully',
      });
      setIsSimulating(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
              Module 06 • STAGE 7
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Dynamic Re-Planner & Closed-Loop Audit</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40">
                Rolling 24/7
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time COA divergence handling: Micro-adjustments (&lt;30 min), active block countdown with overrun alerts, and post-block speed limit audit
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('REPLANNER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'REPLANNER' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>COA Triggers & Re-Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('COUNTDOWN')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'COUNTDOWN' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Active Countdown & Overruns</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'AUDIT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Post-Block Audit Loop</span>
          </button>
        </div>
      </div>

      {/* TAB 1: COA TRIGGERS & MICRO-ADJUSTMENTS */}
      {activeTab === 'REPLANNER' && (
        <div className="space-y-6">
          {/* Live COA Divergence Feed Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>Real-Time Divergence Events from COA & FOIS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DYNAMIC_REPLANNING_DATA.liveTriggers.map((trig) => (
                <div
                  key={trig.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-300">
                      {trig.id} • {trig.triggerType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        trig.severity === 'High'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {trig.severity} Severity
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">
                    {trig.detail}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-bold block mb-0.5">Automated Action:</span>
                    <span>{trig.actionTaken}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 italic">
                    Result: {trig.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Micro-Adjustment Slider Simulator (<30 min rule) */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Micro-Adjustment Rolling Shift (&lt;30 min Rule)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                    Predefined Safety Margins
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shifts possession window dynamically without cancelling joint multi-department work or issuing fresh divisional memos
                </p>
              </div>

              {shiftApplied ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Shift Broadcast to Field Crews (+{microShiftMins}m)</span>
                </span>
              ) : (
                <button
                  onClick={handleApplyMicroShift}
                  disabled={isApplyingShift}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-75"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isApplyingShift ? 'Broadcasting...' : `Apply Dynamic Shift (+${microShiftMins}m)`}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Corridor Window Shift Delta:</span>
                  <span className="text-rose-400 font-mono font-bold text-sm">+{microShiftMins} Minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={microShiftMins}
                  onChange={(e) => {
                    setMicroShiftMins(Number(e.target.value));
                    setShiftApplied(false);
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>+5m (Minor)</span>
                  <span>+15m (Optimal Buffer)</span>
                  <span>+25m (Upper Margin Limit)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">Joint Block Window Adjusted:</div>
                <div className="font-mono font-bold text-yellow-300 text-sm">
                  Original: 10:45 — 13:45 &rarr; Adjusted: 11:{String(microShiftMins).padStart(2, '0')} — 14:{String(microShiftMins).padStart(2, '0')}
                </div>
                <div className="text-[11px] text-emerald-400 pt-1">
                  100% Task Integrity Retained • All 3 Departments (TMS+TDMS+SMMS) notified via mobile app
                </div>
              </div>
            </div>
          </div>

          {/* What-If Replanning Sandbox */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>What-If Tactical Replanning Sandbox</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Interactively test block start times and single-line working to assess projected delays
                </p>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Total Delay Projected:</span>
                <span className="text-xl font-mono font-bold text-rose-400">
                  {simResults.after.totalDelayMins} Mins
                </span>
                <span className="text-[10px] text-slate-500 block">Down from {simResults.before.totalDelayMins} mins</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Trains Affected:</span>
                <span className="text-xl font-mono font-bold text-purple-400">
                  {simResults.after.trainsAffected} Trains
                </span>
                <span className="text-[10px] text-slate-500 block">Down from {simResults.before.trainsAffected} trains</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Track Meters Cleared:</span>
                <span className="text-xl font-mono font-bold text-blue-400">
                  {simResults.after.trackOutputKm} Km
                </span>
                <span className="text-[10px] text-slate-500 block">BCM + Tamping</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Punctuality Score:</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {simResults.after.passengerSatisfaction}
                </span>
                <span className="text-[10px] text-slate-500 block">High passenger satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE BLOCK COUNTDOWNS & OVERRUN ALERT TRACKER */}
      {activeTab === 'COUNTDOWN' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Active Block Countdown & Overrun Alert Tracker</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live telemetry monitoring of active track possessions with automated overrun risk prediction
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                3 Possessions Live
              </span>
            </div>

            <div className="space-y-4">
              {DYNAMIC_REPLANNING_DATA.activeBlockCountdowns.map((blk) => (
                <div
                  key={blk.blockId}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-300 text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {blk.blockId}
                      </span>
                      <span className="font-bold text-white text-sm">{blk.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">Remaining:</span>
                      <span className="text-yellow-300 font-bold bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800/40">
                        {blk.remainingMins} Mins Remaining
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span><strong>Section:</strong> {blk.section}</span>
                    <span><strong>Line:</strong> {blk.line}</span>
                    <span><strong>Allocated Duration:</strong> {blk.allocatedMins} mins</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Possession Progress ({blk.elapsedMins} / {blk.allocatedMins} mins)</span>
                      <span className="text-blue-300 font-bold font-mono">
                        {Math.round((blk.elapsedMins / blk.allocatedMins) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${(blk.elapsedMins / blk.allocatedMins) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Overrun Prediction:</span>
                      <span
                        className={`font-semibold ${
                          blk.overrunRisk.includes('Medium') ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {blk.overrunRisk}
                      </span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      {blk.predictedFinishTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POST-BLOCK AUDIT LOOP */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Closed-Loop Post-Block Audit & AI Feedback Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logs actual downtime vs planned duration, track release speed limits (Permanent/Temporary Speed Restrictions), and machine learning constraint updates
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Audit Active
              </span>
            </div>

            <div className="space-y-4">
              {DYNAMIC_REPLANNING_DATA.postBlockAuditLogs.map((log) => (
                <div
                  key={log.permitId}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        {log.permitId}
                      </span>
                      <span className="font-bold text-white text-sm">{log.department}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Executed: {log.date} • {log.section}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Planned vs Actual</span>
                      <span className="font-mono font-bold text-white">
                        {log.plannedDurationMins}m / {log.actualDurationMins}m
                      </span>
                      <span className={`text-[10px] block font-mono ${log.varianceMins <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {log.varianceMins <= 0 ? `${log.varianceMins}m (Ahead)` : `+${log.varianceMins}m (Overrun)`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Output Achieved</span>
                      <span className="font-mono font-bold text-blue-300">
                        {log.metersAchieved}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Target: {log.targetMeters}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Productivity</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {log.productivityRate}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Efficiency Score</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Track Release Speed</span>
                      <span className="font-bold text-amber-300 truncate block">
                        {log.trackReleaseSpeed}
                      </span>
                      <span className="text-[10px] text-slate-500 block">TSR / Caution Order</span>
                    </div>
                  </div>

                  {/* AI Learning Feedback */}
                  <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                    <span><strong>AI Model Optimization Feedback:</strong> {log.aiFeedbackNote}</span>
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
