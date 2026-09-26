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
} from 'lucide-react';
import {
  ACTIVE_BLOCKS_TODAY,
  TIMETABLE_TRAINS,
  AI_OPTIMIZED_PLAN_RESULT,
} from '../../data/railwayData';

export default function GanttScheduleModule({ onNavigate }) {
  const [timeView, setTimeView] = useState('Daily'); // Daily, Weekly, Monthly
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('ALL'); // ALL, DN, UP, 3RD
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 0.8, 1, 1.2

  // Time scale for Daily view: 06:00 to 22:00 (16 hours)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

  // Convert "HH:MM" to percentage position from 06:00 to 22:00
  const timeToPercent = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const startHour = 6;
    const totalHours = 16;
    const val = (h - startHour) + m / 60;
    return Math.max(0, Math.min(100, (val / totalHours) * 100));
  };

  // Sections / Corridors on Y-Axis
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
          color: 'bg-purple-600/90 text-white border-purple-400 glow-purple',
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
          color: 'bg-cyan-600/80 text-white border-cyan-400 glow-cyan',
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
          color: 'border-purple-400 bg-purple-500/20 text-purple-300',
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
          color: 'bg-amber-600/80 text-white border-amber-400 glow-amber',
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
          color: 'bg-cyan-600/90 text-white border-cyan-400 glow-cyan',
          typeBadge: 'AI-Selected OHE Window',
          start: '14:15',
          end: '16:00',
          duration: '1h 45m',
          section: 'NK — MMR Km 210/14',
          speedRestriction: 'Dead Section • Coasting 60 km/h',
          gang: 'Emergency TRD Gang (10 Staff)',
          machinery: 'OHE Inspection Car',
          trainsAffected: ['FRT-COAL-9943 held at loop'],
          isAiOptimized: true,
        },
      ],
      trainPaths: [
        {
          trainNo: 'FRT-COAL',
          name: 'NTPC Coal Rake',
          entryTime: '11:30',
          exitTime: '12:15',
          color: 'border-slate-400 bg-slate-500/20 text-slate-300',
        },
        {
          trainNo: '11057',
          name: 'Amritsar Express',
          entryTime: '14:10',
          exitTime: '14:40',
          color: 'border-blue-400 bg-blue-500/20 text-blue-300',
        },
      ],
    },
    {
      id: 'LOOP-CSN',
      name: 'Chalisgaon Bi-directional Middle Loop 3',
      type: 'DN',
      speedLimit: '50 km/h (Turnout)',
      blocks: [
        {
          id: 'BLK-SMMS-104',
          name: 'Point Machine 104A Throw & Interlocking Test',
          dept: 'S&T / SMMS',
          color: 'bg-emerald-600/80 text-white border-emerald-400 glow-emerald',
          typeBadge: 'S&T Block',
          start: '11:00',
          end: '12:30',
          duration: '1h 30m',
          section: 'CSN Yard Point 104A/B',
          speedRestriction: 'Calling-on signal operation',
          gang: 'SSE/Sig + 4 Techs',
          machinery: 'Digital Point Test Kit',
          trainsAffected: ['Integrated into Joint Block #01'],
          isAiOptimized: true,
        },
      ],
      trainPaths: [
        {
          trainNo: '12951-DIV',
          name: 'Rajdhani (Diverted Path)',
          entryTime: '11:30',
          exitTime: '11:42',
          color: 'border-yellow-400 bg-yellow-500/30 text-yellow-200',
        },
      ],
    },
    {
      id: '3RD-LINE',
      name: '3rd Dedicated Goods Corridor (JL — BSL)',
      type: '3RD',
      speedLimit: '100 km/h',
      blocks: [
        {
          id: 'BLK-SMMS-211',
          name: 'Dual SSDAC Axle Counter Calibration',
          dept: 'S&T / SMMS',
          color: 'bg-emerald-600/80 text-white border-emerald-400 glow-emerald',
          typeBadge: 'S&T Routine',
          start: '14:30',
          end: '15:45',
          duration: '1h 15m',
          section: 'JL — BSL Km 398/02',
          speedRestriction: 'Automatic block permissive working',
          gang: 'Telecom Gang (4 Techs)',
          machinery: 'DAC Frequency Analyzer',
          trainsAffected: ['Zero Coaching trains affected'],
          isAiOptimized: false,
        },
      ],
      trainPaths: [
        {
          trainNo: 'FRT-CNTR',
          name: 'CONCOR Freight',
          entryTime: '10:45',
          exitTime: '11:45',
          color: 'border-slate-400 bg-slate-500/20 text-slate-300',
        },
        {
          trainNo: 'FRT-BCNE',
          name: 'Foodgrains Special',
          entryTime: '13:20',
          exitTime: '14:15',
          color: 'border-slate-400 bg-slate-500/20 text-slate-300',
        },
      ],
    },
  ];

  const filteredCorridors = corridors.filter((c) => {
    if (selectedTrackFilter === 'ALL') return true;
    return c.type === selectedTrackFilter;
  });

  return (
    <div className="space-y-6">
      {/* Module Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 04
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Interactive Time-Space Gantt Schedule</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing train paths, engineering blocks, OHE power blocks, S&T possessions, and AI-selected optimal windows
          </p>
        </div>

        {/* View Switchers & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Daily / Weekly / Monthly View Toggle */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            {['Daily', 'Weekly', 'Monthly'].map((view) => (
              <button
                key={view}
                onClick={() => setTimeView(view)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                  timeView === view
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view} View
              </button>
            ))}
          </div>

          {/* Line Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2">Track:</span>
            {['ALL', 'DN', 'UP', '3RD'].map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrackFilter(track)}
                className={`px-2 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  selectedTrackFilter === track
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Zoom buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Legend:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-amber-300" />
            <span className="text-slate-300 font-medium">Engineering (TMS)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500 border border-cyan-300" />
            <span className="text-slate-300 font-medium">OHE / Traction (TDMS)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-300" />
            <span className="text-slate-300 font-medium">S&T / Signal (SMMS)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-600 border border-purple-300 animate-pulse" />
            <span className="text-purple-300 font-bold">AI-Selected Block Window</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-yellow-400" />
            <span className="text-slate-300">Train Path Trajectory</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Timeline Span: 06:00 — 22:00 IST</span>
        </div>
      </div>

      {/* Main Gantt Canvas */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-4 overflow-x-auto shadow-2xl">
        <div
          className="min-w-[950px] space-y-4"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* Time Header Scale */}
          <div className="grid grid-cols-16 border-b border-slate-800 pb-2 text-center text-xs font-mono text-slate-400">
            {hours.slice(0, 16).map((h) => (
              <div key={h} className="border-r border-slate-800/60 last:border-r-0 py-1">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Current Live Time Indicator (e.g. at ~10:00 IST) */}
          <div className="relative">
            <div
              className="absolute top-0 bottom-0 z-20 w-0.5 bg-red-500 pointer-events-none"
              style={{ left: `${timeToPercent('10:00')}%` }}
            >
              <div className="absolute -top-6 -left-8 bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                10:00 IST NOW
              </div>
            </div>
          </div>

          {/* Corridors / Sections Rows */}
          <div className="space-y-6 pt-2">
            {filteredCorridors.map((corridor) => (
              <div key={corridor.id} className="space-y-2">
                {/* Corridor Title Row */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">{corridor.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Permissible Speed: {corridor.speedLimit}
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

                  {/* Render Train Paths (Slanted / Slotted) */}
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

      {/* Selected Block Telemetry Detail Modal / Drawer */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-purple-950 text-purple-300 border border-purple-800">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
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
                <span className="text-[10px] text-purple-400 block">({selectedBlock.duration})</span>
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

              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-900/60">
                <span className="text-purple-300 font-semibold block mb-1">
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
