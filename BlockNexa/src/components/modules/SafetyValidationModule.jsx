import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Lock,
  Stamp,
  Printer,
  Download,
  KeyRound,
  UserCheck,
  Train,
  Wrench,
  Zap,
  Radio,
  Sparkles,
} from 'lucide-react';
import { DIVISION_INFO } from '../../data/railwayData';

export default function SafetyValidationModule({
  currentUser,
  isPlanApproved,
  setIsPlanApproved,
  onOpenFinalPlan,
}) {
  const [corridorChecked, setCorridorChecked] = useState(true);
  const [trainConflictChecked, setTrainConflictChecked] = useState(true);
  const [resourceChecked, setResourceChecked] = useState(true);
  const [safetyVerified, setSafetyVerified] = useState(true);

  const [controllerName, setControllerName] = useState(
    currentUser?.name || DIVISION_INFO.controllerOnDuty
  );
  const [controllerPin, setControllerPin] = useState('8842');
  const [approvalNotes, setApprovalNotes] = useState(
    'All TMS, TDMS and SMMS requirements coordinated. Caution order SR 30 km/h notified in FOIS / COA.'
  );

  const allChecksPassed =
    corridorChecked && trainConflictChecked && resourceChecked && safetyVerified;

  const handleApprove = (e) => {
    e.preventDefault();
    if (!allChecksPassed) return;
    setIsPlanApproved(true);
    onOpenFinalPlan();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              Module 09 • FINAL SAFETY GATE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Safety Validation & Human Controller Approval</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory multi-tier verification before granting corridor possession and issuing Divisional Caution Orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isPlanApproved ? (
            <button
              onClick={onOpenFinalPlan}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>View Sanctioned Block Permit (Official Notice)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800/60">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pending Controller Sign-Off</span>
            </div>
          )}
        </div>
      </div>

      {/* Safety Gate Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Corridor Check */}
        <div
          onClick={() => setCorridorChecked(!corridorChecked)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            corridorChecked
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-md'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Corridor Check
            </span>
            <span
              className={`p-1 rounded-full ${
                corridorChecked ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Traction Power & Track Isolation
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            OHE 25kV power block disconnected. Section isolated and earth discharge rods deployed at Km 284/10 and 286/10.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
            {corridorChecked ? '✓ Verified Safe for Gang Entry' : '✗ Pending Verification'}
          </div>
        </div>

        {/* 2. Train Conflict Check */}
        <div
          onClick={() => setTrainConflictChecked(!trainConflictChecked)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            trainConflictChecked
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-md'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Train Conflict Check
            </span>
            <span
              className={`p-1 rounded-full ${
                trainConflictChecked ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Zero Spatial Collision Guarantee
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            COA coaching timetable cleared. 22222 Vande Bharat passed, 12951 Rajdhani loop path locked with interlocking override.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
            {trainConflictChecked ? '✓ Absolute Overlap Zero Collision' : '✗ Pending Clearance'}
          </div>
        </div>

        {/* 3. Resource Check */}
        <div
          onClick={() => setResourceChecked(!resourceChecked)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            resourceChecked
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-md'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Resource Check
            </span>
            <span
              className={`p-1 rounded-full ${
                resourceChecked ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Field Gang & Machinery On Site
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            SSE/P-Way Gang 4 (18 men), Tower Wagon TW-08, BCM and Tamping CSM-952 stationed at siding awaiting signal.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
            {resourceChecked ? '✓ 100% Gang & Machine Ready' : '✗ Pending Mobilization'}
          </div>
        </div>

        {/* 4. Safety Validation Certificate */}
        <div
          onClick={() => setSafetyVerified(!safetyVerified)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            safetyVerified
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-md'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4. Safety Validation
            </span>
            <span
              className={`p-1 rounded-full ${
                safetyVerified ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Safety Integrity Level (SIL-4)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certified compliant with Indian Railways General & Subsidiary Rules (G&SR) Chapter XV and Block Working Manual.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
            {safetyVerified ? '✓ SIL-4 Cryptographic Hash OK' : '✗ Audit Warning'}
          </div>
        </div>
      </div>

      {/* Controller Sign-Off Form & Caution Order Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sign-off Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Divisional Controller Electronic Approval & Sanction
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              Authorized Signatory
            </span>
          </div>

          <form onSubmit={handleApprove} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Controller Name & Designation
                </label>
                <input
                  type="text"
                  required
                  value={controllerName}
                  onChange={(e) => setControllerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Digital Authorization PIN / Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={controllerPin}
                    onChange={(e) => setControllerPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Caution Order Remarks & Traffic Dispatch Endorsement
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Stamp className="w-4 h-4 text-emerald-400" />
                <span>Statutory Divisional Declaration:</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                By clicking below, I officially sanction corridor possession for <strong>Block #BLK-SCH-01</strong> on Manmad — Chalisgaon Down Line from 10:45 to 13:45 IST. Emergency caution orders and speed restriction notifications will be automatically transmitted to all Station Masters and Section Traction Power Controllers.
              </p>
            </div>

            <button
              type="submit"
              disabled={!allChecksPassed}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
                isPlanApproved
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : allChecksPassed
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 text-white shadow-emerald-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isPlanApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Block Sanction Active • View Official Permit Document</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-yellow-300" />
                  <span>Sanction & Transmit Divisional Block Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Caution Order Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Divisional Caution Order Notice
            </h3>
            <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800/60">
              SR 30 KM/H
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="text-center font-bold text-white pb-2 border-b border-slate-800">
              CENTRAL RAILWAY • BHUSAWAL DIVISION
              <div className="text-[10px] text-slate-500 font-normal">
                OFFICE OF SR. DIVISIONAL OPERATING MANAGER
              </div>
            </div>

            <div className="text-[11px] space-y-1">
              <div><strong>MEMO NO:</strong> BSL/OPT/BLK/2026/0926</div>
              <div><strong>SECTION:</strong> MMR — CSN (DOWN LINE)</div>
              <div><strong>LOCATION:</strong> Km 284/10 to 286/10</div>
              <div><strong>RESTRICTION:</strong> Speed Restriction 30 km/h</div>
              <div><strong>VALIDITY:</strong> 26/09/2026 13:45 to 28/09/2026 13:45</div>
              <div><strong>AUTHORITY:</strong> {controllerName}</div>
              <div><strong>SECURITY TOKEN:</strong> SIL4-0x9F41B28E</div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400">
              ✓ Synchronized to COA & FOIS Real-Time Loco Displays
            </div>
          </div>

          {isPlanApproved && (
            <button
              onClick={onOpenFinalPlan}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Print Official Block Sanction Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
