import React, { useState, useEffect } from 'react';
import IndianRailwaysLogo from '../common/IndianRailwaysLogo';
import {
  LayoutDashboard,
  Wrench,
  Cpu,
  CalendarDays,
  TrainTrack,
  AlertTriangle,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Radio,
  LogOut,
  ChevronRight,
  Sparkles,
  FileCheck2,
  Bell,
  RefreshCw,
  MapPin,
  GitBranch,
} from 'lucide-react';

export const MODULES = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'pipeline', label: 'Architecture', icon: GitBranch, badge: '7 Stages', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
  { id: 'map', label: '1. Railway Map', icon: MapPin, badge: 'Live GIS', badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' },
  { id: 'requests', label: '2. Maintenance Hub', icon: Wrench, badge: 'CPI', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
  { id: 'planner', label: '3. AI Optimizer', icon: Cpu, badge: 'MILP', badgeColor: 'bg-blue-900/60 text-blue-200 border border-blue-700/60' },
  { id: 'gantt', label: '4. Master Schedule', icon: CalendarDays, badge: '3 Horizons', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
  { id: 'safety', label: '5. Safety & Sanction', icon: ShieldCheck, badge: 'BDMS', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
  { id: 'simulation', label: '6. Re-planner & Audit', icon: SlidersHorizontal, badge: 'Rolling', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
  { id: 'advanced', label: '7. Advanced Capabilities', icon: Sparkles, badge: '6 Value-Adds', badgeColor: 'bg-blue-900/60 text-blue-200 border border-blue-700/60' },
  { id: 'conflicts', label: 'Conflict Center', icon: AlertTriangle, badge: '3 Alerts', badgeColor: 'bg-red-950/80 text-red-300 border border-red-800/80' },
  { id: 'impact', label: 'Train Status & Impact', icon: TrainTrack, badge: 'Live COA', badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' },
];

export const WORKFLOW_STEPS = [
  { id: 'dashboard', label: 'Overview', module: 'dashboard' },
  { id: 'pipeline', label: '7-Stage Blueprint', module: 'pipeline' },
  { id: 'map', label: '1. Railway Map & Infra', module: 'map' },
  { id: 'requests', label: '2. Maintenance Hub', module: 'requests' },
  { id: 'planner', label: '3. AI Optimizer', module: 'planner' },
  { id: 'gantt', label: '4. Master Schedule', module: 'gantt' },
  { id: 'safety', label: '5. Safety & Sanction', module: 'safety' },
  { id: 'simulation', label: '6. Re-planner & Audit', module: 'simulation' },
  { id: 'advanced', label: '7. Advanced Capabilities', module: 'advanced' },
];

export default function Header({
  activeModule,
  setActiveModule,
  currentUser,
  onLogout,
  onOpenFinalPlan,
  isPlanApproved,
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.module === activeModule);
  const nextStep = WORKFLOW_STEPS[currentStepIndex + 1];

  return (
    <header className="sticky top-0 z-50 bg-[#081021]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Operations Control Bar */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Brand & Division */}
        <div className="flex items-center gap-3">
          <IndianRailwaysLogo size={42} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                BlockNexa
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-800">
                CRIS • Indian Railways
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Control Office Link Active
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Central Railway • Bhusawal Division [BSL]</span>
              <span className="text-slate-600">•</span>
              <span className="hidden lg:inline text-slate-400">IGP — MMR — CSN — BSL Quad Mainline</span>
            </div>
          </div>
        </div>

        {/* Live Feeds status & Clock */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Data Feed Indicators */}
          <div className="hidden xl:flex items-center gap-2.5 text-[11px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium">Feeds:</span>
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> TMS
            </span>
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> TDMS
            </span>
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> SMMS
            </span>
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> COA
            </span>
          </div>

          {/* Live FastAPI Backend Status Indicator */}
          <div
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono shadow-sm"
            title="FastAPI Backend Live on http://127.0.0.1:8000 • Operational Research & ML Engines Active"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-300 font-semibold hidden sm:inline">Backend: Online</span>
            <span className="text-slate-400 text-[10px] hidden md:inline">(Port 8000)</span>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700/80 text-white font-mono text-xs sm:text-sm">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="tracking-wider font-semibold">{timeStr || '09:56:14 IST'}</span>
          </div>

          {/* Controller Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {currentUser?.name || 'Section Controller'}
              </div>
              <div className="text-[10px] text-blue-400 font-medium">
                {currentUser?.dept || 'Control Office BSL'}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out to Login Page"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-900/40 text-slate-300 hover:text-red-300 border border-slate-700/60 hover:border-red-700/50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs - ONLY the 9 essential modules requested */}
      <div className="max-w-[1720px] mx-auto px-2 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 py-1.5">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{mod.label}</span>
                {mod.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      mod.badgeColor || (isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400')
                    }`}
                  >
                    {mod.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Guided Workflow Step Controller Action */}
        <div className="hidden 2xl:flex items-center gap-2 pl-4 py-1.5 shrink-0">
          {isPlanApproved ? (
            <button
              onClick={onOpenFinalPlan}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Sanctioned Order Active</span>
            </button>
          ) : nextStep ? (
            <button
              onClick={() => setActiveModule(nextStep.module)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm border border-blue-500/40 transition cursor-pointer"
            >
              <span>Next: {nextStep.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenFinalPlan}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Review Final Plan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
