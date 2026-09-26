import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  Zap,
  Train,
  CheckCircle2,
  ShieldAlert,
  Search,
  ZoomIn,
  ZoomOut,
  Info,
  ChevronRight,
  Sparkles,
  Cpu,
  Wrench,
  Radio,
  Sliders,
  Filter,
} from 'lucide-react';
import {
  SPATIAL_INFRASTRUCTURE_DATA,
  INITIAL_MAINTENANCE_REQUESTS,
  ASSET_INTELLIGENCE_METRICS,
} from '../../data/railwayData';

export default function RailwayMapModule({ onNavigate }) {
  const [selectedStation, setSelectedStation] = useState(SPATIAL_INFRASTRUCTURE_DATA.stations[3]); // Manmad Jn
  const [selectedCluster, setSelectedCluster] = useState(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[0]);
  const [selectedAsset, setSelectedAsset] = useState(ASSET_INTELLIGENCE_METRICS.highFailureRiskAssets[0]);
  const [activeLayer, setActiveLayer] = useState('ALL'); // ALL, TRACK, OHE, SIGNAL, CLUSTERS
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  // Total corridor span: Km 137 to Km 444 (307 km span)
  const minKm = 130;
  const maxKm = 450;
  const kmToPercent = (km) => {
    return Math.max(2, Math.min(98, ((km - minKm) / (maxKm - minKm)) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 01 • GIS & SPATIAL LAYER
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Railway Map & Infrastructure Layer</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-600/30 text-cyan-300 border border-cyan-500/40">
                Linear Referencing System
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time asset status overlay (Track, Point, OHE), kilometric chainage, electrical isolation limits, and spatial maintenance clusters
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeLayer === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('TRACK')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeLayer === 'TRACK' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              P-Way (Track)
            </button>
            <button
              onClick={() => setActiveLayer('OHE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeLayer === 'OHE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TRD (OHE)
            </button>
            <button
              onClick={() => setActiveLayer('SIGNAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeLayer === 'SIGNAL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              S&T (Signals)
            </button>
            <button
              onClick={() => setActiveLayer('CLUSTERS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeLayer === 'CLUSTERS' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Spatial Clusters
            </button>
          </div>
        </div>
      </div>

      {/* Linear Referencing Synchronization Tuple Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Unified Linear Referencing Syntax:</span>
          <code className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">
            Asset Location = (Division: BSL, Line Code, Chainage km Start, Chainage km End)
          </code>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Corridor Span: <strong>Km 137.0 (IGP) — Km 444.0 (BSL)</strong></span>
          <span className="text-emerald-400 font-semibold">• 428.6 Route Km Synchronized</span>
        </div>
      </div>

      {/* Interactive Linear Corridor Schematic Map */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Bhusawal Mainline Linear Track Schematic</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                1:1 Dynamic GIS Linear View
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any station, track line, or spatial cluster badge to inspect asset telemetry and electrical isolation limits
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Down Main
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Up Main
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> 3rd Corridor
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Loop Line
            </span>
          </div>
        </div>

        {/* The Linear Schematic Canvas */}
        <div className="relative pt-8 pb-12 overflow-x-auto min-w-[760px]">
          {/* Kilometric Ruler on Top */}
          <div className="relative w-full h-8 border-b border-slate-700/80 mb-6">
            {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => {
              const pos = kmToPercent(stn.chainageKm);
              return (
                <div
                  key={stn.code}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                  style={{ left: `${pos}%` }}
                  onClick={() => setSelectedStation(stn)}
                >
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-300 transition">
                    Km {stn.chainageKm}
                  </span>
                  <div className="w-0.5 h-3 bg-slate-600 group-hover:bg-blue-400" />
                </div>
              );
            })}
          </div>

          {/* 4 Tracks Horizontal Lines */}
          <div className="space-y-6 relative">
            {/* Track 1: Down Main Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-blue-400">
                DN MAIN
              </div>
              <div className="relative-1 flex-1 h-3 bg-blue-950/80 border-y border-blue-600/60 rounded">
                {/* Station nodes */}
                {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => setSelectedStation(stn)}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-400 hover:border-yellow-400 hover:scale-125 transition cursor-pointer shadow-md"
                    style={{ left: `${kmToPercent(stn.chainageKm)}%` }}
                    title={`${stn.name} (${stn.code}) - Km ${stn.chainageKm}`}
                  />
                ))}

                {/* Spatial Cluster 1 Overlay (Km 284.2 to 286.0) */}
                {(activeLayer === 'ALL' || activeLayer === 'CLUSTERS' || activeLayer === 'TRACK') && (
                  <div
                    onClick={() => setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[0])}
                    className="absolute -top-3.5 h-10 rounded-lg bg-purple-600/30 border-2 border-purple-400 hover:bg-purple-600/50 transition cursor-pointer shadow-lg flex items-center justify-center px-2 text-[10px] font-bold text-white"
                    style={{
                      left: `${kmToPercent(284.2)}%`,
                      width: `${Math.max(4, kmToPercent(286.0) - kmToPercent(284.2) + 6)}%`,
                    }}
                    title="Joint Maintenance Cluster 1 (MMR-CSN)"
                  >
                    <span className="hidden sm:inline">Cluster 1 (TMS+TDMS+SMMS)</span>
                    <span className="sm:hidden">C1</span>
                  </div>
                )}
              </div>
            </div>

            {/* Track 2: Up Main Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-cyan-400">
                UP MAIN
              </div>
              <div className="relative-1 flex-1 h-3 bg-cyan-950/80 border-y border-cyan-600/60 rounded">
                {/* Station nodes */}
                {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => setSelectedStation(stn)}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 hover:border-yellow-400 hover:scale-125 transition cursor-pointer shadow-md"
                    style={{ left: `${kmToPercent(stn.chainageKm)}%` }}
                  />
                ))}

                {/* Neutral Section at Km 210/14 (Emergency Flashover) */}
                {(activeLayer === 'ALL' || activeLayer === 'OHE') && (
                  <div
                    onClick={() => setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[1])}
                    className="absolute -top-4 h-11 px-2 rounded-lg bg-red-600/40 border-2 border-red-500 animate-pulse hover:bg-red-600/60 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold text-white shadow-lg shadow-red-950"
                    style={{
                      left: `${kmToPercent(210.2)}%`,
                      width: `${Math.max(3, kmToPercent(211.5) - kmToPercent(210.2) + 4)}%`,
                    }}
                    title="Emergency Neutral Section Flashover (Km 210/14)"
                  >
                    <Zap className="w-3 h-3 text-yellow-300 shrink-0" />
                    <span className="truncate">NS Arc Km 210</span>
                  </div>
                )}

                {/* Night Shadow Screening at Km 142.1 (IGP-DVL) */}
                {(activeLayer === 'ALL' || activeLayer === 'TRACK') && (
                  <div
                    onClick={() => setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[2])}
                    className="absolute -top-3.5 h-10 px-2 rounded-lg bg-amber-600/30 border-2 border-amber-400 hover:bg-amber-600/50 transition cursor-pointer flex items-center text-[10px] font-bold text-white shadow-md"
                    style={{
                      left: `${kmToPercent(142.1)}%`,
                      width: `${Math.max(3, kmToPercent(144.3) - kmToPercent(142.1) + 4)}%`,
                    }}
                    title="Deep Screening (Night Window)"
                  >
                    <span>BCM Ghat</span>
                  </div>
                )}
              </div>
            </div>

            {/* Track 3: 3rd Corridor Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-purple-400">
                3RD CORR
              </div>
              <div className="relative-1 flex-1 h-2.5 bg-purple-950/80 border-y border-purple-600/60 rounded">
                {/* Available between Jalgaon and Bhusawal (Km 395 to 444) */}
                <div
                  className="absolute inset-y-0 bg-purple-600/30 rounded"
                  style={{ left: `${kmToPercent(395)}%`, right: `${100 - kmToPercent(444)}%` }}
                />
                {/* Axle counter anomaly at Km 398 */}
                {(activeLayer === 'ALL' || activeLayer === 'SIGNAL') && (
                  <div
                    className="absolute -top-3 w-5 h-8 rounded bg-emerald-500/40 border border-emerald-400 flex items-center justify-center cursor-pointer"
                    style={{ left: `${kmToPercent(398.0)}%` }}
                    title="Digital Axle Counter Fault (Km 398)"
                  >
                    <Radio className="w-3 h-3 text-emerald-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Track 4: Chalisgaon Loop 3 */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-emerald-400">
                CSN LOOP
              </div>
              <div className="relative-1 flex-1 h-2.5 bg-emerald-950/80 border-y border-emerald-600/60 rounded">
                <div
                  className="absolute inset-y-0 bg-emerald-600/40 rounded border border-emerald-500"
                  style={{ left: `${kmToPercent(326)}%`, width: `${kmToPercent(330) - kmToPercent(326)}%` }}
                  title="Chalisgaon Bi-directional Loop Line"
                />
              </div>
            </div>
          </div>

          {/* Station Labels on Bottom */}
          <div className="relative w-full h-10 mt-6">
            {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => {
              const pos = kmToPercent(stn.chainageKm);
              const isSelected = selectedStation?.code === stn.code;
              return (
                <div
                  key={stn.code}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer"
                  style={{ left: `${pos}%` }}
                  onClick={() => setSelectedStation(stn)}
                >
                  <div className={`w-0.5 h-2 ${isSelected ? 'bg-blue-400' : 'bg-slate-600'}`} />
                  <span
                    className={`text-xs font-bold font-mono tracking-tight transition ${
                      isSelected
                        ? 'text-yellow-400 scale-110 underline decoration-yellow-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {stn.code}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[70px] hidden md:block">
                    {stn.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Station Telemetry & Electrical Isolation Card */}
        {selectedStation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white">
                  Station Node: {selectedStation.name} [{selectedStation.code}]
                </span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  Chainage: Km {selectedStation.chainageKm}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {selectedStation.type} • Platforms: {selectedStation.platforms} • Lines: {selectedStation.lines}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Traction Substation:</span>
                <span className="text-slate-200">
                  {selectedStation.hasSubstation
                    ? '25 kV AC Feeding Post Active'
                    : 'Fed from adjacent sectionalizing post'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Interlocking Type:</span>
                <span className="text-slate-200">Electronic Interlocking (EI) SIL-4 Dual Standby</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Max Section Speed:</span>
                <span className="text-emerald-400 font-mono font-bold">130 km/h (Mainline) / 50 km/h (Loop)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spatial Maintenance Clusters & Active Assets Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Spatial Maintenance Clusters */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Spatial Maintenance Clusters
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              3 Clusters Mapped
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Harmonizes overlapping work zones across departments into single geographical corridor envelopes for joint possession.
          </p>

          <div className="space-y-3">
            {SPATIAL_INFRASTRUCTURE_DATA.spatialClusters.map((cluster) => {
              const isSelected = selectedCluster?.clusterId === cluster.clusterId;
              return (
                <div
                  key={cluster.clusterId}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {cluster.clusterId} • {cluster.lineCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cluster.urgency.includes('Emergency')
                          ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {cluster.urgency}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{cluster.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mb-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cluster.chainageRange}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                    <span>Requisitions: <strong>{cluster.associatedReqs.join(', ')}</strong></span>
                    {cluster.jointPossessionFeasible && (
                      <span className="text-emerald-400 font-bold font-mono">
                        +{cluster.synergySavingsMins}m Saved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Electrical Isolation & Neutral Section Zones */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-base font-bold text-white">
                Electrical Section Isolation Limits
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
              5 Zones Monitored
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Defines the electrical boundaries where power must be isolated (25 kV cut) and neutral section constraints for passing trains.
          </p>

          <div className="space-y-3">
            {SPATIAL_INFRASTRUCTURE_DATA.isolationZones.map((zone) => (
              <div
                key={zone.zoneId}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-blue-300">
                    {zone.zoneId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      zone.status.includes('Warning')
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{zone.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center justify-between gap-2">
                  <span>Chainage: <strong>Km {zone.kmStart} — {zone.kmEnd}</strong></span>
                  <span>Feeding Post: <strong className="text-cyan-300">{zone.feedingPost}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-200">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Ready to bundle work within these zones?</span>
            </div>
            <button
              onClick={() => onNavigate('planner')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer"
            >
              Open AI Bundler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
