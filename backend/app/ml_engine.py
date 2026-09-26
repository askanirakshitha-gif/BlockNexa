"""
BlockNexa Backend — ML Inference Service
Loads serialized RandomForestClassifier and GradientBoostingRegressor models
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

from app.schemas import (
    DefectPredictionRequest, DefectPredictionResponse,
    TrainDelayPredictionRequest, TrainDelayPredictionResponse
)

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(APP_DIR, ".."))
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

RF_MODEL_PATH = os.path.join(MODELS_DIR, "maintenance_risk_rf.joblib")
GBR_MODEL_PATH = os.path.join(MODELS_DIR, "train_delay_gbr.joblib")


class MLEngine:
    def __init__(self):
        self.rf_model = None
        self.gbr_model = None
        self._load_models()

    def _load_models(self):
        try:
            if os.path.exists(RF_MODEL_PATH):
                self.rf_model = joblib.load(RF_MODEL_PATH)
                print(f"[OK] Loaded RandomForestClassifier from {RF_MODEL_PATH}")
            else:
                print(f"[!] Warning: {RF_MODEL_PATH} not found.")
        except Exception as e:
            print(f"[!] Error loading RF model: {e}")

        try:
            if os.path.exists(GBR_MODEL_PATH):
                self.gbr_model = joblib.load(GBR_MODEL_PATH)
                print(f"[OK] Loaded GradientBoostingRegressor from {GBR_MODEL_PATH}")
            else:
                print(f"[!] Warning: {GBR_MODEL_PATH} not found.")
        except Exception as e:
            print(f"[!] Error loading GBR model: {e}")

    def predict_defect_risk(self, req: DefectPredictionRequest) -> DefectPredictionResponse:
        features_dict = {
            "severity": req.severity,
            "safety_criticality": req.safety_criticality,
            "overdue_days": req.overdue_days,
            "failure_history": req.failure_history,
            "estimated_duration": req.estimated_duration,
            "traffic_density": req.traffic_density,
            "rail_wear_mm": req.rail_wear_mm,
            "vibration_level": req.vibration_level,
            "bearing_temperature_c": req.bearing_temperature_c,
        }
        df = pd.DataFrame([features_dict])

        if self.rf_model is not None:
            prob = float(self.rf_model.predict_proba(df)[0][1])
        else:
            # Deterministic mathematical fallback
            prob = float(np.clip(
                0.35 * (req.severity / 10.0) +
                0.30 * (req.safety_criticality / 10.0) +
                0.20 * min(1.0, req.overdue_days / 14.0) +
                0.15 * (req.rail_wear_mm / 6.0),
                0.0, 1.0
            ))

        percent = round(prob * 100, 1)

        if percent >= 75:
            priority_class = "CRITICAL"
            is_emergency = req.severity >= 8 or req.safety_criticality >= 8
            action = "Emergency Corridor Intervention Queue: Immediate track possession recommended."
        elif percent >= 55:
            priority_class = "HIGH"
            is_emergency = False
            action = "Priority AI Schedule: Bundle in next available 48-hour megablock window."
        elif percent >= 35:
            priority_class = "MEDIUM"
            is_emergency = False
            action = "Routine Maintenance Slot: Schedule within weekly rolling block plan."
        else:
            priority_class = "ROUTINE"
            is_emergency = False
            action = "Low Priority: Monitor telemetry during next inspection cycle."

        # Top risk drivers for this request
        top_factors = []
        if req.safety_criticality >= 7:
            top_factors.append({"factor": "High Safety Criticality", "contribution": f"{req.safety_criticality}/10"})
        if req.rail_wear_mm > 4.5:
            top_factors.append({"factor": "Excessive Rail Head Wear", "contribution": f"{req.rail_wear_mm:.1f} mm (Limit: 5.0mm)"})
        if req.bearing_temperature_c > 65:
            top_factors.append({"factor": "Axle Box Overheating Warning", "contribution": f"{req.bearing_temperature_c:.1f} °C"})
        if req.overdue_days > 5:
            top_factors.append({"factor": "Maintenance Cycle Overdue", "contribution": f"{req.overdue_days:.0f} days past deadline"})
        if not top_factors:
            top_factors.append({"factor": "Nominal Operating Condition", "contribution": "Within safe thresholds"})

        return DefectPredictionResponse(
            predicted_risk_prob=round(prob, 4),
            predicted_risk_percent=percent,
            priority_class=priority_class,
            is_emergency_bypass=is_emergency,
            recommended_action=action,
            top_risk_factors=top_factors
        )

    def predict_train_delay(self, req: TrainDelayPredictionRequest) -> TrainDelayPredictionResponse:
        features_dict = {
            "distance_km": req.distance_km,
            "block_duration_hours": req.block_duration_hours,
            "activities_bundled": req.activities_bundled,
            "scheduled_hour": req.scheduled_hour,
            "traffic_intensity": req.traffic_intensity,
            "is_quad_corridor": int(req.is_quad_corridor),
            "has_loop_reroute": int(req.has_loop_reroute),
        }
        df = pd.DataFrame([features_dict])

        if self.gbr_model is not None:
            predicted_delay = float(self.gbr_model.predict(df)[0])
        else:
            # Deterministic mathematical fallback
            predicted_delay = float(np.clip(
                (req.block_duration_hours * 6.5) * req.traffic_intensity
                - (req.activities_bundled - 1) * 3.2
                - (8.5 if req.has_loop_reroute else 0.0)
                + (req.distance_km / 300.0) * 1.5,
                1.0, 60.0
            ))

        predicted_delay = max(0.5, round(predicted_delay, 1))

        if req.has_loop_reroute:
            strategy = "Loop Line Bi-directional Bypass Active (Minimal Punctuality Impact)"
        elif req.scheduled_hour >= 1 and req.scheduled_hour <= 5:
            strategy = "Night Shadow Maintenance Slot (Zero Express Train Conflict)"
        else:
            strategy = "Standard Possession with Speed Restriction (Caution Order Enforced)"

        options = [
            {"strategy": "Standalone Possession (Uncoordinated)", "delay_minutes": round(predicted_delay * 2.2, 1)},
            {"strategy": "Joint Megablock (Multi-Dept Bundled)", "delay_minutes": round(predicted_delay, 1)},
            {"strategy": "Joint Megablock + Loop Line Diversion", "delay_minutes": round(predicted_delay * 0.35, 1)},
            {"strategy": "Night Shadow Window (01:30 - 04:30)", "delay_minutes": round(predicted_delay * 0.15, 1)},
        ]

        return TrainDelayPredictionResponse(
            predicted_delay_minutes=predicted_delay,
            mitigation_strategy=strategy,
            mitigation_options=options
        )


ml_service = MLEngine()
