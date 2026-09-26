"""
BlockNexa — Hugging Face Open-Source Dataset Ingestion Pipeline
==============================================================
Dataset Source: samyuktha01/Indian_Railway_maintance
License: Creative Commons Attribution 4.0 International (CC BY 4.0)
Total Dataset Records: 100,000

Description:
  Downloads and filters real-world Indian Railway failure incidents and sensor
  telemetry from the open-source Hugging Face repository. Normalizes failure classes
  (Track Defect, Signal Failure, Bearing Failure, Brake Failure, Wheel Defect) into
  departmental codes (TMS, SMMS, TDMS, BDMS) and maps them to Central Railway
  Bhusawal Division (BSL) Linear Referencing System (LRS) coordinates.
"""

import urllib.request
import csv
import json
import sys
import os
from collections import defaultdict

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

print("====================================================================")
print("BlockNexa: Ingesting samyuktha01/Indian_Railway_maintance (HF Open Source)")
print("====================================================================")

url = "https://huggingface.co/datasets/samyuktha01/Indian_Railway_maintance/resolve/main/indian_railway_predictive_maintenance_100k.csv"
print(f"Connecting to Hugging Face Hub: {url}")

req = urllib.request.Request(url, headers={"Range": "bytes=0-15000000"})
try:
    res = urllib.request.urlopen(req)
    raw_text = res.read().decode("utf-8", errors="replace")
except Exception as e:
    print(f"Error fetching dataset: {e}")
    sys.exit(1)

lines = raw_text.splitlines()[:-1]
reader = csv.DictReader(lines)
maint_rows = [r for r in reader if r.get("maintenance_required") == "1"]
print(f"[OK] Maintenance-required records parsed: {len(maint_rows)}")

cr_rows = [r for r in maint_rows if r.get("region") == "Central Railway"]
print(f"[OK] Central Railway (CR) maintenance records: {len(cr_rows)}")

# Bhusawal Division High-Density Quad Corridor Sections
sections = [
    ("MMR - CSN", "Manmad - Chalisgaon", "DN-MAIN", "Down Main Line", 261.0, 328.0, "ISO-MMR-CSN-04"),
    ("NK - MMR", "Nashik Road - Manmad", "UP-MAIN", "Up Main Line", 188.0, 261.0, "ISO-NK-MMR-01"),
    ("IGP - DVL", "Igatpuri - Devlali", "UP-MAIN", "Up Main Line", 137.0, 179.0, "ISO-IGP-DVL-02"),
    ("CSN - JL", "Chalisgaon - Jalgaon", "DN-MAIN", "Down Main Line", 328.0, 420.0, "ISO-CSN-JL-01"),
    ("JL - BSL", "Jalgaon - Bhusawal", "3RD-LINE", "3rd Corridor Line", 420.0, 444.0, "ISO-JL-BSL-03"),
    ("CSN Yard", "Chalisgaon Yard", "LOOP-3", "Down Loop to Platform 3", 327.5, 329.0, "ISO-CSN-YD-02"),
]

selected = []
grouped = defaultdict(list)
for r in (cr_rows + maint_rows):
    grouped[(r.get("failure_type"), r.get("failure_severity"))].append(r)

