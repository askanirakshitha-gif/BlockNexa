import React, { useState, useEffect } from 'react';
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
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Compass,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Eye,
  RefreshCw,
  Clock,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import {
  SPATIAL_INFRASTRUCTURE_DATA,
  INITIAL_MAINTENANCE_REQUESTS,
  ASSET_INTELLIGENCE_METRICS,
} from '../../data/railwayData';
import {
  INITIAL_LIVE_TRAINS,
  updateTrainsLiveMovement,
} from '../../services/liveTrainSimulationService';
import { fetchLiveTrains } from '../../services/api';

export default function RailwayMapModule({ onNavigate }) {
  // Navigation & Inspector Selection State
  const [selectedStation, setSelectedStation] = useState(SPATIAL_INFRASTRUCTURE_DATA.stations[3]); // Manmad Jn
  const [selectedCluster, setSelectedCluster] = useState(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[1]); // Default to NS Arc Km 210
  const [activeInspectorType, setActiveInspectorType] = useState('CLUSTER'); // 'CLUSTER' | 'TRAIN' | 'STATION'
  const [activeLayer, setActiveLayer] = useState('ALL'); // ALL, TRAINS, TRACK, OHE, SIGNAL, CLUSTERS
  const [sanctionSuccessMsg, setSanctionSuccessMsg] = useState(null);

  // Live Train Simulation & Telemetry State
  const [trains, setTrains] = useState(INITIAL_LIVE_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState(INITIAL_LIVE_TRAINS[0]); // 22222 Vande Bharat
  const [isLiveMoving, setIsLiveMoving] = useState(true);
  const [simSpeed, setSimSpeed] = useState(10); // 10x default speed
  const [reroutedTrainIds, setReroutedTrainIds] = useState([]);
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date().toLocaleTimeString());

  // Total corridor span: Km 137 to Km 444 (307 km span)
  const minKm = 130;
  const maxKm = 450;
  const kmToPercent = (km) => {
    return Math.max(2, Math.min(98, ((km - minKm) / (maxKm - minKm)) * 100));
  };

  // Fetch initial telemetry from FastAPI backend if available
  useEffect(() => {
    let isMounted = true;
    fetchLiveTrains().then((res) => {
      if (res && res.trains && res.trains.length > 0 && isMounted) {
        setTrains((prev) =>
          prev.map((initT) => {
            const remote = res.trains.find((rt) => rt.trainNo === initT.trainNo);
            if (remote) {
              return {
                ...initT,
                currentKm: remote.currentKm,
                speedKmph: remote.speedKmph,
                signalAspect: remote.signalAspect,
                delayMins: remote.delayMins,
              };
            }
            return initT;
          })
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Continuous live train movement loop
  useEffect(() => {
    if (!isLiveMoving) return;

    const interval = setInterval(() => {
      setTrains((prevTrains) => {
        const updated = updateTrainsLiveMovement(
          prevTrains,
          1.0, // dtSeconds
          simSpeed,
          reroutedTrainIds
        );
        if (selectedTrain) {
          const freshSelected = updated.find((t) => t.trainNo === selectedTrain.trainNo);
          if (freshSelected) {
            setSelectedTrain(freshSelected);
          }
        }
        return updated;
      });
      setLastHeartbeat(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveMoving, simSpeed, reroutedTrainIds, selectedTrain?.trainNo]);

  const toggleReroute = (trainNo = '12951') => {
    setReroutedTrainIds((prev) =>
      prev.includes(trainNo) ? prev.filter((id) => id !== trainNo) : [...prev, trainNo]
    );
  };

  const handleResetSimulation = () => {
    setTrains(INITIAL_LIVE_TRAINS);
    setReroutedTrainIds([]);
    setSelectedTrain(INITIAL_LIVE_TRAINS[0]);
  };

  const handleFocusTrain = (train) => {
    setSelectedTrain(train);
    setActiveInspectorType('TRAIN');
    const closestStation = SPATIAL_INFRASTRUCTURE_DATA.stations.reduce((prev, curr) =>
      Math.abs(curr.chainageKm - train.currentKm) < Math.abs(prev.chainageKm - train.currentKm) ? curr : prev
    );
    setSelectedStation(closestStation);
  };

  // Section metrics
  const avgSpeed = trains.length > 0
    ? Math.round(trains.reduce((acc, t) => acc + t.speedKmph, 0) / trains.length)
    : 104;
  const cautionCount = trains.filter(
    (t) => t.speedKmph <= 40 || t.status.includes('Caution') || t.signalAspect === 'DOUBLE_YELLOW'
  ).length;

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
              <span>Railway Map & Live Infrastructure Layer</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-600/30 text-cyan-300 border border-cyan-500/40">
                Live Linear Referencing
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS train movement, asset status overlays (P-Way, TRD, S&T), kilometric chainage, electrical isolation limits, and spatial maintenance clusters
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
              onClick={() => setActiveLayer('TRAINS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeLayer === 'TRAINS' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-white'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Live Trains ({trains.length})</span>
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
                activeLayer === 'CLUSTERS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Clusters
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
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveMoving ? 'animate-ping' : ''}`} />
                {isLiveMoving ? 'Live GPS Moving' : 'Paused'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any element on the schematic — <strong>Red Neutral Section (Km 210)</strong>, <strong>Yellow BCM Ghat (Km 142)</strong>, <strong>Blue Cluster 1</strong>, trains, or stations — to inspect full telemetry below.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Down Main
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Up Main
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 3rd Corridor
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Loop Line
            </span>
          </div>
        </div>

        {/* Live Train Movement & Telemetry Control Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono font-bold">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveMoving ? 'animate-pulse' : ''}`} />
              <span>LIVE GPS TELEMETRY STREAM</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>Active: <strong className="text-white">{trains.length} Trains</strong></span>
              <span>•</span>
              <span>Avg Speed: <strong className="text-cyan-300">{avgSpeed} km/h</strong></span>
              <span>•</span>
              <span>Caution Zone: <strong className={cautionCount > 0 ? 'text-amber-400' : 'text-slate-400'}>{cautionCount} Trains</strong></span>
            </div>
          </div>

          {/* Controls: Play/Pause, Speed, Reset, Reroute */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLiveMoving(!isLiveMoving)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer text-xs ${
                isLiveMoving
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isLiveMoving ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveMoving ? 'Pause Live' : 'Resume Live'}</span>
            </button>

            {/* Sim Speed selector */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
              {[1, 5, 10, 25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                    simSpeed === speed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${speed}x simulation speed`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Reset */}
            <button
              onClick={handleResetSimulation}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset train positions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Dynamic Reroute Button */}
            <button
              onClick={() => toggleReroute('12951')}
              className={`px-3 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition cursor-pointer text-xs ${
                reroutedTrainIds.includes('12951')
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {reroutedTrainIds.includes('12951')
                  ? 'Rajdhani 12951: On Loop Line'
                  : 'Divert Rajdhani 12951 to Loop'}
              </span>
            </button>
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
                  onClick={() => {
                    setSelectedStation(stn);
                    setActiveInspectorType('STATION');
                  }}
                >
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-300 transition">
                    Km {stn.chainageKm}
                  </span>
                  <div className="w-0.5 h-3 bg-slate-600 group-hover:bg-blue-400" />
                </div>
              );
            })}
          </div>

          {/* 4 Tracks Horizontal Lines with Live Moving Trains & Interactive Clusters */}
          <div className="space-y-7 relative">
            {/* Track 1: Down Main Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-blue-400">
                DN MAIN
              </div>
              <div className="relative flex-1 h-3.5 bg-blue-950/80 border-y border-blue-600/60 rounded">
                {/* Station nodes */}
                {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => {
                      setSelectedStation(stn);
                      setActiveInspectorType('STATION');
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-400 hover:border-yellow-400 hover:scale-125 transition cursor-pointer shadow-md z-10"
                    style={{ left: `${kmToPercent(stn.chainageKm)}%` }}
                    title={`${stn.name} (${stn.code}) - Km ${stn.chainageKm}`}
                  />
                ))}

                {/* Spatial Cluster 1 Overlay (Blue Box: Km 284.2 to 286.0) */}
                {(activeLayer === 'ALL' || activeLayer === 'CLUSTERS' || activeLayer === 'TRACK') && (
                  <div
                    onClick={() => {
                      setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[0]);
                      setActiveInspectorType('CLUSTER');
                    }}
                    className={`absolute -top-3.5 h-10 rounded-lg border-2 transition-all cursor-pointer shadow-md flex items-center justify-center px-2 text-[10px] font-bold text-white z-20 ${
                      activeInspectorType === 'CLUSTER' && selectedCluster?.clusterId === 'CLUS-01'
                        ? 'bg-blue-600 ring-4 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.9)] scale-105'
                        : 'bg-blue-600/40 border-blue-400 hover:bg-blue-600/60 hover:scale-105'
                    }`}
                    style={{
                      left: `${kmToPercent(284.2)}%`,
                      minWidth: '120px',
                    }}
                    title="Joint Maintenance Cluster 1 (MMR-CSN) • Click to inspect"
                  >
                    <span className="hidden sm:inline">Cluster 1 (TMS+TDMS) • SR 30</span>
                    <span className="sm:hidden">C1 (SR 30)</span>
                  </div>
                )}

                {/* Live Moving Trains on DN-MAIN */}
                {(activeLayer === 'ALL' || activeLayer === 'TRAINS') &&
                  trains
                    .filter((t) => t.track === 'DN-MAIN')
                    .map((t) => {
                      const isSelected = activeInspectorType === 'TRAIN' && selectedTrain?.trainNo === t.trainNo;
                      const isCaution = t.speedKmph <= 40 && t.status.includes('Caution');
                      const percent = kmToPercent(t.currentKm);

                      return (
                        <div
                          key={t.trainNo}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrain(t);
                            setActiveInspectorType('TRAIN');
                          }}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-25 transition-all duration-500 cursor-pointer group"
                          style={{ left: `${percent}%` }}
                        >
                          {isSelected && (
                            <span className="absolute -inset-1.5 rounded-full bg-yellow-400/50 animate-ping pointer-events-none" />
                          )}

                          <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-yellow-300 ring-2 ring-yellow-400 scale-110 shadow-blue-500/50'
                                : isCaution
                                ? 'bg-amber-950 text-amber-200 border-amber-500 ring-1 ring-amber-500/50 hover:scale-110'
                                : 'bg-slate-900 text-white border-blue-400 hover:border-white hover:scale-110'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                t.signalAspect === 'GREEN'
                                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                                  : t.signalAspect === 'YELLOW'
                                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                                  : t.signalAspect === 'DOUBLE_YELLOW'
                                  ? 'bg-yellow-300 animate-pulse shadow-[0_0_8px_#fde047]'
                                  : 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'
                              }`}
                            />
                            <Train className="w-3 h-3 text-cyan-300 shrink-0" />
                            <span>{t.trainNo}</span>
                            <span className="text-[9px] text-cyan-300 font-semibold">{t.speedKmph}k</span>
                            <span className="text-[8px] text-slate-400">→</span>
                          </div>

                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-35 pointer-events-none">
                            <div className="bg-slate-950/95 text-white border border-slate-700 px-2.5 py-1 rounded-lg shadow-xl text-[11px] space-y-0.5">
                              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                                <span>{t.trainNo}</span>
                                <span>•</span>
                                <span>{t.name}</span>
                              </div>
                              <div className="text-slate-400 font-mono text-[10px]">
                                Km {t.currentKm} • {t.speedKmph} km/h • Next: {t.nextStationCode} ({t.distToNextKm} km)
                              </div>
                              <div className="text-amber-300 text-[10px] font-medium">{t.status}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Track 2: Up Main Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-cyan-400">
                UP MAIN
              </div>
              <div className="relative flex-1 h-3.5 bg-cyan-950/80 border-y border-cyan-600/60 rounded">
                {/* Station nodes */}
                {SPATIAL_INFRASTRUCTURE_DATA.stations.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => {
                      setSelectedStation(stn);
                      setActiveInspectorType('STATION');
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 hover:border-yellow-400 hover:scale-125 transition cursor-pointer shadow-md z-10"
                    style={{ left: `${kmToPercent(stn.chainageKm)}%` }}
                  />
                ))}

                {/* RED BOX: Neutral Section at Km 210/14 (Emergency Flashover - CLUS-02) */}
                {(activeLayer === 'ALL' || activeLayer === 'OHE' || activeLayer === 'CLUSTERS') && (
                  <div
                    onClick={() => {
                      setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[1]);
                      setActiveInspectorType('CLUSTER');
                    }}
                    className={`absolute -top-4 h-11 px-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold text-white shadow-xl z-20 ${
                      activeInspectorType === 'CLUSTER' && selectedCluster?.clusterId === 'CLUS-02'
                        ? 'bg-red-600 ring-4 ring-red-400 shadow-[0_0_25px_rgba(239,68,68,0.95)] scale-110'
                        : 'bg-red-600/70 border-red-500 animate-pulse hover:bg-red-600 hover:scale-105'
                    }`}
                    style={{
                      left: `${kmToPercent(210.2)}%`,
                      minWidth: '95px',
                    }}
                    title="Emergency Neutral Section Flashover (Km 210/14) • Click to inspect"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0 animate-bounce" />
                    <span className="whitespace-nowrap font-mono font-bold">NS Arc Km 210</span>
                  </div>
                )}

                {/* YELLOW BOX: Night Shadow Deep Ballast Screening at Km 142.1 (BCM Ghat - CLUS-03) */}
                {(activeLayer === 'ALL' || activeLayer === 'TRACK' || activeLayer === 'CLUSTERS') && (
                  <div
                    onClick={() => {
                      setSelectedCluster(SPATIAL_INFRASTRUCTURE_DATA.spatialClusters[2]);
                      setActiveInspectorType('CLUSTER');
                    }}
                    className={`absolute -top-3.5 h-10 px-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-bold text-white shadow-xl z-20 ${
                      activeInspectorType === 'CLUSTER' && selectedCluster?.clusterId === 'CLUS-03'
                        ? 'bg-amber-600 ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.95)] scale-110'
                        : 'bg-amber-600/70 border-amber-400 hover:bg-amber-600 hover:scale-105'
                    }`}
                    style={{
                      left: `${kmToPercent(142.1)}%`,
                      minWidth: '85px',
                    }}
                    title="Deep Ballast Screening (Night Window) • Click to inspect"
                  >
                    <Wrench className="w-3 h-3 text-amber-200 shrink-0" />
                    <span className="whitespace-nowrap font-mono font-bold">BCM Ghat</span>
                  </div>
                )}

                {/* Live Moving Trains on UP-MAIN */}
                {(activeLayer === 'ALL' || activeLayer === 'TRAINS') &&
                  trains
                    .filter((t) => t.track === 'UP-MAIN')
                    .map((t) => {
                      const isSelected = activeInspectorType === 'TRAIN' && selectedTrain?.trainNo === t.trainNo;
                      const isNeutral = t.status.includes('Neutral');
                      const percent = kmToPercent(t.currentKm);

                      return (
                        <div
                          key={t.trainNo}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrain(t);
                            setActiveInspectorType('TRAIN');
                          }}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-25 transition-all duration-500 cursor-pointer group"
                          style={{ left: `${percent}%` }}
                        >
                          {isSelected && (
                            <span className="absolute -inset-1.5 rounded-full bg-yellow-400/50 animate-ping pointer-events-none" />
                          )}

                          <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border transition-all ${
                              isSelected
                                ? 'bg-cyan-600 text-white border-yellow-300 ring-2 ring-yellow-400 scale-110 shadow-cyan-500/50'
                                : isNeutral
                                ? 'bg-amber-950 text-amber-200 border-yellow-500 animate-pulse'
                                : 'bg-slate-900 text-white border-cyan-400 hover:border-white hover:scale-110'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                t.signalAspect === 'GREEN'
                                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                                  : t.signalAspect === 'YELLOW'
                                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                                  : 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'
                              }`}
                            />
                            <Train className="w-3 h-3 text-cyan-300 shrink-0" />
                            <span>{t.trainNo}</span>
                            <span className="text-[9px] text-cyan-300 font-semibold">{t.speedKmph}k</span>
                            <span className="text-[8px] text-slate-400">←</span>
                          </div>

                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-35 pointer-events-none">
                            <div className="bg-slate-950/95 text-white border border-slate-700 px-2.5 py-1 rounded-lg shadow-xl text-[11px] space-y-0.5">
                              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                                <span>{t.trainNo}</span>
                                <span>•</span>
                                <span>{t.name}</span>
                              </div>
                              <div className="text-slate-400 font-mono text-[10px]">
                                Km {t.currentKm} • {t.speedKmph} km/h • Next: {t.nextStationCode} ({t.distToNextKm} km)
                              </div>
                              <div className="text-amber-300 text-[10px] font-medium">{t.status}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Track 3: 3rd Corridor Line */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-amber-400">
                3RD CORR
              </div>
              <div className="relative flex-1 h-3 bg-amber-950/60 border-y border-amber-600/60 rounded">
                <div
                  className="absolute inset-y-0 bg-amber-600/30 rounded"
                  style={{ left: `${kmToPercent(395)}%`, right: `${100 - kmToPercent(444)}%` }}
                />
                {(activeLayer === 'ALL' || activeLayer === 'SIGNAL') && (
                  <div
                    className="absolute -top-3 w-5 h-8 rounded bg-emerald-500/40 border border-emerald-400 flex items-center justify-center cursor-pointer z-10"
                    style={{ left: `${kmToPercent(398.0)}%` }}
                    title="Digital Axle Counter Fault (Km 398)"
                  >
                    <Radio className="w-3 h-3 text-emerald-300" />
                  </div>
                )}

                {/* Live Trains on 3RD-LINE */}
                {(activeLayer === 'ALL' || activeLayer === 'TRAINS') &&
                  trains
                    .filter((t) => t.track === '3RD-LINE')
                    .map((t) => {
                      const isSelected = activeInspectorType === 'TRAIN' && selectedTrain?.trainNo === t.trainNo;
                      const percent = kmToPercent(t.currentKm);

                      return (
                        <div
                          key={t.trainNo}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrain(t);
                            setActiveInspectorType('TRAIN');
                          }}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-25 transition-all duration-500 cursor-pointer group"
                          style={{ left: `${percent}%` }}
                        >
                          {isSelected && (
                            <span className="absolute -inset-1.5 rounded-full bg-yellow-400/50 animate-ping pointer-events-none" />
                          )}

                          <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border transition-all ${
                              isSelected
                                ? 'bg-amber-600 text-white border-yellow-300 ring-2 ring-yellow-400 scale-110 shadow-amber-500/50'
                                : 'bg-slate-900 text-amber-200 border-amber-500 hover:border-white hover:scale-110'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0" />
                            <Train className="w-3 h-3 text-amber-300 shrink-0" />
                            <span>{t.trainNo.replace('FRT-', '')}</span>
                            <span className="text-[9px] text-amber-300 font-semibold">{t.speedKmph}k</span>
                            <span className="text-[8px] text-slate-400">←</span>
                          </div>

                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-35 pointer-events-none">
                            <div className="bg-slate-950/95 text-white border border-slate-700 px-2.5 py-1 rounded-lg shadow-xl text-[11px] space-y-0.5">
                              <div className="font-bold text-amber-300">{t.name}</div>
                              <div className="text-slate-400 font-mono text-[10px]">
                                Km {t.currentKm} • {t.speedKmph} km/h • Next: {t.nextStationCode}
                              </div>
                              <div className="text-emerald-400 text-[10px]">{t.status}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Track 4: Chalisgaon Loop 3 */}
            <div className="relative flex items-center">
              <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono font-bold text-emerald-400">
                CSN LOOP
              </div>
              <div className="relative flex-1 h-3 bg-emerald-950/80 border-y border-emerald-600/60 rounded">
                <div
                  className="absolute inset-y-0 bg-emerald-600/40 rounded border border-emerald-500"
                  style={{ left: `${kmToPercent(326)}%`, width: `${kmToPercent(330) - kmToPercent(326)}%` }}
                  title="Chalisgaon Bi-directional Loop Line (Km 326 - 330)"
                />

                {/* Live Trains on LOOP-3 */}
                {(activeLayer === 'ALL' || activeLayer === 'TRAINS') &&
                  trains
                    .filter((t) => t.track === 'LOOP-3')
                    .map((t) => {
                      const isSelected = activeInspectorType === 'TRAIN' && selectedTrain?.trainNo === t.trainNo;
                      const percent = kmToPercent(t.currentKm);

                      return (
                        <div
                          key={t.trainNo}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrain(t);
                            setActiveInspectorType('TRAIN');
                          }}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-25 transition-all duration-500 cursor-pointer group"
                          style={{ left: `${percent}%` }}
                        >
                          {isSelected && (
                            <span className="absolute -inset-1.5 rounded-full bg-yellow-400/50 animate-ping pointer-events-none" />
                          )}

                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border bg-emerald-700 text-white border-yellow-300 ring-2 ring-emerald-400 scale-105">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] shrink-0" />
                            <Train className="w-3 h-3 text-white shrink-0" />
                            <span>{t.trainNo}</span>
                            <span className="text-[9px] text-emerald-200 font-semibold">{t.speedKmph}k</span>
                            <span className="text-[8px] text-white">LOOP</span>
                          </div>

                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-35 pointer-events-none">
                            <div className="bg-slate-950/95 text-white border border-slate-700 px-2.5 py-1 rounded-lg shadow-xl text-[11px] space-y-0.5">
                              <div className="font-bold text-emerald-300">{t.name}</div>
                              <div className="text-slate-300 font-mono text-[10px]">
                                Diverted via Loop • Speed: {t.speedKmph} km/h • Km {t.currentKm}
                              </div>
                              <div className="text-emerald-400 text-[10px] font-medium">{t.status}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                  onClick={() => {
                    setSelectedStation(stn);
                    setActiveInspectorType('STATION');
                  }}
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

        {/* ========================================================================= */}
        {/* INTERACTIVE INSPECTOR SWITCHER TABS & DEDICATED CARDS */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-800/80 pt-4 space-y-4">
          {/* Inspector Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Telemetry Inspector:
              </span>
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {/* Cluster / Work Zone Tab */}
                <button
                  onClick={() => setActiveInspectorType('CLUSTER')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeInspectorType === 'CLUSTER'
                      ? selectedCluster?.clusterId === 'CLUS-02'
                        ? 'bg-red-600 text-white shadow-md'
                        : selectedCluster?.clusterId === 'CLUS-03'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    Work Zone: {selectedCluster?.clusterId} ({selectedCluster?.clusterId === 'CLUS-02' ? 'Red Arc' : selectedCluster?.clusterId === 'CLUS-03' ? 'Yellow BCM' : 'Blue C1'})
                  </span>
                </button>

                {/* Train Tab */}
                <button
                  onClick={() => setActiveInspectorType('TRAIN')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeInspectorType === 'TRAIN'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>Train: {selectedTrain?.trainNo} ({selectedTrain?.speedKmph} km/h)</span>
                </button>

                {/* Station Tab */}
                <button
                  onClick={() => setActiveInspectorType('STATION')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeInspectorType === 'STATION'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Station: {selectedStation?.name} [{selectedStation?.code}]</span>
                </button>
              </div>
            </div>

            <span className="text-[11px] text-slate-500">
              Click any element on the schematic map above to switch view instantly
            </span>
          </div>

          {/* CARD 1: Selected Spatial Work Zone & Cluster Telemetry Card */}
          {activeInspectorType === 'CLUSTER' && selectedCluster && (
            <div className={`p-5 rounded-2xl border space-y-4 shadow-2xl transition-all ${
              selectedCluster.clusterId === 'CLUS-02'
                ? 'bg-gradient-to-r from-red-950/80 via-slate-950 to-red-950/50 border-red-500/80 shadow-red-950/70'
                : selectedCluster.clusterId === 'CLUS-03'
                ? 'bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/50 border-amber-500/80 shadow-amber-950/70'
                : 'bg-gradient-to-r from-blue-950/80 via-slate-950 to-blue-950/50 border-blue-500/80 shadow-blue-950/70'
            }`}>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${
                    selectedCluster.clusterId === 'CLUS-02'
                      ? 'bg-red-600/30 text-red-300 border-red-500/50'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                      : 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                  }`}>
                    {selectedCluster.clusterId === 'CLUS-02' ? (
                      <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                    ) : selectedCluster.clusterId === 'CLUS-03' ? (
                      <Wrench className="w-6 h-6 text-amber-300" />
                    ) : (
                      <Layers className="w-6 h-6 text-blue-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                        {selectedCluster.name}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                        {selectedCluster.clusterId}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selectedCluster.clusterId === 'CLUS-02'
                          ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
                          : selectedCluster.clusterId === 'CLUS-03'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-blue-950 text-blue-300 border border-blue-700'
                      }`}>
                        {selectedCluster.urgency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        Track Line: <strong className="text-white font-mono">{selectedCluster.lineCode}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Corridor Span: <strong className="text-cyan-300 font-mono">{selectedCluster.chainageRange}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Power Isolation Zone: <strong className="text-amber-300 font-mono">{selectedCluster.isolationZone}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {selectedCluster.jointPossessionFeasible && (
                    <span className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      +{selectedCluster.synergySavingsMins}m Corridor Delay Averted
                    </span>
                  )}
                  {selectedCluster.clusterId === 'CLUS-02' && (
                    <span className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-red-950 text-red-300 border border-red-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                      Strict 0-Amps Catenary Coasting
                    </span>
                  )}
                  {selectedCluster.clusterId === 'CLUS-03' && (
                    <span className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Night Window (01:15 — 05:15 IST)
                    </span>
                  )}
                </div>
              </div>

              {/* 4 Diagnostics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Associated Requisitions
                  </span>
                  <div className="font-bold text-white font-mono">
                    {selectedCluster.associatedReqs.join(', ')}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? 'TRD urgent insulator replacement & flashover mitigation'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'Engineering deep screening & track slew packing'
                      : 'Joint TMS track pack + TDMS wire + SMMS point throw'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Power Isolation Limits
                  </span>
                  <div className="font-bold text-cyan-300 font-mono">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? 'FP-08 Odha (Km 208 — 214)'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'FP-02 Kasara Ghat (Km 140 — 152)'
                      : 'FP-12 Nandgaon (Km 280 — 295)'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? '25 kV cut mandatory; earth discharge rod required'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'Section isolated; diesel shunter escort provided'
                      : 'Joint power shut-down coordinates all departments'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Speed Restriction
                  </span>
                  <div className="font-bold text-amber-300 font-mono">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? 'Coasting 60 — 110 km/h (0 Amps)'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'SR 20 km/h first 2 trains, then 45'
                      : 'SR 30 km/h through work zone'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Caution order transmitted to all Loco Pilots via COA/TMS
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Traffic Management Rule
                  </span>
                  <div className="font-bold text-emerald-400 font-mono">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? 'Hard Safety Bypass — No Cross-traffic'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'SLW on Down Mainline Active'
                      : 'Divert VIP Rakes via Loop 3'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedCluster.clusterId === 'CLUS-02'
                      ? 'Flashover protection isolates both catenaries'
                      : selectedCluster.clusterId === 'CLUS-03'
                      ? 'Single-line working maintains coaching traffic flow'
                      : 'Loop 3 frees mainline for uninterrupted tamping'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCluster.clusterId === 'CLUS-02' && (
                    <button
                      onClick={() => {
                        setSanctionSuccessMsg('✓ Emergency Disconnection Memo BDMS-EMG-210 issued. 25 kV AC isolated at FP-08 Odha.');
                        setTimeout(() => setSanctionSuccessMsg(null), 5000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-red-950"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Sanction Emergency Power Block (25 kV Cut)</span>
                    </button>
                  )}

                  {selectedCluster.clusterId === 'CLUS-03' && (
                    <button
                      onClick={() => {
                        setSanctionSuccessMsg('✓ Deep Ballast Possession Sanctioned for Night Window 01:15 - 05:15 IST. SLW Active.');
                        setTimeout(() => setSanctionSuccessMsg(null), 5000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-950"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sanction Night Shadow Window</span>
                    </button>
                  )}

                  {selectedCluster.clusterId === 'CLUS-01' && (
                    <button
                      onClick={() => toggleReroute('12951')}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-blue-950"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{reroutedTrainIds.includes('12951') ? '✓ Rajdhani 12951 Diverted via Loop' : 'Divert Rajdhani 12951 via Loop 3'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('planner')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span>Optimize in AI Planner</span>
                  </button>

                  <button
                    onClick={() => onNavigate('safety')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Safety Validation & Permits</span>
                  </button>
                </div>

                {sanctionSuccessMsg && (
                  <div className="p-2 px-3 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sanctionSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARD 2: Selected Train Real-Time GPS Telemetry & Locomotive Diagnostics Card */}
          {activeInspectorType === 'TRAIN' && selectedTrain && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border border-blue-900/60 space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-white tracking-tight">
                        {selectedTrain.trainNo} • {selectedTrain.name}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {selectedTrain.typeLabel || selectedTrain.type}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          selectedTrain.signalAspect === 'GREEN'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : selectedTrain.signalAspect === 'YELLOW'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-yellow-950/80 text-yellow-300 border border-yellow-800'
                        }`}
                      >
                        Aspect: {selectedTrain.signalAspect}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>
                        Track: <strong className="text-cyan-300">{selectedTrain.track}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Direction: <strong>{selectedTrain.direction === 'DN' ? 'Down (IGP → BSL)' : 'Up (BSL → IGP)'}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 font-medium">
                        Status: {selectedTrain.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Speed</span>
                    <span className="text-xl font-bold text-cyan-300">
                      {selectedTrain.speedKmph} <span className="text-xs text-slate-400">/ {selectedTrain.maxSpeed} km/h</span>
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Delay</span>
                    <span className={`text-xl font-bold ${selectedTrain.delayMins === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedTrain.delayMins === 0 ? '0m (On Time)' : `+${selectedTrain.delayMins}m`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics 6 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">CURRENT CHAINAGE</span>
                  <span className="text-sm font-bold text-white">Km {selectedTrain.currentKm}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Linear Ref Point</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">NEXT STATION</span>
                  <span className="text-sm font-bold text-cyan-300 truncate block">{selectedTrain.nextStationCode}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{selectedTrain.distToNextKm} km • ETA {selectedTrain.etaNext || '10:45'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">LOCOMOTIVE</span>
                  <span className="text-sm font-bold text-white truncate block">{selectedTrain.locoNo || 'WAP-7 #30455'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Electric Shed</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">LOCO PILOT (LP)</span>
                  <span className="text-sm font-bold text-white truncate block">{selectedTrain.locoPilot || 'Duty Crew'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Guard: {selectedTrain.guard || 'Assigned'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">TRACTION CURRENT</span>
                  <span className="text-sm font-bold text-amber-400">{selectedTrain.tractionAmps} A</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">OHE: {selectedTrain.catenaryVoltage} kV</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">COMPOSITION</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {selectedTrain.coaches ? `${selectedTrain.coaches} Coaches` : selectedTrain.wagons ? `${selectedTrain.wagons} Wagons` : 'Coaching'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {selectedTrain.passengers ? `~${selectedTrain.passengers} Pax` : selectedTrain.tonnage || 'Freight'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CARD 3: Selected Station Telemetry & Electrical Isolation Card */}
          {activeInspectorType === 'STATION' && selectedStation && (
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
      </div>

      {/* Live Active Trains Manifest Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Live Corridor Train Manifest & Operational Telemetry
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              8 Real-Time Services
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Last GPS sync: {lastHeartbeat}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2.5">Train No & Name</th>
                <th className="pb-2.5">Track / Dir</th>
                <th className="pb-2.5">Current Chainage</th>
                <th className="pb-2.5">Live Speed</th>
                <th className="pb-2.5">Aspect</th>
                <th className="pb-2.5">Operational Status</th>
                <th className="pb-2.5">Next Station</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {trains.map((train) => {
                const isSelected = activeInspectorType === 'TRAIN' && selectedTrain?.trainNo === train.trainNo;
                return (
                  <tr
                    key={train.trainNo}
                    onClick={() => handleFocusTrain(train)}
                    className={`transition cursor-pointer hover:bg-slate-800/40 ${
                      isSelected ? 'bg-blue-950/40 text-blue-200' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {train.trainNo}
                        </span>
                        <span className="font-semibold text-white truncate max-w-[180px]">{train.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        train.track === 'LOOP-3' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-300'
                      }`}>
                        {train.track} ({train.direction})
                      </span>
                    </td>
                    <td className="py-2.5 text-white font-bold">
                      Km {train.currentKm}
                    </td>
                    <td className="py-2.5">
                      <span className={`font-bold ${train.speedKmph <= 40 ? 'text-amber-400' : 'text-cyan-300'}`}>
                        {train.speedKmph} km/h
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        train.signalAspect === 'GREEN'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : train.signalAspect === 'YELLOW'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          train.signalAspect === 'GREEN' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        {train.signalAspect}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300 font-sans text-[11px] truncate max-w-[220px]">
                      {train.status}
                    </td>
                    <td className="py-2.5">
                      <span className="text-slate-200">{train.nextStationCode}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">({train.distToNextKm} km)</span>
                    </td>
                    <td className="py-2.5 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFocusTrain(train);
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spatial Maintenance Clusters & Active Assets Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Spatial Maintenance Clusters */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">
                Spatial Maintenance Clusters
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
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
                  onClick={() => {
                    setSelectedCluster(cluster);
                    setActiveInspectorType('CLUSTER');
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? cluster.clusterId === 'CLUS-02'
                        ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/40'
                        : cluster.clusterId === 'CLUS-03'
                        ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/40'
                        : 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/40'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-blue-300">
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
