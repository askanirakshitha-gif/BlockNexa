import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import Header from './components/layout/Header';
import DashboardModule from './components/modules/DashboardModule';
import MaintenanceRequestsModule from './components/modules/MaintenanceRequestsModule';
import AIPlannerModule from './components/modules/AIPlannerModule';
import GanttScheduleModule from './components/modules/GanttScheduleModule';
import TrainImpactModule from './components/modules/TrainImpactModule';
import ConflictCenterModule from './components/modules/ConflictCenterModule';
import AssetIntelligenceModule from './components/modules/AssetIntelligenceModule';
import SimulationReplanningModule from './components/modules/SimulationReplanningModule';
import SafetyValidationModule from './components/modules/SafetyValidationModule';
import FinalPlanModal from './components/modules/FinalPlanModal';
import PipelineArchitectureModule from './components/modules/PipelineArchitectureModule';
import RailwayMapModule from './components/modules/RailwayMapModule';

import {
  INITIAL_MAINTENANCE_REQUESTS,
  ACTIVE_BLOCKS_TODAY,
  CONFLICTS_DATA,
} from './data/railwayData';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);

  // Active navigation module
  const [activeModule, setActiveModule] = useState('dashboard');

  // Shared state
  const [maintenanceRequests, setMaintenanceRequests] = useState(INITIAL_MAINTENANCE_REQUESTS);
  const [selectedRequestIds, setSelectedRequestIds] = useState(['REQ-TMS-217', 'REQ-TDMS-120', 'REQ-SMMS-104']);
  const [activeBlocks, setActiveBlocks] = useState(ACTIVE_BLOCKS_TODAY);
  const [conflicts, setConflicts] = useState(CONFLICTS_DATA);
  const [isOptimized, setIsOptimized] = useState(true);
  const [isPlanApproved, setIsPlanApproved] = useState(false);
  const [isFinalPlanModalOpen, setIsFinalPlanModalOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddRequest = (newReq) => {
    setMaintenanceRequests((prev) => [newReq, ...prev]);
  };

  const handleRunPlanner = () => {
    setActiveModule('planner');
  };

  // If not logged in, render the login page exactly matching the reference screenshot
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header & Navigation Bar */}
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenFinalPlan={() => setIsFinalPlanModalOpen(true)}
        isPlanApproved={isPlanApproved}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Module 1: Dashboard */}
        {activeModule === 'dashboard' && (
          <DashboardModule
            maintenanceRequests={maintenanceRequests}
            activeBlocks={activeBlocks}
            conflicts={conflicts}
            onNavigate={setActiveModule}
            onRunPlanner={handleRunPlanner}
            isOptimized={isOptimized}
            isPlanApproved={isPlanApproved}
          />
        )}

        {/* Module 0: Pipeline Architecture Blueprint */}
        {activeModule === 'pipeline' && (
          <PipelineArchitectureModule onNavigate={setActiveModule} />
        )}

        {/* Module 1: Railway Map & Infrastructure Layer */}
        {activeModule === 'map' && (
          <RailwayMapModule onNavigate={setActiveModule} />
        )}

        {/* Module 2: Maintenance Requests */}
        {activeModule === 'requests' && (
          <MaintenanceRequestsModule
            requests={maintenanceRequests}
            onAddRequest={handleAddRequest}
            onNavigate={setActiveModule}
            selectedRequestIds={selectedRequestIds}
            setSelectedRequestIds={setSelectedRequestIds}
          />
        )}

        {/* Module 3: AI Block Planner (CORE) */}
        {activeModule === 'planner' && (
          <AIPlannerModule
            maintenanceRequests={maintenanceRequests}
            onNavigate={setActiveModule}
            isOptimized={isOptimized}
            setIsOptimized={setIsOptimized}
          />
        )}

        {/* Module 4: Gantt / Block Schedule */}
        {activeModule === 'gantt' && (
          <GanttScheduleModule onNavigate={setActiveModule} />
        )}

        {/* Module 5: Train Impact */}
        {activeModule === 'impact' && (
          <TrainImpactModule onNavigate={setActiveModule} />
        )}

        {/* Module 6: Conflict Center */}
        {activeModule === 'conflicts' && (
          <ConflictCenterModule onNavigate={setActiveModule} />
        )}

        {/* Module 7: Asset Intelligence */}
        {activeModule === 'assets' && (
          <AssetIntelligenceModule onNavigate={setActiveModule} />
        )}

        {/* Module 8: Simulation / Replanning */}
        {activeModule === 'simulation' && (
          <SimulationReplanningModule onNavigate={setActiveModule} />
        )}

        {/* Module 9: Safety Validation & Approval */}
        {activeModule === 'safety' && (
          <SafetyValidationModule
            currentUser={currentUser}
            isPlanApproved={isPlanApproved}
            setIsPlanApproved={setIsPlanApproved}
            onOpenFinalPlan={() => setIsFinalPlanModalOpen(true)}
          />
        )}
      </main>

      {/* Official Block Permit Sanction Modal */}
      <FinalPlanModal
        isOpen={isFinalPlanModalOpen}
        onClose={() => setIsFinalPlanModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
