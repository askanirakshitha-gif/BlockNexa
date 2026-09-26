// Auto-generated ML model metadata and evaluation metrics
// Generated on: 2026-09-26 11:55:45 IST
// Source Repositories: sawantpranav/Railway_Block_Planner & samyuktha01/Indian_Railway_maintance

export const TRAINED_MODEL_METRICS = {
  "trainedAt": "2026-09-26 11:55:45 IST",
  "repositorySource": "sawantpranav/Railway_Block_Planner",
  "datasetFiles": [
    "Trains_Schedule_CLEANED.csv (374,496 rows)",
    "indian_railway_delay_data_-selected-columns.csv",
    "maintenance_history.csv",
    "block_history.csv",
    "samyuktha01/Indian_Railway_maintance (100K HF Dataset)"
  ],
  "models": {
    "maintenanceRiskClassifier": {
      "algorithm": "RandomForestClassifier",
      "hyperparameters": {
        "n_estimators": 120,
        "max_depth": 8,
        "class_weight": "balanced"
      },
      "metrics": {
        "accuracy": 96.33,
        "precision": 90.91,
        "recall": 78.95,
        "f1Score": 84.51,
        "rocAuc": 0.995
      },
      "featureImportances": {
        "safety_criticality": 0.3438,
        "severity": 0.2641,
        "overdue_days": 0.1518,
        "rail_wear_mm": 0.0942,
        "bearing_temperature_c": 0.0649,
        "traffic_density": 0.0298,
        "vibration_level": 0.028,
        "estimated_duration": 0.0124,
        "failure_history": 0.0109
      },
      "samplePredictions": [
        {
          "defect": "Ultrasonic Rail Weld Flaw",
          "predictedRisk": 0.94,
          "priorityClass": "CRITICAL",
          "action": "Immediate Block Required"
        },
        {
          "defect": "Point Machine Over-Current",
          "predictedRisk": 0.81,
          "priorityClass": "HIGH",
          "action": "Schedule within 24h"
        },
        {
          "defect": "Contact Wire Height Drift",
          "predictedRisk": 0.68,
          "priorityClass": "HIGH",
          "action": "Bundle in Megablock"
        },
        {
          "defect": "P-Way Ballast Screening",
          "predictedRisk": 0.39,
          "priorityClass": "MEDIUM",
          "action": "Routine Window"
        }
      ]
    },
    "trainDelayRegressor": {
      "algorithm": "GradientBoostingRegressor",
      "hyperparameters": {
        "n_estimators": 150,
        "learning_rate": 0.08,
        "max_depth": 4
      },
      "metrics": {
        "r2Score": 0.9374,
        "maeMinutes": 2.21,
        "rmseMinutes": 2.82
      },
      "featureImportances": {
        "block_duration_hours": 0.2488,
        "traffic_intensity": 0.2486,
        "distance_km": 0.1813,
        "has_loop_reroute": 0.1376,
        "scheduled_hour": 0.1171,
        "activities_bundled": 0.0662,
        "is_quad_corridor": 0.0004
      },
      "delayMitigationScenarios": [
        {
          "scenario": "Standalone Block (No Coordination)",
          "predictedDelay": 28.4,
          "status": "Severe Delay"
        },
        {
          "scenario": "Joint Multi-Dept Megablock",
          "predictedDelay": 11.2,
          "status": "Optimized (60% Saved)"
        },
        {
          "scenario": "Joint Block + Loop Line Reroute",
          "predictedDelay": 3.8,
          "status": "Minimal Punctuality Impact"
        },
        {
          "scenario": "Night Shadow Window (01:30 - 04:30)",
          "predictedDelay": 1.5,
          "status": "Zero Passenger Impact"
        }
      ]
    }
  }
};
