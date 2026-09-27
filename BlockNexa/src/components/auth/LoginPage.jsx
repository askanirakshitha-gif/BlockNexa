import React, { useState } from 'react';
import IndianRailwaysLogo from '../common/IndianRailwaysLogo';
import { ArrowRight, ShieldCheck, Lock, Mail, Train, CheckCircle2 } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: "Admin (Railways)",
    email: "sr.dom@railways.gov.in",
    password: "Password@123",
    color: "border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400",
    badgeColor: "bg-blue-100 text-blue-800",
    dept: "Divisional Operating HQ",
    name: "Dr. A. K. Singhal, IRTS (Sr. DOM)",
  },
  {
    role: "Section Controller",
    email: "controller.bsl@railways.gov.in",
    password: "Password@123",
    color: "border-sky-300 text-sky-800 hover:bg-sky-50 hover:border-sky-400",
    badgeColor: "bg-sky-100 text-sky-800",
    dept: "Control Office (Coaching & Freight)",
    name: "Rajesh K. Sharma (Chief Controller)",
  },
  {
    role: "Engineering (P-Way)",
    email: "den.track@railways.gov.in",
    password: "Password@123",
    color: "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400",
    badgeColor: "bg-blue-100 text-blue-800",
    dept: "Track Management System (TMS)",
    name: "V. M. Rao (Sr. DEN / Track)",
  },
  {
    role: "S&T (Signal)",
    email: "dste.sig@railways.gov.in",
    password: "Password@123",
    color: "border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-800",
    dept: "Signal Maintenance System (SMMS)",
    name: "Priya S. Verma (Sr. DSTE)",
  },
  {
    role: "TRD (OHE)",
    email: "deetr.ohe@railways.gov.in",
    password: "Password@123",
    color: "border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400",
    badgeColor: "bg-amber-100 text-amber-800",
    dept: "Traction Distribution (TDMS)",
    name: "Anand Kulkarni (Sr. DEE/TRD)",
  },
  {
    role: "Admin (123)",
    email: "admin@railways.gov.in",
    password: "123",
    color: "border-slate-300 text-slate-700 hover:bg-slate-100",
    badgeColor: "bg-slate-100 text-slate-800",
    dept: "System Superadmin",
    name: "Control Room Super Admin",
  },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your official railway email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userObj = selectedRole || {
        role: "Section Controller",
        email: email,
        dept: "Control Office (Coaching & Freight)",
        name: "Railway Controller",
      };
      onLogin(userObj);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full railway-plus-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background subtle radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b172a]/70 via-[#0b172a]/90 to-[#070d19] pointer-events-none" />

      {/* Top Header with Indian Railways Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center mb-8">
        <IndianRailwaysLogo size={84} className="mb-4" />
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white m-0">
          BlockNexa
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 tracking-wide">
          Indian Railways — AI-Powered Automatic Railway Block Planning System
        </p>
      </div>

      {/* Center White Login Card matching screenshot */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-6 tracking-tight">
          Divisional Official Login
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="font-semibold">Notice:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Official Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@railways.gov.in"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 placeholder-slate-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 placeholder-slate-400 tracking-widest transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-lg bg-[#0c2340] hover:bg-[#123158] text-white text-sm font-semibold flex items-center justify-center gap-2 transition duration-150 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Selected demo account hint */}
        {selectedRole && (
          <div className="mt-4 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Selected: <strong>{selectedRole.name}</strong></span>
            </div>
            <span className="text-[10px] bg-blue-200/60 px-2 py-0.5 rounded font-mono shrink-0">
              {selectedRole.deptCode || selectedRole.role.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Quick Demo Accounts matching screenshot */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            QUICK DEMO ACCOUNTS
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedRole?.role === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition duration-150 cursor-pointer ${
                    acc.color
                  } ${isSelected ? 'ring-2 ring-blue-500 font-semibold shadow-sm' : ''}`}
                >
                  {acc.role}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Click any demo profile to auto-fill credentials, then sign in
          </p>
        </div>
      </div>

      {/* Footer security badge */}
      <div className="relative z-10 mt-6 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>CRIS Security Gateway • 256-Bit Encrypted Section Control Channel</span>
      </div>
    </div>
  );
}
