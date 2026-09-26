import React, { useState } from 'react';
import {
  TrainTrack,
  Train,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { TIMETABLE_TRAINS } from '../../data/railwayData';

export default function TrainImpactModule({ onNavigate }) {
  // Local state for interactive mitigation decisions
  const [trainsState, setTrainsState] = useState(
    TIMETABLE_TRAINS.map((t) => ({
      ...t,
      selectedAction: t.trainNo === '12951' ? 'REROUTE_LOOP' : t.trainNo === '12137' ? 'HOLD_JUNCTION' : 'SPEED_RECOVER',
      mitigatedDelay: t.trainNo === '22222' ? 0 : t.trainNo === '12951' ? 4 : t.trainNo === '12137' ? 12 : 5,
    }))
  );

  const handleActionChange = (trainNo, action) => {
    setTrainsState((prev) =>
      prev.map((t) => {
        if (t.trainNo !== trainNo) return t;
        let newDelay = t.expectedDelayMins;
        if (action === 'REROUTE_LOOP') newDelay = Math.max(3, Math.round(t.expectedDelayMins * 0.2));
        if (action === 'HOLD_JUNCTION') newDelay = Math.max(8, Math.round(t.expectedDelayMins * 0.45));
        if (action === 'SPEED_RECOVER') newDelay = Math.max(0, Math.round(t.expectedDelayMins * 0.25));
        if (action === 'NORMAL_WAIT') newDelay = t.expectedDelayMins;
        return { ...t, selectedAction: action, mitigatedDelay: newDelay };
      })
    );
  };

  const totalRawDelay = trainsState.reduce((acc, t) => acc + t.expectedDelayMins, 0);
  const totalMitigatedDelay = trainsState.reduce((acc, t) => acc + t.mitigatedDelay, 0);
  const totalDelaySaved = totalRawDelay - totalMitigatedDelay;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 05
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Train Impact & Regulation Assessment</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze affected passenger & freight trains during maintenance blocks, evaluate expected delay, and execute reroute/hold mitigation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('conflicts')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Check Conflict Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Metric Cards for Train Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Unmitigated Delay</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {totalRawDelay} Mins
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            If blocks proceeded without AI rerouting
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">With AI Mitigation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {totalMitigatedDelay} Mins
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1">
            Averted {totalDelaySaved} mins (-{Math.round((totalDelaySaved / totalRawDelay) * 100)}%)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Punctuality Score</span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            98.2%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Indian Railways Punctuality Target (&gt;95%)
          </p>
        </div>
      </div>

      {/* Affected Trains Table & Mitigation Options */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrainTrack className="w-4 h-4 text-blue-400" />
            <span>Affected Train Services & Mitigation Dispatch Plan</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {trainsState.length} Coaching Services Monitored
          </span>
        </div>

        <div className="space-y-3">
          {trainsState.map((train) => (
            <div
              key={train.trainNo}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Train Info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {train.trainNo}
                    </span>
                    <span className="text-sm font-bold text-white">{train.name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                      {train.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        train.priority.includes('P1')
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {train.priority}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span><strong>Route:</strong> {train.origin} → {train.dest}</span>
                    <span><strong>Block Infringement:</strong> {train.infringementWindow}</span>
                    <span><strong>Passengers on Board:</strong> ~{train.passengers}</span>
                  </div>
                </div>

                {/* Delay Comparison */}
                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">RAW DELAY</span>
                    <span className="text-red-400 font-bold text-sm">+{train.expectedDelayMins}m</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="text-center p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                    <span className="text-emerald-400 block text-[10px]">MITIGATED</span>
                    <span className="text-emerald-300 font-bold text-sm">+{train.mitigatedDelay}m</span>
                  </div>
                </div>

                {/* Interactive Mitigation Options */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                  <span className="text-xs text-slate-400 w-full lg:w-auto font-medium">
                    Mitigation Action:
                  </span>
                  
                  <button
                    onClick={() => handleActionChange(train.trainNo, 'REROUTE_LOOP')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      train.selectedAction === 'REROUTE_LOOP'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Reroute via Loop
                  </button>

                  <button
                    onClick={() => handleActionChange(train.trainNo, 'HOLD_JUNCTION')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      train.selectedAction === 'HOLD_JUNCTION'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Regulate / Hold
                  </button>

                  <button
                    onClick={() => handleActionChange(train.trainNo, 'SPEED_RECOVER')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      train.selectedAction === 'SPEED_RECOVER'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Margin Recovery
                  </button>
                </div>
              </div>

              {/* Action Description */}
              <div className="mt-2.5 pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate">
                  <strong>AI Strategy:</strong> {train.mitigationStrategy}
                </span>
                <span className="text-emerald-400 shrink-0 font-medium ml-2">
                  ✓ Dispatch Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
