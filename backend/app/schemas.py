"""
BlockNexa Backend — Pydantic Schemas & Data Contracts
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


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