idx = 0
for (ft, sev), row_list in grouped.items():
    if not ft or not sev:
        continue
    for r in row_list[:3]:  # Select top representative records per category
        sec = sections[idx % len(sections)]
        idx += 1
        
        # Route to respective Railway Department
        if ft == "Track Defect":
            dept = "Engineering (TMS)"
            deptCode = "TMS"
            subDept = "P-Way / Track"
            gang = "SSE/P-Way Gang #4 (18 Men)"
            machinery = "01 No. BCM + Duomatic Tamping Machine"
        elif ft == "Signal Failure":
            dept = "S&T (SMMS)"
            deptCode = "SMMS"
            subDept = "Signalling & Interlocking"
            gang = "SSE/Sig Signal Inspector & 4 Technicians"
            machinery = "Digital Point Test Kit & Signal Analyzer"
        elif ft in ("Bearing Failure", "Wheel Defect"):
            if idx % 2 == 0:
                dept = "Traction (TDMS)"
                deptCode = "TDMS"
                subDept = "OHE / Traction Motor"
                gang = "TRD Tower Wagon Maintenance Crew (12 Staff)"
                machinery = "8-Wheeler Tower Wagon (TW-CR-08)"
            else:
                dept = "Demands (BDMS)"
                deptCode = "BDMS"
                subDept = "Rolling Stock & Wheel Lathe"
                gang = "C&W Carriage & Wagon Gang (8 Men)"
                machinery = "Underfloor Wheel Lathe & Caliper Kit"
        else:  # Brake Failure
            dept = "Demands (BDMS)"
            deptCode = "BDMS"
            subDept = "Brake & Pneumatic System"
            gang = "Air Brake Testing Team (6 Staff)"
            machinery = "Rake Test Rig & Pressure Gauge Analyzer"

        # Calculate Composite Priority Index (CPI)
        risk_score = float(r.get("risk_score") or 70.0)
        last_maint = float(r.get("last_maintenance_days") or 30.0)
        rail_wear = float(r.get("rail_wear_mm") or 8.0)
        
        sDefect = 98 if sev == "Critical" else 85 if sev == "High" else 68 if sev == "Medium" else 45
        dOverdue = min(100, int((last_maint / 180.0) * 100))
        cAsset = 95 if sec[2] == "DN-MAIN" else 90 if sec[2] == "UP-MAIN" else 75
        tTraffic = 88 if sec[2] in ("DN-MAIN", "UP-MAIN") else 72
        
        calculatedCPI = round(0.40 * sDefect + 0.25 * dOverdue + 0.20 * cAsset + 0.15 * tTraffic, 1)
        
        km_start = round(sec[4] + (idx * 1.7) % (sec[5] - sec[4] - 2), 2)
        km_end = round(km_start + 1.2, 2)
        
        isEmergency = (sev == "Critical" and ft in ("Track Defect", "Signal Failure")) or (risk_score > 85 and sev in ("Critical", "High"))
        
        defect_desc = f"{ft}: {sev} anomaly (Rail wear: {rail_wear:.1f}mm, Risk: {risk_score:.1f})"
        if ft == "Track Defect":
            defect_desc = f"Track Defect: Ballast {r.get('ballast_condition', 'Fair')}, Rail Wear {rail_wear:.1f}mm, Vibration {float(r.get('track_vibration_level') or 0):.1f}"
        elif ft == "Signal Failure":
            defect_desc = f"Signal Failure: Status {r.get('signal_system_status', 'Degraded')}, Sensor Health {float(r.get('sensor_health_index') or 0):.1f}%"
        elif ft == "Bearing Failure":
            defect_desc = f"Bearing & Traction Defect: Bearing Temp {float(r.get('bearing_temperature_c') or 0):.1f} C, Axle Temp {float(r.get('axle_temperature_c') or 0):.1f} C"
        elif ft == "Wheel Defect":
            defect_desc = f"Wheel Flange Defect: Wear {float(r.get('wheel_wear_percent') or 0):.1f}%, Track Curvature {float(r.get('track_curvature_degree') or 0):.1f} deg"
        elif ft == "Brake Failure":
            defect_desc = f"Pneumatic Brake Defect: Pressure {float(r.get('brake_pressure_psi') or 0):.1f} PSI, Pad Wear {float(r.get('brake_pad_wear_percent') or 0):.1f}%"

        selected.append({
            "id": f"REQ-{deptCode}-{r.get('train_id', idx)}",
            "hfTrainId": r.get("train_id"),
            "hfSource": "samyuktha01/Indian_Railway_maintance",
            "dept": dept,
            "deptCode": deptCode,
            "subDept": subDept,
            "defect": defect_desc,
            "failureType": ft,
            "failureSeverity": sev,
            "location": sec[0],
            "line": sec[3],
            "lineCode": sec[2],
            "chainage": f"Km {int(km_start)}/{int((km_start%1)*100):02d} - {int(km_end)}/{int((km_end%1)*100):02d}",
            "spatialRef": {
                "division": "BSL",
                "lineCode": sec[2],
                "chainageStartKm": km_start,
                "chainageEndKm": km_end,
                "isolationZone": sec[6],
            },
            "severity": sev,
            "severityLevel": 4 if sev == "Critical" else 3 if sev == "High" else 2 if sev == "Medium" else 1,
            "requestedDuration": "3h 00m" if sev == "Critical" else "2h 30m" if sev == "High" else "1h 30m",
            "durationMins": 180 if sev == "Critical" else 150 if sev == "High" else 90,
            "requestedWindow": "10:45 — 13:45" if sev == "Critical" else "14:15 — 16:00",
            "priorityScore": int(calculatedCPI),
            "cpiBreakdown": {
                "sDefect": sDefect,
                "dOverdue": dOverdue,
                "cAsset": cAsset,
                "tTraffic": tTraffic,
                "w1": 0.40,
                "w2": 0.25,
                "w3": 0.20,
                "w4": 0.15,
                "calculatedCPI": calculatedCPI,
            },
            "isEmergencySafetyBypass": isEmergency,
            "gangRequired": gang,
            "machinery": machinery,
            "tqi": 42.8 if ft == "Track Defect" else None,
            "status": "EMERGENCY SAFETY BYPASS QUEUE" if isEmergency else "Pending AI Slotting",
            "coordinatedWith": [],
            "canJointBlock": True if ft in ("Track Defect", "Signal Failure", "Bearing Failure") else False,
            "rawHfFeatures": {
                "rail_wear_mm": r.get("rail_wear_mm"),
                "track_vibration_level": r.get("track_vibration_level"),
                "ballast_condition": r.get("ballast_condition"),
                "track_temperature_c": r.get("track_temperature_c"),
                "bearing_temperature_c": r.get("bearing_temperature_c"),
                "axle_temperature_c": r.get("axle_temperature_c"),
                "brake_pressure_psi": r.get("brake_pressure_psi"),
                "brake_pad_wear_percent": r.get("brake_pad_wear_percent"),
                "wheel_wear_percent": r.get("wheel_wear_percent"),
                "sensor_health_index": r.get("sensor_health_index"),
                "inspection_score": r.get("inspection_score"),
                "signal_system_status": r.get("signal_system_status"),
                "risk_score": r.get("risk_score"),
                "last_maintenance_days": r.get("last_maintenance_days"),
                "delay_minutes": r.get("delay_minutes"),
                "train_type": r.get("train_type"),
                "region": r.get("region"),
            }
        })

