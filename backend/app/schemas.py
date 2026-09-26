"""
BlockNexa Backend — Pydantic Schemas & Data Contracts
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


# Existing ML Classification & Regression schemas
class DefectPredictionRequest(BaseModel):
    severity: float = Field(..., ge=1, le=10, description="Severity rating 1-10")
    safety_criticality: float = Field(..., ge=1, le=10, description="Safety criticality 1-10")
    overdue_days: float = Field(0, ge=0, description="Days past scheduled maintenance deadline")
    failure_history: float = Field(1, ge=0, description="Number of past failures on asset")
    estimated_duration: float = Field(2.0, ge=0.5, le=12.0, description="Estimated work duration in hours")
    traffic_density: float = Field(0.75, ge=0.1, le=1.5, description="GMT traffic density index (0.1 to 1.5)")
    rail_wear_mm: float = Field(3.5, ge=0.0, le=15.0, description="Rail head wear in millimeters")
    vibration_level: float = Field(2.2, ge=0.1, le=10.0, description="Track OMS acceleration level (m/s²)")
    bearing_temperature_c: float = Field(52.0, ge=20.0, le=120.0, description="Axle bearing temperature in °C")


class DefectPredictionResponse(BaseModel):
    predicted_risk_prob: float
    predicted_risk_percent: float
    priority_class: str
    is_emergency_bypass: bool
    recommended_action: str
    top_risk_factors: List[Dict[str, Any]]


class TrainDelayPredictionRequest(BaseModel):
    distance_km: float = Field(350.0, ge=10.0, description="Section or train route distance in km")
    block_duration_hours: float = Field(2.5, ge=0.5, le=8.0, description="Requested block possession duration")
    activities_bundled: int = Field(2, ge=1, le=6, description="Number of multi-department activities bundled")
    scheduled_hour: int = Field(14, ge=0, le=23, description="Hour of the day (0-23)")
    traffic_intensity: float = Field(1.0, ge=0.3, le=2.0, description="Traffic intensity multiplier")
    is_quad_corridor: bool = Field(True, description="Whether section is quad-track with bypass")
    has_loop_reroute: bool = Field(True, description="Whether loop-line diversion is active")


class TrainDelayPredictionResponse(BaseModel):
    predicted_delay_minutes: float
    mitigation_strategy: str
    mitigation_options: List[Dict[str, Any]]


class OptimizationRequest(BaseModel):
    section: Optional[str] = "MMR - CSN"
    horizon: str = Field("daily", description="daily, weekly, or monthly")
    traffic_level: str = Field("NORMAL", description="LOW, NORMAL, HIGH")
    maintenance_level: str = Field("ALL", description="ALL or CRITICAL")


class OptimizationResponse(BaseModel):
    plan_id: str
    status: str
    solver_status: str
    horizon: str
    recommended_blocks: List[Dict[str, Any]]
    total_delay_minutes: float
    total_delay_saved_minutes: float
    coordination_efficiency_percent: float
    pareto_objective_value: Optional[float] = None
    mathematical_formulation_active: Optional[bool] = True


# =====================================================================
# Complete Mathematical Formulation Schemas
# =====================================================================

class CPICalculateRequest(BaseModel):
    severity: float = Field(0.85, ge=0.0, le=1.0, description="Raw defect severity score S_i [0, 1]")
    overdue_days: float = Field(14.0, ge=0.0, description="Days task is overdue beyond statutory safety limit")
    asset_criticality: float = Field(1.0, ge=0.0, le=1.0, description="Topological criticality C_i [0, 1]")
    gmt: float = Field(420.0, ge=0.0, description="Cumulative Gross Million Tonnes")
    max_gmt: float = Field(650.0, ge=50.0, description="Max GMT corridor reference")
    tau: float = Field(7.0, ge=1.0, description="Urgency decay constant (days)")
    w1: float = Field(0.35, ge=0.0, description="Weight for severity S_i")
    w2: float = Field(0.25, ge=0.0, description="Weight for overdue urgency")
    w3: float = Field(0.25, ge=0.0, description="Weight for asset criticality")
    w4: float = Field(0.15, ge=0.0, description="Weight for GMT exposure")


class CPICalculateResponse(BaseModel):
    cpi_score: float
    cpi_percent: float
    priority_class: str
    components: Dict[str, float]
    weights: Dict[str, float]


class DegradationTrajectoryRequest(BaseModel):
    max_days: int = Field(120, ge=30, le=365)
    gmt_daily: float = Field(0.18, ge=0.01, le=1.0)
    sigma_weather: float = Field(12.0, ge=0.0, le=45.0, description="Rail temp differential above neutral buckling limit")
    eta: float = Field(500.0, ge=100.0, description="Weibull scale parameter")
    beta: float = Field(2.4, ge=1.1, description="Weibull shape factor")


class DegradationTrajectoryResponse(BaseModel):
    eta: float
    beta: float
    tqi_baseline: float
    trajectory: List[Dict[str, Any]]


class MILPFormulationRequest(BaseModel):
    tasks: Optional[List[Dict[str, Any]]] = None
    trains: Optional[List[Dict[str, Any]]] = None
    lambda1: float = Field(0.40, ge=0.0)
    lambda2: float = Field(0.30, ge=0.0)
    lambda3: float = Field(0.20, ge=0.0)
    lambda4: float = Field(0.10, ge=0.0)
    num_segments: int = Field(8, ge=4, le=24)
    num_slots: int = Field(16, ge=8, le=48)


class SLWSimulateRequest(BaseModel):
    section_name: str = Field("Manmad (MMR) — Chalisgaon (CSN)")
    blocked_line: str = Field("UP-MAIN")
    active_line: str = Field("DN-MAIN")
    section_length_km: float = Field(68.0, ge=10.0)
    avg_speed_kmh: float = Field(75.0, ge=30.0)
    num_up_trains: int = Field(6, ge=1)
    num_dn_trains: int = Field(5, ge=1)
    available_loops: int = Field(3, ge=1)


class XAIExplainRequest(BaseModel):
    window_time: str = Field("11:15 — 13:45")
    defer_hour: int = Field(14, ge=0, le=23)


class ESGOptimizeRequest(BaseModel):
    train_mass_tonnes: float = Field(5000.0, ge=500.0, le=12000.0)
    v_approach_kmh: float = Field(75.0, ge=20.0, le=130.0)
    v_hold_kmh: float = Field(0.0, ge=0.0, le=80.0)
    idle_duration_mins: float = Field(30.0, ge=0.0, le=180.0)


class CTMCForecastRequest(BaseModel):
    days_ahead: int = Field(14, ge=1, le=60)
    initial_state: int = Field(1, ge=0, le=3, description="0=Good, 1=Alert, 2=Maintenance Needed, 3=TSR")


class OfflineTokenRequest(BaseModel):
    gang_id: str = Field("GANG-PWI-42")
    supervisor_pin: str = Field("PIN-8821")
    block_id: str = Field("BLK-BSL-01")
    line_restored: str = Field("DN-MAIN")
    chainage: str = Field("Km 284/10 - 286/20")
    track_fitness_status: str = Field("FIT_FOR_NORMAL_SPEED")
