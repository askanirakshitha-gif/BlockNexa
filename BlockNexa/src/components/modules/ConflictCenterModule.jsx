import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Train,
  Check,
  Wrench,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { CONFLICTS_DATA } from '../../data/railwayData';

export default function ConflictCenterModule({ onNavigate }) {
  const [conflicts, setConflicts] = useState(CONFLICTS_DATA);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNRESOLVED, RESOLVED

  const handleApplyResolution = (id) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Resolved by Controller',
              resolvedTimestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
            }
          : c
      )
    );
  };

  const handleApplyAll = () => {
    setConflicts((prev) =>
      prev.map((c) => ({
        ...c,
        status: 'Resolved by Controller',
        resolvedTimestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      }))
    );
  };

  const unresolvedCount = conflicts.filter((c) => c.status !== 'Resolved by Controller').length;

  const filteredConflicts = conflicts.filter((c) => {
    if (activeTab === 'UNRESOLVED') return c.status !== 'Resolved by Controller';
    if (activeTab === 'RESOLVED') return c.status === 'Resolved by Controller';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
              Module 06
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Conflict Center & Spatial-Temporal Collision Detection</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detect overlapping multi-departmental blocks, train path infringements, and execute AI-generated resolution plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unresolvedCount > 0 && (
            <button
              onClick={handleApplyAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Apply All AI Resolutions ({unresolvedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Conflicts ({conflicts.length})
          </button>

          <button
            onClick={() => setActiveTab('UNRESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              activeTab === 'UNRESOLVED'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Action ({unresolvedCount})
          </button>

          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              activeTab === 'RESOLVED'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({conflicts.length - unresolvedCount})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Train Collision Guarantee (SIL-4 Verified)</span>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-4">
        {filteredConflicts.map((c) => {
          const isResolved = c.status === 'Resolved by Controller';

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isResolved
                  ? 'bg-slate-950/60 border-emerald-900/50'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Conflict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg border ${
                      isResolved
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {isResolved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {c.id}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {c.type}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          c.severity === 'Emergency'
                            ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                            : c.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      <strong>Location:</strong> {c.location} • <strong>Track:</strong> {c.line}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isResolved ? (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Resolved at {c.resolvedTimestamp}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyResolution(c.id)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-950 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Apply AI Resolution</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Conflict Body */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Conflicting elements & Nature */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Conflicting Elements Detected:
                  </div>
                  <div className="space-y-1.5">
                    {c.conflictingElements.map((el, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{el}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                    <strong>Operational Threat:</strong> {c.natureOfConflict}
                  </p>
                </div>

                {/* Right: AI Recommendation */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>BlockNexa AI Resolution Recommendation</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded border border-purple-700">
                        {c.confidence} Confidence
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {c.aiRecommendation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-between text-xs text-emerald-400 font-mono gap-2">
                    <span>
                      <strong>Slot:</strong> {c.recommendedSlot}
                    </span>
                    <span>
                      <strong>Delay Impact:</strong> {c.projectedDelayReduction}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
