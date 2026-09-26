import React from 'react';
import IndianRailwaysLogo from '../common/IndianRailwaysLogo';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileCheck2,
  Stamp,
  Calendar,
  Clock,
  Layers,
  Train,
} from 'lucide-react';
import { DIVISION_INFO, AI_OPTIMIZED_PLAN_RESULT } from '../../data/railwayData';

export default function FinalPlanModal({ isOpen, onClose, currentUser }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Official Railway Block Sanction Permit
              </h2>
              <p className="text-xs text-slate-400">
                Authorized under G&SR Section 15.06 & Operating Manual • Central Railway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-inner font-sans border-2 border-slate-300 space-y-5">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <IndianRailwaysLogo size={64} />
              <div>
                <div className="text-[11px] font-bold tracking-widest text-slate-700 uppercase">
                  GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
                </div>
                <div className="text-lg font-extrabold text-slate-950 tracking-tight">
                  CENTRAL RAILWAY — BHUSAWAL DIVISION
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  OFFICE OF THE SENIOR DIVISIONAL OPERATING MANAGER (COACHING & FREIGHT)
                </div>
              </div>
            </div>

            {/* QR Code & Sanction Stamp */}
            <div className="flex items-center gap-3 sm:text-right">
              <div className="hidden sm:block text-xs font-mono text-slate-600">
                <div>SANCTION NO:</div>
                <div className="font-bold text-slate-950">BSL-BLK-2026-0926</div>
                <div className="text-[10px] text-emerald-700 font-bold">DIGITALLY VERIFIED</div>
              </div>
              <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-300">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Block Sanction Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">SECTION</span>
              <span className="font-bold text-slate-900">Manmad (MMR) — Chalisgaon (CSN)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">CORRIDOR / LINE</span>
              <span className="font-bold text-slate-900">Down Main Line (Km 284/10 to 286/10)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">SANCTIONED WINDOW</span>
              <span className="font-bold text-purple-900">10:45 to 13:45 IST (3h 00m)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">CAUTION ORDER</span>
              <span className="font-bold text-amber-900">SR 30 km/h (48 Hours)</span>
            </div>
          </div>

          {/* Multi-Department Joint Works Endorsement */}
          <div className="text-xs space-y-2">
            <div className="font-bold text-slate-950 uppercase tracking-wider text-[11px] border-b pb-1">
              Synchronized Multi-Departmental Works:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-amber-50/50">
                <span className="font-bold text-amber-900 block">1. Engineering (TMS)</span>
                <span className="text-slate-700 text-[11px]">BCM Ballast Screening & IMR Rail Weld rectification at Km 284/12. Gang 4.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-blue-50/50">
                <span className="font-bold text-blue-900 block">2. Traction (TDMS)</span>
                <span className="text-slate-700 text-[11px]">Contact wire renewal & Cantilever #32 dropper replacement under 25kV power block.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block">3. S&T (SMMS)</span>
                <span className="text-slate-700 text-[11px]">Point Machine 104A throw time calibration and electronic interlocking test.</span>
              </div>
            </div>
          </div>

          {/* BDMS Memo & COA Slot Reservation Details */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs space-y-1 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-800">
              <span><strong>BDMS Disconnection Memo:</strong> #BDMS/BSL/2026/0926-08</span>
              <span className="text-emerald-700 font-bold">STATUS: DISPATCHED & ACKNOWLEDGED</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-800">
              <span><strong>COA Timetable Path Reservation:</strong> #COA/RES/DN-MAIN/1045-1345</span>
              <span className="text-purple-700 font-bold">STATUS: LOCKED IN LIVE TIMETABLE</span>
            </div>
          </div>

          {/* Train Regulation Orders */}
          <div className="text-xs space-y-1.5">
            <div className="font-bold text-slate-950 uppercase tracking-wider text-[11px] border-b pb-1">
              Approved Train Regulation & Precedence Orders:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-800 text-[11px]">
              <li><strong>Train No. 22222 Vande Bharat:</strong> Normal priority dispatch before block possession at 10:32 CSN (0 min delay).</li>
              <li><strong>Train No. 12951 Mumbai Rajdhani:</strong> Diverted via Chalisgaon Bi-directional Middle Loop 3 with 40 km/h turnout (+4 min only).</li>
              <li><strong>CONCOR Freight Rake FRT-CNTR-8812:</strong> Regulated at Odha Goods Loop for 45 mins.</li>
              <li><strong>Train No. 12137 Punjab Mail:</strong> Cleared post block at 13:50 with margin recovery to Jalgaon.</li>
            </ul>
          </div>

          {/* Signatures & Stamps */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">ISSUED BY SYSTEM:</div>
              <div className="font-bold text-slate-900">BlockNexa AI Optimization Engine v4.2</div>
              <div className="text-[10px] font-mono text-slate-600">CRIS Gateway Token: SIL4-0x9F41B28E-BSL</div>
            </div>

            <div className="sm:text-right border-l sm:border-l-0 sm:border-r border-slate-200 pl-3 sm:pl-0 sm:pr-3">
              <div className="text-[10px] text-slate-500 uppercase font-bold">SANCTIONING CONTROLLER:</div>
              <div className="font-bold text-slate-950 text-sm">{currentUser?.name || DIVISION_INFO.controllerOnDuty}</div>
              <div className="text-[11px] text-slate-700">{currentUser?.dept || DIVISION_INFO.designation}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-600 flex flex-col items-center justify-center text-red-600 font-bold text-[9px] rotate-[-8deg] p-1 text-center">
                <span>GOVT OF INDIA</span>
                <span className="font-extrabold text-[10px]">SANCTIONED</span>
                <span>BSL DIV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Transmitted to Station Masters at Manmad, Chalisgaon, and Jalgaon.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
