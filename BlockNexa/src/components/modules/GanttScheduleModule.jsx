import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Filter,
  ZoomIn,
  ZoomOut,
  Train,
  Wrench,
  Zap,
  Radio,
  Sparkles,
  Info,
  ChevronRight,
  Layers,
  ShieldCheck,
  CheckCircle2,
  X,
  Calendar,
  TrendingUp,
  BarChart3,
  HardHat,
  Package,
} from 'lucide-react';
import {
  ACTIVE_BLOCKS_TODAY,
  TIMETABLE_TRAINS,
  AI_OPTIMIZED_PLAN_RESULT,
  PLANNING_HORIZONS_DATA,
} from '../../data/railwayData';

export default function GanttScheduleModule({ onNavigate }) {
  const [timeView, setTimeView] = useState('Daily'); // 'Daily' | 'Weekly' | 'Monthly'
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('ALL'); // ALL, DN, UP, 3RD
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Time scale for Daily view: 06:00 to 22:00 (16 hours)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

  const timeToPercent = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const startHour = 6;
    const totalHours = 16;
    const val = (h - startHour) + m / 60;
    return Math.max(0, Math.min(100, (val / totalHours) * 100));
  };

  // Corridors on Y-Axis
  const corridors = [
    {
      id: 'DN-MAIN',
      name: 'Down Main Line (MMR — CSN — JL)',
      type: 'DN',
      speedLimit: '130 km/h',
      blocks: [
        {
          id: 'BLK-OPT-01',
          name: 'Joint Mega Block: TMS + TDMS + SMMS',
          dept: 'Joint (P-Way + OHE + Sig)',
          color: 'bg-blue-600/90 text-white border-blue-400 shadow-sm',
          typeBadge: 'AI-Selected Joint Window',
          start: '10:45',
          end: '13:45',
          duration: '3h 00m',
          section: 'MMR — CSN Km 284/10 to 286/10',
          speedRestriction: 'SR 30 km/h for 48h',
          gang: 'Combined Divisional Gang (38 Staff)',
          machinery: 'BCM + Tamping CSM-952 + Tower Wagon TW-08',
          trainsAffected: ['12951 Rajdhani (Diverted Loop)', 'FRT-CNTR (Regulated 45m)'],
          isAiOptimized: true,
        },
        {
          id: 'BLK-LIVE-090',
          name: 'OHE Contact Wire Tensioning',
          dept: 'Traction / TDMS',
          color: 'bg-cyan-600/80 text-white border-cyan-400 shadow-cyan-950/50',
          typeBadge: 'OHE Block',
          start: '08:15',
          end: '10:45',
          duration: '2h 30m',
          section: 'PC — JL Km 372/12',
          speedRestriction: 'Power Isolation Active',
          gang: 'TRD Breakdown Crew (12 Staff)',
          machinery: 'Tower Wagon TW-CR-08',
          trainsAffected: ['Goods rakes diverted'],
          isAiOptimized: false,
        },
      ],
      trainPaths: [
        {
          trainNo: '22222',
          name: 'Vande Bharat Exp',
          entryTime: '10:15',
          exitTime: '10:40',
          color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
        },
        {
          trainNo: '12951',
          name: 'Mumbai Rajdhani',
          entryTime: '11:20',
          exitTime: '11:45',
          color: 'border-yellow-400 bg-yellow-500/20 text-yellow-300',
        },
        {
          trainNo: '12137',
          name: 'Punjab Mail',
          entryTime: '12:30',
          exitTime: '13:00',
          color: 'border-blue-400 bg-blue-500/20 text-blue-300',
        },
        {
          trainNo: '12261',
          name: 'Duronto Exp',
          entryTime: '13:20',
          exitTime: '13:48',
          color: 'border-sky-400 bg-sky-500/20 text-sky-300',
        },
      ],
    },
    {
      id: 'UP-MAIN',
      name: 'Up Main Line (BSL — CSN — MMR — IGP)',
      type: 'UP',
      speedLimit: '130 km/h',
      blocks: [
        {
          id: 'BLK-LIVE-089',
          name: 'Track Relaying & Tamping',
          dept: 'Engineering / TMS',
          color: 'bg-amber-600/80 text-white border-amber-400 shadow-amber-950/50',
          typeBadge: 'P-Way Block',
          start: '07:30',
          end: '10:30',
          duration: '3h 00m',
          section: 'DVL — NK Km 182/04',
          speedRestriction: 'SR 30 km/h Caution Order',
          gang: 'SSE/P-Way Gang (18 Men)',
          machinery: 'Duomatic Tamping Machine 8140',
          trainsAffected: ['Up Freight rakes regulated'],
          isAiOptimized: false,
        },
        {
          id: 'BLK-OPT-02',
          name: 'Emergency Neutral Section PTFE Insulator',
          dept: 'Traction / TDMS',
          color: 'bg-red-600/80 text-white border-red-400 shadow-red-950/50',
          typeBadge: 'Emergency Safety Bypass',
          start: '14:15',
          end: '16:00',
          duration: '1h 45m',
          section: 'NK — MMR Km 210/14',
          speedRestriction: 'Power Cut • Coasting 60 km/h',
          gang: 'Emergency Breakdown Gang (10 Men)',
          machinery: 'Inspection OHE Car',
          trainsAffected: ['FRT-COAL held at Lasalgaon Loop'],
          isAiOptimized: true,
        },
      ],
      trainPaths: [
        {
          trainNo: '12859',
          name: 'Gitanjali Exp',
          entryTime: '11:15',
          exitTime: '11:45',
          color: 'border-blue-400 bg-blue-500/20 text-blue-300',
        },
        {
          trainNo: '11057',
          name: 'Amritsar Exp',
          entryTime: '14:10',
          exitTime: '14:40',
          color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300',
        },
      ],
    },
    {
      id: '3RD-LINE',
      name: '3rd Corridor / Goods By-pass (JL — BSL)',
      type: '3RD',
      speedLimit: '100 km/h',
      blocks: [
        {
          id: 'BLK-OPT-03',
          name: 'Digital Axle Counter Diagnostic',
          dept: 'S&T / SMMS',
          color: 'bg-emerald-600/80 text-white border-emerald-400 shadow-emerald-950/50',
          typeBadge: 'Signal Window',
          start: '14:30',
          end: '15:45',
          duration: '1h 15m',
          section: 'JL — BSL Km 398/02',
          speedRestriction: 'Calling-on signal ready',
          gang: 'Telecom Gang (4 Techs)',
          machinery: 'DAC Frequency Analyzer',
          trainsAffected: ['No Passenger trains impacted'],
          isAiOptimized: true,
        },
      ],
      trainPaths: [
        {
          trainNo: 'FRT-BCNE',
          name: 'FCI Grain Spl',
          entryTime: '13:20',
          exitTime: '14:10',
          color: 'border-amber-400 bg-amber-500/20 text-amber-300',
        },
      ],
    },
  ];

  const filteredCorridors = corridors.filter(
    (c) => selectedTrackFilter === 'ALL' || c.type === selectedTrackFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 04 • MASTER SCHEDULE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Master Block Schedule</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
                3 Planning Horizons
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Seamless multi-tier view: 30-Day Monthly Strategic Calendar, 7-Day Weekly Tactical Schedule, and Daily Controller Execution Gantt
          </p>
        </div>

        {/* 3 Time Horizons Selector Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeView('Daily')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              timeView === 'Daily' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Execution (Gantt)</span>
          </button>
          <button
            onClick={() => setTimeView('Weekly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              timeView === 'Weekly' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Tactical (7 Days)</span>
          </button>
          <button
            onClick={() => setTimeView('Monthly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              timeView === 'Monthly' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly Strategic (30 Days)</span>
          </button>
        </div>
      </div>

      {/* HORIZON 1: DAILY EXECUTION GANTT */}
      {timeView === 'Daily' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter Track:</span>
              {['ALL', 'DN', 'UP', '3RD'].map((track) => (
                <button
                  key={track}
                  onClick={() => setSelectedTrackFilter(track)}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition ${
                    selectedTrackFilter === track
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {track === 'ALL' ? 'All Tracks' : `${track} Line`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Joint Mega Block
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> P-Way
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> OHE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> S&T
              </span>
            </div>
          </div>

          {/* Interactive Gantt Canvas */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Minute-by-Minute Controller Execution Gantt</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Live Headway Margin: 18 mins
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Timeline scale: 06:00 to 22:00 IST • Slanted badges = Coaching & Freight paths • Solid cards = Block Possessions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('impact')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Train Impact Table
                </button>
              </div>
            </div>

            {/* Time Header Scale */}
            <div className="overflow-x-auto">
              <div className="min-w-[840px]">
                <div className="flex items-center mb-2 pl-24 pr-4">
                  <div className="grid grid-cols-16 w-full text-center text-[10px] font-mono font-bold text-slate-400 border-b border-slate-800 pb-1">
                    {hours.slice(0, 16).map((h) => (
                      <div key={h}>{String(h).padStart(2, '0')}:00</div>
                    ))}
                  </div>
                </div>

                {/* Corridor Timeline Lanes */}
                <div className="space-y-4">
                  {filteredCorridors.map((corridor) => (
                    <div key={corridor.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{corridor.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {corridor.speedLimit}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {corridor.blocks.length} Blocks • {corridor.trainPaths.length} Trains
                        </span>
                      </div>

                      {/* Track Timeline Lane */}
                      <div className="relative h-20 bg-slate-950/80 rounded-xl border border-slate-800/90 overflow-hidden">
                        {/* Vertical hour grid lines */}
                        <div className="absolute inset-0 grid grid-cols-16 pointer-events-none">
                          {hours.slice(0, 16).map((h) => (
                            <div key={h} className="border-r border-slate-900/80 last:border-r-0 h-full" />
                          ))}
                        </div>

                        {/* Render Train Paths */}
                        {corridor.trainPaths.map((tp, idx) => {
                          const startP = timeToPercent(tp.entryTime);
                          const endP = timeToPercent(tp.exitTime);
                          const widthP = Math.max(3.5, endP - startP);
                          return (
                            <div
                              key={idx}
                              className={`absolute top-1.5 h-6 rounded-md border text-[10px] font-mono flex items-center px-1.5 z-10 truncate cursor-pointer transition hover:scale-105 shadow-sm ${tp.color}`}
                              style={{
                                left: `${startP}%`,
                                width: `${widthP}%`,
                              }}
                              title={`Train ${tp.trainNo} - ${tp.name} (${tp.entryTime} to ${tp.exitTime})`}
                            >
                              <Train className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{tp.trainNo}</span>
                            </div>
                          );
                        })}

                        {/* Render Maintenance Blocks */}
                        {corridor.blocks.map((block) => {
                          const startP = timeToPercent(block.start);
                          const endP = timeToPercent(block.end);
                          const widthP = Math.max(8, endP - startP);

                          return (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlock(block)}
                              className={`absolute bottom-1.5 h-10 rounded-lg border-2 p-1.5 z-10 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-lg ${block.color}`}
                              style={{
                                left: `${startP}%`,
                                width: `${widthP}%`,
                              }}
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold leading-none">
                                <span className="truncate pr-1 flex items-center gap-1">
                                  {block.isAiOptimized && (
                                    <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                                  )}
                                  {block.name}
                                </span>
                                <span className="font-mono text-[9px] bg-black/40 px-1 py-0.5 rounded shrink-0">
                                  {block.start} - {block.end}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[9px] opacity-90">
                                <span className="truncate">{block.typeBadge}</span>
                                <span className="font-mono font-semibold">{block.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HORIZON 2: WEEKLY TACTICAL DIVISIONAL SCHEDULE */}
      {timeView === 'Weekly' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Weekly Tactical Schedule (7-Day Rolling Horizon)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overdue work queues, equipment/crew rosters, 7-day freight flow projections, and inter-departmental work bundling
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                Divisional Circular Ready
              </span>
            </div>

            {/* 4 Weekly KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Overdue Queue Items</span>
                <span className="text-xl font-bold font-mono text-amber-400">{PLANNING_HORIZONS_DATA.weeklyTactical.metrics.overdueQueueItems}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Bundled Joint Blocks</span>
                <span className="text-xl font-bold font-mono text-blue-400">{PLANNING_HORIZONS_DATA.weeklyTactical.metrics.bundledBlocksScheduled} Windows</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Passenger Cancellations</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{PLANNING_HORIZONS_DATA.weeklyTactical.metrics.passengerCancellations} (Zero)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Freight Paths Protected</span>
                <span className="text-xl font-bold font-mono text-blue-400">{PLANNING_HORIZONS_DATA.weeklyTactical.metrics.freightPathsProtected} Rakes</span>
              </div>
            </div>

            {/* 7-Day Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                7-Day Rolling Divisional Schedule
              </h4>
              <div className="space-y-2">
                {PLANNING_HORIZONS_DATA.weeklyTactical.weeklySchedule.map((dayPlan, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white text-sm w-28 shrink-0">
                        {dayPlan.day}
                      </span>
                      <span className="text-slate-400">{dayPlan.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Blocks Planned</span>
                        <span className="text-slate-200 font-bold">{dayPlan.blocksCount} Windows</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Corridor Possession</span>
                        <span className="text-blue-300 font-mono font-bold">{dayPlan.trackHours}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Bundling Rate</span>
                        <span className="text-emerald-400 font-mono font-bold">{dayPlan.bundlingRate}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                          dayPlan.status === 'Active Execution'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {dayPlan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HORIZON 3: MONTHLY STRATEGIC CALENDAR */}
      {timeView === 'Monthly' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Monthly Strategic Block Horizon (30 Days)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Corridor capacity reservation, mega-block requests, long-distance train timetables, and departmental quota allocations
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                HQ Operations Sanctioned
              </span>
            </div>

            {/* Monthly Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Allocated Quota Hours</span>
                <span className="text-xl font-bold font-mono text-indigo-400">{PLANNING_HORIZONS_DATA.monthlyStrategic.metrics.allocatedQuotaHours}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Utilized Quota</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{PLANNING_HORIZONS_DATA.monthlyStrategic.metrics.utilizedQuotaHours}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Capacity Retained</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{PLANNING_HORIZONS_DATA.monthlyStrategic.metrics.corridorCapacityRetained}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Major Mega-Blocks</span>
                <span className="text-xl font-bold font-mono text-blue-400">{PLANNING_HORIZONS_DATA.monthlyStrategic.metrics.majorMegaBlocksPlanned} Planned</span>
              </div>
            </div>

            {/* Mega Blocks Schedule */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Planned Monthly Mega-Block Windows (TRT, BCM, Rockfall Mitigation)
              </h4>
              <div className="space-y-2">
                {PLANNING_HORIZONS_DATA.monthlyStrategic.calendarEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-300">{entry.date}</span>
                        <span className="font-bold text-white">{entry.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Section: {entry.section}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-yellow-300 font-bold">{entry.duration}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Block Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
                  <Layers className="w-4 h-4 text-blue-300" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedBlock.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedBlock.id} • {selectedBlock.typeBadge}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Scheduled Slot</span>
                <span className="font-mono font-bold text-white text-sm">
                  {selectedBlock.start} — {selectedBlock.end}
                </span>
                <span className="text-[10px] text-blue-400 block">({selectedBlock.duration})</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Speed Restriction</span>
                <span className="font-bold text-amber-300 text-sm">
                  {selectedBlock.speedRestriction}
                </span>
                <span className="text-[10px] text-slate-500 block">Divisional Caution Order</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Corridor Boundary</span>
                <span className="text-white font-semibold">{selectedBlock.section}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Gangs & Machinery</span>
                <div className="text-slate-200">{selectedBlock.machinery}</div>
                <div className="text-slate-400 text-[11px]">{selectedBlock.gang}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-blue-300 font-semibold block mb-1">
                  Train Regulation Plan
                </span>
                <div className="space-y-1 text-slate-300">
                  {selectedBlock.trainsAffected.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-yellow-400">•</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedBlock(null);
                  onNavigate('impact');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Train Impact Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedBlock(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
