import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Gauge,
  Clock,
  ShieldCheck,
  Zap,
  Radio,
  HardHat,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { ASSET_INTELLIGENCE_METRICS } from '../../data/railwayData';

export default function AssetIntelligenceModule({ onNavigate }) {
  const [assetFilter, setAssetFilter] = useState('ALL'); // ALL, HIGH, CRITICAL, OVERDUE
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = ASSET_INTELLIGENCE_METRICS.highFailureRiskAssets.filter((a) => {
    if (assetFilter === 'HIGH' && a.riskLevel !== 'High') return false;
    if (assetFilter === 'CRITICAL' && a.riskLevel !== 'Critical') return false;
    if (assetFilter === 'OVERDUE' && !a.dueStatus.includes('Overdue')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.assetId.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.parameter.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 07
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Asset Intelligence & Failure Risk Telemetry</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predictive health indices across Track (USFD/TQI), Traction (OHE PTFE), and Signalling (EI & Point Machines)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('requests')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Raise Maintenance for At-Risk Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Health Index Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health Score */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Overall Divisional Health</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {ASSET_INTELLIGENCE_METRICS.overallHealthScore}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${ASSET_INTELLIGENCE_METRICS.overallHealthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Corridor Safety Threshold: &gt;90%</p>
        </div>

        {/* P-Way Track Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Track (TMS / P-Way)</span>
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            {ASSET_INTELLIGENCE_METRICS.trackHealthScore}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${ASSET_INTELLIGENCE_METRICS.trackHealthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Avg TQI: 44.2 (Good Riding Comfort)</p>
        </div>

        {/* Traction OHE Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Traction (TDMS / OHE)</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-300">
            {ASSET_INTELLIGENCE_METRICS.oheHealthScore}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${ASSET_INTELLIGENCE_METRICS.oheHealthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">25kV Supply Stability: 99.8%</p>
        </div>

        {/* S&T Signal Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Signalling (SMMS)</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300">
            {ASSET_INTELLIGENCE_METRICS.signalHealthScore}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${ASSET_INTELLIGENCE_METRICS.signalHealthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Interlocking Uptime: 99.9%</p>
        </div>
      </div>

      {/* High Failure Risk Assets Grid */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <h3 className="text-base font-bold text-white">
              Critical Defects & High Failure Risk Assets
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'OVERDUE'].map((f) => (
              <button
                key={f}
                onClick={() => setAssetFilter(f)}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition ${
                  assetFilter === f
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered assets list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.assetId}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {asset.assetId}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    asset.riskLevel === 'Critical'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : asset.riskLevel === 'High'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {asset.riskLevel} Risk ({asset.riskScore}/100)
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{asset.type}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{asset.location}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Critical Telemetry Parameter:
                </span>
                <span className="font-mono text-amber-300 font-medium">
                  {asset.parameter}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <span>{asset.dueStatus}</span>
                <button
                  onClick={() => onNavigate('planner')}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  <span>Schedule Block</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
