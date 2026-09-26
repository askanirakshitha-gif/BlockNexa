import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Zap,
  Radio,
  Sliders,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  CheckSquare,
  Square,
  Layers,
  ArrowRight,
  ShieldAlert,
  HardHat,
  X,
  MapPin,
  BarChart3,
  Flame,
  FileText,
  Info,
  ChevronRight,
  TrendingUp,
  Database,
  Cpu,
  Activity,
  ExternalLink,
  Gauge,
  Thermometer,
  Waves,
} from 'lucide-react';
import { HUGGINGFACE_DATASET_META } from '../../data/huggingfaceMaintenanceData';

export default function MaintenanceRequestsModule({
  requests,
  onAddRequest,
  onNavigate,
  selectedRequestIds,
  setSelectedRequestIds,
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, TMS, TDMS, SMMS, BDMS
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [failureTypeFilter, setFailureTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectingCpiReq, setInspectingCpiReq] = useState(null);
  const [inspectingHfTelemetryReq, setInspectingHfTelemetryReq] = useState(null);

  // Form state for new request modal
  const [newDept, setNewDept] = useState('Engineering (TMS)');
  const [newSubDept, setNewSubDept] = useState('P-Way / Track');
  const [newDefect, setNewDefect] = useState('');
  const [newLocation, setNewLocation] = useState('MMR - CSN (Manmad - Chalisgaon)');
  const [newLine, setNewLine] = useState('Down Main Line');
  const [newLineCode, setNewLineCode] = useState('DN-MAIN');
  const [newChainage, setNewChainage] = useState('Km 290/10 - 291/00');
  const [newKmStart, setNewKmStart] = useState('290.5');
  const [newKmEnd, setNewKmEnd] = useState('291.0');
  const [newSeverity, setNewSeverity] = useState('Major');
  const [newDuration, setNewDuration] = useState('2h 30m');
  const [newMachinery, setNewMachinery] = useState('Duomatic Tamping Machine');
  const [newGang, setNewGang] = useState('SSE/P-Way Gang #2');

  const emergencyRequests = requests.filter((r) => r.isEmergencySafetyBypass || r.severity === 'Emergency');

  const filteredRequests = requests.filter((req) => {
    if (activeTab !== 'ALL' && req.deptCode !== activeTab) return false;
    if (severityFilter !== 'ALL' && req.severity !== severityFilter) return false;
    if (failureTypeFilter !== 'ALL' && req.failureType !== failureTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        req.defect.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.dept.toLowerCase().includes(q) ||
        (req.failureType && req.failureType.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const toggleSelect = (id) => {
    if (selectedRequestIds.includes(id)) {
      setSelectedRequestIds(selectedRequestIds.filter((item) => item !== id));
    } else {
      setSelectedRequestIds([...selectedRequestIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRequestIds.length === filteredRequests.length) {
      setSelectedRequestIds([]);
    } else {
      setSelectedRequestIds(filteredRequests.map((r) => r.id));
    }
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newDefect.trim()) return;

    const deptCode = newDept.includes('TMS')
      ? 'TMS'
      : newDept.includes('TDMS')
      ? 'TDMS'
      : newDept.includes('SMMS')
      ? 'SMMS'
      : 'BDMS';

    const reqObj = {
      id: `REQ-${deptCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      dept: newDept,
      deptCode: deptCode,
      subDept: newSubDept,
      defect: newDefect,
      location: newLocation,
      line: newLine,
      lineCode: newLineCode,
      chainage: newChainage,
      spatialRef: {
        division: 'BSL',
        lineCode: newLineCode,
        chainageStartKm: parseFloat(newKmStart) || 280.0,
        chainageEndKm: parseFloat(newKmEnd) || 281.0,
        isolationZone: 'ISO-MMR-CSN-04',
      },
      severity: newSeverity,
      severityLevel:
        newSeverity === 'Emergency'
          ? 4
          : newSeverity === 'Critical'
          ? 3
          : newSeverity === 'Major'
          ? 2
          : 1,
      requestedDuration: newDuration,
      durationMins: 150,
      requestedWindow: 'Pending Slotting',
      priorityScore:
        newSeverity === 'Emergency' ? 96 : newSeverity === 'Critical' ? 88 : 72,
      cpiBreakdown: {
        sDefect: newSeverity === 'Emergency' ? 98 : newSeverity === 'Critical' ? 88 : 70,
        dOverdue: 75,
        cAsset: 85,
        tTraffic: 80,
        w1: 0.40,
        w2: 0.25,
        w3: 0.20,
        w4: 0.15,
        calculatedCPI: newSeverity === 'Emergency' ? 94.5 : 81.2,
      },
      isEmergencySafetyBypass: newSeverity === 'Emergency',
      gangRequired: newGang,
      machinery: newMachinery,
      tqi: deptCode === 'TMS' ? 44.0 : null,
      status: newSeverity === 'Emergency' ? 'EMERGENCY SAFETY BYPASS QUEUE' : 'Pending AI Slotting',
      coordinatedWith: [],
      canJointBlock: true,
    };

    onAddRequest(reqObj);
    setIsModalOpen(false);
    setNewDefect('');
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Emergency':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Major':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getDeptBadge = (code) => {
    switch (code) {
      case 'TMS':
        return {
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
          label: 'Engineering (TMS)',
          icon: HardHat,
        };
      case 'TDMS':
        return {
          bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
          label: 'Traction (TDMS)',
          icon: Zap,
        };
      case 'SMMS':
        return {
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
          label: 'S&T (SMMS)',
          icon: Radio,
        };
      case 'BDMS':
        return {
          bg: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
          label: 'Demands (BDMS)',
          icon: FileText,
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          label: code,
          icon: Wrench,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Module 02 • INGESTION HUB
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Maintenance Requests Hub</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
                TMS • SMMS • TDMS • BDMS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Harmonized linear referencing, AI Composite Priority Index (CPI) scoring, and hard safety emergency bypasses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-blue-900/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Requisition (BDMS)</span>
          </button>

          {selectedRequestIds.length > 0 && (
            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-900/40 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Bundle Selected ({selectedRequestIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Open Source Hugging Face Dataset Attribution & Telemetry Pipeline Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/40 shrink-0">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  Open Source Railway Telemetry Ingested
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  {HUGGINGFACE_DATASET_META.platform}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {HUGGINGFACE_DATASET_META.license}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real failure records & sensor telemetry ingested directly from{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-950 text-blue-300 font-mono text-[11px] border border-slate-800">
                  {HUGGINGFACE_DATASET_META.datasetId}
                </code>
                . Filtered for <strong>Central Railway (CR)</strong> with <code className="text-emerald-400 font-mono">maintenance_required == 1</code> and harmonized into Bhusawal Division quad corridor linear chainage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono font-extrabold text-blue-400">100,000 Records Total</div>
              <div className="text-[10px] text-slate-400 font-mono">CC BY 4.0 Open Source</div>
            </div>
            <a
              href={HUGGINGFACE_DATASET_META.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>Hugging Face Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Features Ingested */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Track Defect</span>
            <span className="text-amber-400 font-bold font-mono">rail_wear_mm</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Track Vibration</span>
            <span className="text-cyan-400 font-bold font-mono">vibration_level</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">P-Way Ballast</span>
            <span className="text-emerald-400 font-bold font-mono">ballast_condition</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Axle Box</span>
            <span className="text-rose-400 font-bold font-mono">bearing_temp_c</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">S&T System</span>
            <span className="text-indigo-400 font-bold font-mono">signal_status</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">ML Risk Score</span>
            <span className="text-purple-400 font-bold font-mono">risk_score (0-1)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Overdue Cycle</span>
            <span className="text-yellow-400 font-bold font-mono">last_maint_days</span>
          </div>
        </div>
      </div>

      {/* Hard Safety Rules: Emergency Corridor Intervention Queue Banner */}
      {emergencyRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/80 border-2 border-red-500/70 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-600/30 text-red-400 border border-red-500/50 animate-pulse">
                <Flame className="w-5 h-5 text-red-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Hard Safety Rule: Emergency Corridor Intervention Queue
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                    BYPASS ACTIVE
                  </span>
                </div>
                <p className="text-xs text-red-200 mt-0.5">
                  Safety-critical defects bypass normal batch schedules and route directly to the emergency corridor intervention queue.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-lg shadow-red-950"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Grant Emergency Power Block</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {emergencyRequests.map((emReq) => (
              <div
                key={emReq.id}
                className="p-3 rounded-xl bg-slate-950 border border-red-800/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400">{emReq.id}</span>
                    <span className="font-bold text-white truncate">{emReq.defect}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {emReq.location} • {emReq.chainage}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-extrabold text-red-400">
                    CPI: {emReq.priorityScore}
                  </div>
                  <div className="text-[10px] text-slate-400">{emReq.requestedDuration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CPI Mathematical Formula Explanation Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">
              AI Composite Priority Index (CPI) Formulation
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            CPI = w1·S_defect + w2·D_overdue + w3·C_asset + w4·T_traffic
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold">w1 = 40%:</span> S_defect (Technical severity)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-blue-400 font-bold">w2 = 25%:</span> D_overdue (Time past deadline)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold">w3 = 20%:</span> C_asset (Asset criticality)
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">w4 = 15%:</span> T_traffic (Throughput / GMT)
          </div>
        </div>
      </div>

      {/* Department Tabs & Filter Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-lg">
        {/* Department Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Feeds ({requests.length})
            </button>

            <button
              onClick={() => setActiveTab('TMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TMS'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Engineering (TMS)</span>
            </button>

            <button
              onClick={() => setActiveTab('TDMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TDMS'
                  ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Traction (TDMS)</span>
            </button>

            <button
              onClick={() => setActiveTab('SMMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SMMS'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>S&T (SMMS)</span>
            </button>

            <button
              onClick={() => setActiveTab('BDMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'BDMS'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Demands (BDMS)</span>
            </button>
          </div>

          {/* Quick Select All */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer transition"
            >
              {selectedRequestIds.length === filteredRequests.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              <span>Select All Visible</span>
            </button>
          </div>
        </div>

        {/* Search & Severity Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by defect, station, chainage or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0">Severity:</span>
            {['ALL', 'Emergency', 'Critical', 'Major', 'Routine'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Failure Category Filter (Hugging Face Open Source Ground Truth) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Failure Class (HF Ground Truth):</span>
          </span>
          {['ALL', 'Track Defect', 'Signal Failure', 'Bearing Failure', 'Brake Failure', 'Wheel Defect'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFailureTypeFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                failureTypeFilter === cat
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Classes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div className="space-y-3">
        {filteredRequests.map((req) => {
          const dept = getDeptBadge(req.deptCode);
          const isSelected = selectedRequestIds.includes(req.id);

          return (
            <div
              key={req.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-blue-500/70 shadow-lg shadow-blue-950/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => toggleSelect(req.id)}
                    className="mt-0.5 sm:mt-0 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-blue-300 border border-slate-800">
                      {req.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${dept.bg}`}
                    >
                      <dept.icon className="w-3.5 h-3.5" />
                      <span>{dept.label}</span>
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                        req.severity
                      )}`}
                    >
                      {req.severity}
                    </span>
                    {req.failureType && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/90 text-cyan-300 border border-slate-700 flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>{req.failureType}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Linear Referencing Coordinate */}
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/50">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>
                      ({req.spatialRef?.division || 'BSL'}, {req.lineCode || 'DN-MAIN'}, Km {req.spatialRef?.chainageStartKm || '284.2'} - {req.spatialRef?.chainageEndKm || '286.0'})
                    </span>
                  </div>

                  {/* Open Source IoT Telemetry Button */}
                  {req.rawHfFeatures && (
                    <button
                      onClick={() => setInspectingHfTelemetryReq(req)}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/80 hover:bg-cyan-900 transition cursor-pointer"
                      title="Inspect raw open-source sensor telemetry"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>IoT Sensors</span>
                    </button>
                  )}

                  {/* Explainable CPI Score Button */}
                  <button
                    onClick={() => setInspectingCpiReq(req)}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800 hover:bg-purple-900 transition cursor-pointer"
                    title="Click to view explainable CPI breakdown"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>CPI: {req.priorityScore}</span>
                  </button>
                </div>
              </div>

              {/* Defect Description */}
              <div className="mb-3">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                  {req.defect}
                </h3>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Location:</strong> {req.location}</span>
                  <span><strong>Track:</strong> {req.line}</span>
                  <span><strong>Chainage:</strong> {req.chainage}</span>
                  <span><strong>Duration:</strong> {req.requestedDuration}</span>
                </div>
              </div>

              {/* Machinery, Gang, and Joint Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Allocated Gang</span>
                  <span className="text-slate-300 font-medium">{req.gangRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Machinery / Rolling Plant</span>
                  <span className="text-slate-300 font-medium">{req.machinery}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Joint Bundling</span>
                    <span className={req.canJointBlock ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {req.canJointBlock ? 'Compatible for Mega Block' : 'Standalone Possession'}
                    </span>
                  </div>
                  {req.canJointBlock && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      Multi-Dept
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CPI Factor Inspection Drawer / Modal */}
      {inspectingCpiReq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Explainable CPI Breakdown: {inspectingCpiReq.id}
                </h3>
              </div>
              <button
                onClick={() => setInspectingCpiReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <strong>Defect:</strong> {inspectingCpiReq.defect}
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 text-xs text-purple-200 font-mono">
              Composite Priority Index: <strong>{inspectingCpiReq.priorityScore} / 100</strong>
            </div>

            {/* 4 Factor Cards */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white">S_defect (Technical Severity):</strong>
                  <div className="text-[11px] text-slate-400">IMR ultrasonic flaw, structural hazard</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-purple-300">
                    {inspectingCpiReq.cpiBreakdown?.sDefect || 90} / 100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Weight: 40%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white">D_overdue (Time Elapsed Past Deadline):</strong>
                  <div className="text-[11px] text-slate-400">Days past mandatory regulatory cycle</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-300">
                    {inspectingCpiReq.cpiBreakdown?.dOverdue || 85} / 100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Weight: 25%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white">C_asset (Asset Criticality Index):</strong>
                  <div className="text-[11px] text-slate-400">Mainline high-speed track vs loop line</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-cyan-300">
                    {inspectingCpiReq.cpiBreakdown?.cAsset || 95} / 100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Weight: 20%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white">T_traffic (Throughput / Density Penalty):</strong>
                  <div className="text-[11px] text-slate-400">Gross Million Tonnes (GMT) & passenger train volume</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-300">
                    {inspectingCpiReq.cpiBreakdown?.tTraffic || 88} / 100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Weight: 15%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingCpiReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hugging Face Open-Source IoT Telemetry Inspection Modal */}
      {inspectingHfTelemetryReq && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/40">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>IoT Telemetry: {inspectingHfTelemetryReq.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40">
                      HF: {HUGGINGFACE_DATASET_META.datasetId}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Field Telemetry & ML Risk Prediction Ground Truth (Train #{inspectingHfTelemetryReq.hfTrainId || 'N/A'})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectingHfTelemetryReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context & Location */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Defect Description:</span>
                <span className="font-bold text-white">{inspectingHfTelemetryReq.defect}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Harmonized Bhusawal LRS:</span>
                <span className="font-mono text-cyan-300">
                  {inspectingHfTelemetryReq.location} • {inspectingHfTelemetryReq.chainage} ({inspectingHfTelemetryReq.line})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hugging Face Failure Class:</span>
                <span className="font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                  {inspectingHfTelemetryReq.rawHfFeatures?.failure_type || inspectingHfTelemetryReq.failureType || 'N/A'} (Severity: {inspectingHfTelemetryReq.rawHfFeatures?.failure_severity || inspectingHfTelemetryReq.severity})
                </span>
              </div>
            </div>

            {/* Telemetry Sensor Metrics Grid */}
            {inspectingHfTelemetryReq.rawHfFeatures && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* 1. Rail Wear */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rail Wear (mm)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Threshold: 5.0mm</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-amber-300">
                    {inspectingHfTelemetryReq.rawHfFeatures.rail_wear_mm ?? 'N/A'} mm
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (inspectingHfTelemetryReq.rawHfFeatures.rail_wear_mm || 0) > 4.5
                          ? 'bg-red-500'
                          : 'bg-amber-400'
                      }`}
                      style={{
                        width: `${Math.min(100, ((inspectingHfTelemetryReq.rawHfFeatures.rail_wear_mm || 0) / 7.0) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 2. Track Vibration */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Track Vibration</span>
                    </span>
                    <span className="text-[10px] text-slate-500">m/s²</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-cyan-300">
                    {inspectingHfTelemetryReq.rawHfFeatures.track_vibration_level ?? 'N/A'} m/s²
                  </div>
                  <div className="text-[10px] text-slate-400">
                    OMS-2000 Acceleration metric
                  </div>
                </div>

                {/* 3. Axle Bearing Temperature */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      <span>Axle Bearing Temp</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Alert &gt; 70°C</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-rose-300">
                    {inspectingHfTelemetryReq.rawHfFeatures.bearing_temperature_c ?? 'N/A'} °C
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hot Axle Box Detector (HABD)
                  </div>
                </div>

                {/* 4. Ballast Condition */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ballast Condition</span>
                    <span className="text-[10px] text-slate-500">P-Way</span>
                  </div>
                  <div
                    className={`text-base font-bold ${
                      inspectingHfTelemetryReq.rawHfFeatures.ballast_condition === 'Poor'
                        ? 'text-red-400'
                        : inspectingHfTelemetryReq.rawHfFeatures.ballast_condition === 'Moderate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {inspectingHfTelemetryReq.rawHfFeatures.ballast_condition ?? 'Normal'}
                  </div>
                  <div className="text-[10px] text-slate-400">Cushion & packing status</div>
                </div>

                {/* 5. Signal System Status */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Signal System</span>
                    <span className="text-[10px] text-slate-500">S&T SMMS</span>
                  </div>
                  <div
                    className={`text-base font-bold ${
                      inspectingHfTelemetryReq.rawHfFeatures.signal_system_status === 'Critical_Delay'
                        ? 'text-red-400'
                        : inspectingHfTelemetryReq.rawHfFeatures.signal_system_status === 'Degraded'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {inspectingHfTelemetryReq.rawHfFeatures.signal_system_status ?? 'Normal'}
                  </div>
                  <div className="text-[10px] text-slate-400">Axle counter & point circuit</div>
                </div>

                {/* 6. ML Risk Score */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-semibold">HF Model Risk Score</span>
                    <span className="text-[10px] text-purple-400 font-mono">0.0 - 1.0</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-purple-200">
                    {inspectingHfTelemetryReq.rawHfFeatures.risk_score ?? '0.85'}
                  </div>
                  <div className="text-[10px] text-purple-300">
                    Synthesized into BlockNexa CPI score ({inspectingHfTelemetryReq.priorityScore})
                  </div>
                </div>
              </div>
            )}

            {/* Additional Parameters */}
            {inspectingHfTelemetryReq.rawHfFeatures && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Operating Speed</span>
                  <span className="font-mono text-white font-bold">
                    {inspectingHfTelemetryReq.rawHfFeatures.operational_speed_kmh} km/h
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Curvature & Gradient</span>
                  <span className="font-mono text-white font-bold">
                    {inspectingHfTelemetryReq.rawHfFeatures.track_curvature_deg}° / {inspectingHfTelemetryReq.rawHfFeatures.gradient_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Last Maintenance</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {inspectingHfTelemetryReq.rawHfFeatures.last_maintenance_days} days ago
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sensor Health Index</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {(Number(inspectingHfTelemetryReq.rawHfFeatures.sensor_health_index || 0.9) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <a
                href={HUGGINGFACE_DATASET_META.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <span>Dataset Repository on Hugging Face</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setInspectingHfTelemetryReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Requisition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Submit Field Maintenance Requisition (BDMS)</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => {
                      setNewDept(e.target.value);
                      if (e.target.value.includes('TMS')) setNewSubDept('P-Way / Track');
                      else if (e.target.value.includes('TDMS')) setNewSubDept('OHE / Catenary');
                      else if (e.target.value.includes('SMMS')) setNewSubDept('Signalling / Points');
                      else setNewSubDept('Bridge / Monsoon Demands');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Engineering (TMS)">Engineering (TMS)</option>
                    <option value="Traction (TDMS)">Traction / OHE (TDMS)</option>
                    <option value="S&T (SMMS)">Signalling & Telecom (SMMS)</option>
                    <option value="Demands (BDMS)">Block Demands (BDMS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Emergency">Emergency (Immediate Safety Bypass)</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Defect Description / Activity</label>
                <input
                  type="text"
                  required
                  value={newDefect}
                  onChange={(e) => setNewDefect(e.target.value)}
                  placeholder="e.g. Ultrasonic weld flaw / Point machine clutch drift / Dropper wear"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location Section</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Chainage Range</label>
                  <input
                    type="text"
                    value={newChainage}
                    onChange={(e) => setNewChainage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Km</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newKmStart}
                    onChange={(e) => setNewKmStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">End Km</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newKmEnd}
                    onChange={(e) => setNewKmEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Required Machinery</label>
                  <input
                    type="text"
                    value={newMachinery}
                    onChange={(e) => setNewMachinery(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer"
                >
                  Submit to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
