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
} from 'lucide-react';

export default function SimulationReplanningModule({ onNavigate }) {
  const [selectedBlockId, setSelectedBlockId] = useState('BLK-OPT-01');
  const [blockStartTime, setBlockStartTime] = useState(10.75); // 10:45 = 10.75
  const [durationMins, setDurationMins] = useState(180); // 3h = 180 mins
  const [enableSLW, setEnableSLW] = useState(true); // Single line working
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

  const handleRunSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // Calculate realistic dynamic outputs based on inputs
      const delayCalculated = Math.max(12, Math.round((durationMins / 60) * 16 - (enableSLW ? 14 : 0) - (divertFreight ? 8 : 0)));
      const trainsCount = delayCalculated < 25 ? 1 : delayCalculated < 50 ? 2 : 4;
      const trackKm = (durationMins / 60 * 0.8).toFixed(1);

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
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 08
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Simulation & What-If Replanning Sandbox</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactively adjust block start time, duration, and traffic diversion strategies to compare train delay impact before and after
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('safety')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <span>Proceed to Safety Approval Gate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Simulation Parameters</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Corridor Sandbox
            </span>
          </div>

          {/* Block Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Maintenance Block
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="BLK-OPT-01">Joint Mega Block: MMR — CSN Down Line (3h 00m)</option>
              <option value="BLK-OPT-02">Emergency Neutral Section: NK — MMR Up Line (1h 45m)</option>
              <option value="BLK-LIVE-089">Deep Screening Track Relaying: DVL — NK (3h 00m)</option>
            </select>
          </div>

          {/* Start Time Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Proposed Block Start Time</span>
              <span className="font-mono font-bold text-purple-400 text-sm bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                {formatHoursToTime(blockStartTime)} IST
              </span>
            </div>
            <input
              type="range"
              min="8.0"
              max="16.0"
              step="0.25"
              value={blockStartTime}
              onChange={(e) => setBlockStartTime(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>08:00</span>
              <span>10:45 (Optimal)</span>
              <span>16:00</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Proposed Block Duration</span>
              <span className="font-mono font-bold text-blue-400 text-sm bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {Math.floor(durationMins / 60)}h {durationMins % 60}m ({durationMins} mins)
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="270"
              step="15"
              value={durationMins}
              onChange={(e) => setDurationMins(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>90m (Minimal)</span>
              <span>180m (Standard)</span>
              <span>270m (Extended)</span>
            </div>
          </div>

          {/* Traffic Management Options */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block">
              Operational Traffic Options
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableSLW}
                onChange={(e) => setEnableSLW(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600"
              />
              <span>Enable Single Line Working (SLW) on Adjacent Up Line</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={divertFreight}
                onChange={(e) => setDivertFreight(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600"
              />
              <span>Regulate Freight Rakes at Lasalgaon Loop Line</span>
            </label>
          </div>

          {/* Execute Simulation Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-950 transition cursor-pointer disabled:opacity-75"
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating Traffic Flow & Knock-on Delays...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run What-If Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Side-by-Side Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Comparison Header */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Simulation Impact Analysis (Before vs After)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison between baseline manual scheduling and simulated AI scenario
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                {simResults.status}
              </span>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* BEFORE CARD */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-red-300 uppercase tracking-wider">
                  <span>Baseline (Uncoordinated)</span>
                  <span className="text-[10px] bg-red-900/60 px-2 py-0.5 rounded text-red-200">
                    BEFORE
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Total Train Delay:</span>
                    <span className="font-mono font-bold text-red-400 text-sm">
                      +{simResults.before.totalDelayMins} Mins
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Affected Coaching Trains:</span>
                    <span className="font-mono font-bold text-red-400">
                      {simResults.before.trainsAffected} Trains
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">P-Way Output:</span>
                    <span className="font-mono text-slate-300">
                      {simResults.before.trackOutputKm} Km
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Freight Throughput:</span>
                    <span className="font-mono text-slate-300">
                      {simResults.before.freightThroughput}
                    </span>
                  </div>
                </div>
              </div>

              {/* AFTER CARD */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <span>Simulated Scenario</span>
                  <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
                    AFTER AI
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Total Train Delay:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +{simResults.after.totalDelayMins} Mins
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Affected Coaching Trains:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {simResults.after.trainsAffected} Trains
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">P-Way Output:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {simResults.after.trackOutputKm} Km (+33%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/80">
                    <span className="text-slate-400">Freight Throughput:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {simResults.after.freightThroughput}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-bold text-white">
                    Net Delay Reduction: -{simResults.before.totalDelayMins - simResults.after.totalDelayMins} Minutes
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Simulated slotting avoids primary collision with 22222 Vande Bharat Express
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('safety')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition"
              >
                Accept & Commit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
