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
} from 'lucide-react';

export default function MaintenanceRequestsModule({
  requests,
  onAddRequest,
  onNavigate,
  selectedRequestIds,
  setSelectedRequestIds,
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, TMS, TDMS, SMMS
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new request modal
  const [newDept, setNewDept] = useState('Engineering (TMS)');
  const [newSubDept, setNewSubDept] = useState('P-Way / Track');
  const [newDefect, setNewDefect] = useState('');
  const [newLocation, setNewLocation] = useState('MMR - CSN (Manmad - Chalisgaon)');
  const [newLine, setNewLine] = useState('Down Main Line');
  const [newChainage, setNewChainage] = useState('Km 290/10 - 291/00');
  const [newSeverity, setNewSeverity] = useState('Major');
  const [newDuration, setNewDuration] = useState('2h 30m');
  const [newMachinery, setNewMachinery] = useState('Duomatic Tamping Machine');
  const [newGang, setNewGang] = useState('SSE/P-Way Gang #2');

  const filteredRequests = requests.filter((req) => {
    if (activeTab !== 'ALL' && req.deptCode !== activeTab) return false;
    if (severityFilter !== 'ALL' && req.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        req.defect.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.dept.toLowerCase().includes(q);
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
      : 'SMMS';

    const reqObj = {
      id: `REQ-${deptCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      dept: newDept,
      deptCode: deptCode,
      subDept: newSubDept,
      defect: newDefect,
      location: newLocation,
      line: newLine,
      chainage: newChainage,
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
      gangRequired: newGang,
      machinery: newMachinery,
      tqi: deptCode === 'TMS' ? 44.0 : null,
      status: 'Pending AI Slotting',
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
      {/* Header with Title & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/40">
              Module 02
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Maintenance Requisitions Feed
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time field defect inputs from <strong>TMS (Track)</strong>, <strong>TDMS (OHE)</strong>, and <strong>SMMS (Signals)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:shadow-blue-900/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Requisition</span>
          </button>

          {selectedRequestIds.length > 0 && (
            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-900/40 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Optimize Selected ({selectedRequestIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Tabs & Filter Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-lg">
        {/* Department Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Departments ({requests.length})
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
              <span>Traction / OHE (TDMS)</span>
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
      </div>

      {/* Requests Table / Cards */}
      <div className="space-y-3">
        {filteredRequests.map((req) => {
          const isSelected = selectedRequestIds.includes(req.id);
          const deptMeta = getDeptBadge(req.deptCode);
          const DeptIcon = deptMeta.icon;

          return (
            <div
              key={req.id}
              className={`p-4 rounded-xl border transition-all duration-150 ${
                isSelected
                  ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-950'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left checkbox & Defect details */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSelect(req.id)}
                    className="mt-1 text-slate-400 hover:text-blue-400 cursor-pointer shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {req.id}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${deptMeta.bg}`}
                      >
                        <DeptIcon className="w-3 h-3" />
                        <span>{req.dept}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSeverityBadge(
                          req.severity
                        )}`}
                      >
                        {req.severity}
                      </span>
                      {req.canJointBlock && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Joint Corridor Eligible
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {req.defect}
                    </h3>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                      <span><strong>Section:</strong> {req.location}</span>
                      <span><strong>Line:</strong> {req.line}</span>
                      <span><strong>Chainage:</strong> {req.chainage}</span>
                      {req.tqi && <span><strong>TQI Score:</strong> {req.tqi}</span>}
                    </div>
                  </div>
                </div>

                {/* Right duration, AI priority & resources */}
                <div className="flex flex-wrap items-center gap-4 lg:self-center shrink-0 border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-400">Duration Required</div>
                    <div className="text-sm font-mono font-bold text-white flex items-center lg:justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{req.requestedDuration}</span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-400">AI Priority Score</div>
                    <div className="text-base font-mono font-extrabold text-purple-400">
                      {req.priorityScore}/100
                    </div>
                  </div>

                  <div className="hidden xl:block text-left text-xs text-slate-400 max-w-[200px] border-l border-slate-800 pl-3">
                    <div className="text-[10px] uppercase font-semibold text-slate-500">Resources</div>
                    <div className="truncate text-slate-300">{req.machinery}</div>
                    <div className="truncate text-slate-400 text-[11px]">{req.gangRequired}</div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isSelected) toggleSelect(req.id);
                      onNavigate('planner');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 hover:border-purple-500"
                  >
                    <span>Slot with AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Raise New Requisition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Raise Divisional Maintenance Requisition
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => {
                    setNewDept(e.target.value);
                    if (e.target.value.includes('TMS')) {
                      setNewSubDept('P-Way / Track');
                      setNewMachinery('Duomatic Tamping Machine');
                    } else if (e.target.value.includes('TDMS')) {
                      setNewSubDept('OHE / Electrical TRD');
                      setNewMachinery('Tower Wagon 8-Wheeler');
                    } else {
                      setNewSubDept('Signalling & Telecomm');
                      setNewMachinery('Point Testing Kit');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Engineering (TMS)">Engineering / P-Way (TMS)</option>
                  <option value="Traction (TDMS)">Traction / OHE (TDMS)</option>
                  <option value="S&T (SMMS)">Signal & Telecomm (SMMS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Defect Description</label>
                <input
                  type="text"
                  required
                  value={newDefect}
                  onChange={(e) => setNewDefect(e.target.value)}
                  placeholder="e.g. Ultrasonic flaw detection or Catenary dropper snap"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Section Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Line / Track</label>
                  <select
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Down Main Line">Down Main Line</option>
                    <option value="Up Main Line">Up Main Line</option>
                    <option value="3rd Corridor Line">3rd Corridor Line</option>
                    <option value="Down Loop 3">Down Loop 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Emergency">Emergency (Immediate)</option>
                    <option value="Critical">Critical (Within 24h)</option>
                    <option value="Major">Major (Planned 72h)</option>
                    <option value="Routine">Routine Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Requested Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 2h 30m"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Machinery / Special Plant</label>
                  <input
                    type="text"
                    value={newMachinery}
                    onChange={(e) => setNewMachinery(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Field Gang</label>
                  <input
                    type="text"
                    value={newGang}
                    onChange={(e) => setNewGang(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-md"
                >
                  Submit Requisition to System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
