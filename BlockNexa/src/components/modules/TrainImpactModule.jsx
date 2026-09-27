import React, { useState, useEffect } from 'react';
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
  Play,
  Pause,
  Radio,
  Gauge,
  Navigation,
  Activity,
  MapPin,
  Sliders,
} from 'lucide-react';
import { TIMETABLE_TRAINS } from '../../data/railwayData';
import {
  INITIAL_LIVE_TRAINS,
  updateTrainsLiveMovement,
} from '../../services/liveTrainSimulationService';
import { fetchLiveTrains } from '../../services/api';

export default function TrainImpactModule({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('LIVE_STATUS'); // 'LIVE_STATUS' | 'DISPATCH_PLAN'

  // Live Train Movement State
  const [liveTrains, setLiveTrains] = useState(INITIAL_LIVE_TRAINS);
  const [isLiveMoving, setIsLiveMoving] = useState(true);
  const [simSpeed, setSimSpeed] = useState(10);
  const [reroutedTrainIds, setReroutedTrainIds] = useState([]);
  const [selectedLiveTrain, setSelectedLiveTrain] = useState(INITIAL_LIVE_TRAINS[0]);

  // Timetable mitigation state
  const [trainsState, setTrainsState] = useState(
    TIMETABLE_TRAINS.map((t) => ({
      ...t,
      selectedAction: t.trainNo === '12951' ? 'REROUTE_LOOP' : t.trainNo === '12137' ? 'HOLD_JUNCTION' : 'SPEED_RECOVER',
      mitigatedDelay: t.trainNo === '22222' ? 0 : t.trainNo === '12951' ? 4 : t.trainNo === '12137' ? 12 : 5,
    }))
  );

  // Fetch initial telemetry from FastAPI
  useEffect(() => {
    let isMounted = true;
    fetchLiveTrains().then((res) => {
      if (res && res.trains && res.trains.length > 0 && isMounted) {
        setLiveTrains((prev) =>
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

  // Live movement tick
  useEffect(() => {
    if (!isLiveMoving) return;

    const interval = setInterval(() => {
      setLiveTrains((prev) => {
        const updated = updateTrainsLiveMovement(prev, 1.0, simSpeed, reroutedTrainIds);
        if (selectedLiveTrain) {
          const fresh = updated.find((t) => t.trainNo === selectedLiveTrain.trainNo);
          if (fresh) setSelectedLiveTrain(fresh);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveMoving, simSpeed, reroutedTrainIds, selectedLiveTrain?.trainNo]);

  const toggleReroute = (trainNo) => {
    setReroutedTrainIds((prev) =>
      prev.includes(trainNo) ? prev.filter((id) => id !== trainNo) : [...prev, trainNo]
    );
  };

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

  // Live metrics
  const avgLiveSpeed = liveTrains.length > 0
    ? Math.round(liveTrains.reduce((acc, t) => acc + t.speedKmph, 0) / liveTrains.length)
    : 104;
  const cautionCount = liveTrains.filter(
    (t) => t.speedKmph <= 40 || t.status.includes('Caution') || t.signalAspect === 'DOUBLE_YELLOW'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 05 • COA TELEMETRY
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Train Status & Impact Assessment</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveMoving ? 'animate-ping' : ''}`} />
                {isLiveMoving ? 'Live Moving Feed' : 'Feed Paused'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS telemetry of moving trains along Bhusawal Division, caution order compliance, speed tracking, and AI block regulation dispatch
          </p>
        </div>

        {/* View Switcher & Map Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('LIVE_STATUS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'LIVE_STATUS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Moving Status ({liveTrains.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('DISPATCH_PLAN')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'DISPATCH_PLAN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Mitigation Dispatch Plan</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track on GIS Map</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards for Train Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Active Corridor Trains</span>
            <Train className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {liveTrains.length} Services
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            6 Coaching • 2 Heavy Freight Rakes
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Average Live Speed</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {avgLiveSpeed} km/h
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1">
            Section MPS: 130 km/h (Mainline)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Caution Compliance</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {cautionCount} in SR Zone
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            MMR-CSN Km 284-286 (SR 30 km/h)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Mitigated Delay</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300">
            +{totalMitigatedDelay}m <span className="text-xs text-slate-400 font-normal">(-{totalDelaySaved}m saved)</span>
          </div>
          <p className="text-[11px] text-blue-400/90 mt-1">
            Punctuality: 98.2% (Target &gt;95%)
          </p>
        </div>
      </div>

      {/* TAB 1: Live Train Status & Moving Telemetry */}
      {activeTab === 'LIVE_STATUS' && (
        <div className="space-y-6">
          {/* Live Controls Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono font-bold">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveMoving ? 'animate-pulse' : ''}`} />
                <span>REAL-TIME MOVING TRAINS FEED</span>
              </div>
              <span className="text-slate-400 hidden md:inline">
                GPS positions and speeds automatically advancing along track sections
              </span>
            </div>

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
                <span>{isLiveMoving ? 'Pause Movement' : 'Resume Movement'}</span>
              </button>

              <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
                {[1, 5, 10, 25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimSpeed(speed)}
                    className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                      simSpeed === speed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setLiveTrains(INITIAL_LIVE_TRAINS);
                  setReroutedTrainIds([]);
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Moving Trains Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {liveTrains.map((train) => {
              const isSelected = selectedLiveTrain?.trainNo === train.trainNo;
              const isRerouted = reroutedTrainIds.includes(train.trainNo);
              const isCaution = train.speedKmph <= 40 && train.status.includes('Caution');

              return (
                <div
                  key={train.trainNo}
                  onClick={() => setSelectedLiveTrain(train)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg space-y-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-500 shadow-blue-950/50'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${
                        train.type === 'VANDE_BHARAT'
                          ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                          : train.type === 'RAJDHANI'
                          ? 'bg-amber-600/20 text-amber-400 border-amber-500/30'
                          : train.type === 'FREIGHT'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30'
                      }`}>
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {train.trainNo}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">
                            {train.name}
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {train.typeLabel || train.type} • {train.track} ({train.direction === 'DN' ? 'Down: IGP → BSL' : 'Up: BSL → IGP'})
                        </span>
                      </div>
                    </div>

                    {/* Speedometer Badge */}
                    <div className="flex items-center gap-3 shrink-0 font-mono text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Speed</span>
                        <span className={`text-lg font-bold ${
                          isCaution ? 'text-amber-400 animate-pulse' : 'text-cyan-300'
                        }`}>
                          {train.speedKmph} <span className="text-xs text-slate-400">km/h</span>
                        </span>
                      </div>
                      <div className="w-px h-6 bg-slate-800" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Aspect</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                          train.signalAspect === 'GREEN'
                            ? 'text-emerald-400'
                            : train.signalAspect === 'YELLOW'
                            ? 'text-amber-400'
                            : 'text-yellow-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            train.signalAspect === 'GREEN' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`} />
                          {train.signalAspect}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status Banner */}
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    isCaution
                      ? 'bg-amber-950/40 text-amber-200 border-amber-800/60'
                      : isRerouted
                      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/60'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isCaution ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                      <span className="truncate font-medium">{train.status}</span>
                    </div>
                    <span className="text-[10px] font-mono shrink-0 text-slate-400">
                      Km {train.currentKm}
                    </span>
                  </div>

                  {/* Telemetry Strip */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">NEXT STOP</span>
                      <span className="text-slate-200 font-semibold truncate block">{train.nextStationCode}</span>
                      <span className="text-[10px] text-cyan-400">{train.distToNextKm} km</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">TRACTION</span>
                      <span className="text-amber-400 font-semibold">{train.tractionAmps} A</span>
                      <span className="text-[10px] text-slate-400">{train.catenaryVoltage} kV</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">PUNCTUALITY</span>
                      <span className={`font-semibold ${train.delayMins === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {train.delayMins === 0 ? 'On Time' : `+${train.delayMins}m`}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">{train.locoPilot ? train.locoPilot.split(' ')[0] : 'Crew'}</span>
                    </div>
                  </div>

                  {/* Interactive Reroute & Regulate Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 text-[11px]">Real-Time Dispatch Action:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReroute(train.trainNo);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                          isRerouted
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isRerouted ? '✓ Diverted via Loop' : 'Divert via Loop'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('map');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition cursor-pointer"
                      >
                        Locate on Map
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Affected Trains Table & Mitigation Options */}
      {activeTab === 'DISPATCH_PLAN' && (
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
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Reroute via Loop
                    </button>

                    <button
                      onClick={() => handleActionChange(train.trainNo, 'HOLD_JUNCTION')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        train.selectedAction === 'HOLD_JUNCTION'
                          ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
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
      )}
    </div>
  );
}