print(f"[OK] Harmonized {len(selected)} maintenance records into Bhusawal Quad Corridor.")

# Resolve output path relative to script location
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.abspath(os.path.join(script_dir, "..", "src", "data", "huggingfaceMaintenanceData.js"))

with open(output_path, "w", encoding="utf-8") as f:
    f.write("// Auto-generated dataset module sourced from Hugging Face: samyuktha01/Indian_Railway_maintance\n")
    f.write("// License: Creative Commons Attribution 4.0 International (CC BY 4.0)\n")
    f.write("// Dataset Title: Indian Railway Failure Detection & Maintenance (100K Records)\n\n")
    f.write("export const HUGGINGFACE_DATASET_META = {\n")
    f.write('  datasetId: "samyuktha01/Indian_Railway_maintance",\n')
    f.write('  platform: "Hugging Face Datasets",\n')
    f.write('  license: "CC BY 4.0",\n')
    f.write('  url: "https://huggingface.co/datasets/samyuktha01/Indian_Railway_maintance",\n')
    f.write("  totalDatasetRecords: 100000,\n")
    f.write(f"  importedRecordsCount: {len(selected)},\n")
    f.write('  targetDivision: "Central Railway (CR) • Bhusawal Division [BSL]",\n')
    f.write('  features: ["rail_wear_mm", "track_vibration_level", "ballast_condition", "bearing_temperature_c", "signal_system_status", "risk_score", "last_maintenance_days"],\n')
    f.write("};\n\n")
    f.write("export const HUGGINGFACE_MAINTENANCE_RECORDS = ")
    json.dump(selected, f, indent=2)
    f.write(";\n")

print(f"[OK] Successfully exported to: {output_path}")
print("Pipeline run complete.")
