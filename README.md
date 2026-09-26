# BlockNexa — AI-Powered Automatic Railway Block Planning System
### Indian Railways • Central Railway (Bhusawal Division [BSL])

BlockNexa is an end-to-end intelligent railway maintenance and train punctuality optimization system designed for Indian Railways section controllers and divisional operating officers. It automatically coordinates, optimizes, and safely sanctions multi-department maintenance blocks (Engineering P-Way, Signalling & Telecom, Traction OHE) while minimizing passenger train delays.

---

## 🚀 Live Unified Application Link

The frontend dashboard, Python machine learning models, and FastAPI backend are integrated and served together from a **single unified link**:

👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** *(or **http://localhost:8000/**)*

Interactive Swagger API Documentation:  
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## 🏗️ Repository Architecture

```
BlockNexa/
├── backend/                  # Production-ready Python & FastAPI server
│   ├── app/
│   │   ├── main.py           # FastAPI application (serves both React UI and REST APIs)
│   │   ├── ml_engine.py      # RandomForest & GradientBoosting inference engine
│   │   ├── planner_engine.py # Multi-department block bundling solver
│   │   ├── schemas.py        # Pydantic request/response data contracts
│   │   └── timetable_service.py # Index query over 374K timetable records
│   ├── data/                 # Integrated datasets
│   │   ├── Trains_Schedule_CLEANED.csv (374,496 rows)
│   │   ├── indian_railway_delay_data_-selected-columns.csv
│   │   ├── maintenance_history.csv
│   │   └── block_history.csv
│   ├── models/               # Trained ML model binaries (.joblib)
│   │   ├── maintenance_risk_rf.joblib (RandomForest Classifier — 96.3% Accuracy)
│   │   └── train_delay_gbr.joblib     (GradientBoosting Regressor — R² = 0.937)
│   ├── scripts/
│   │   ├── train_model.py    # End-to-end ML model training pipeline
│   │   └── import_hf_dataset.py # Hugging Face open-source dataset ingestion
│   ├── run_server.py         # 1-Click backend server launcher
│   └── requirements.txt      # Python dependencies
│
├── BlockNexa/                # React 18 + TailwindCSS frontend application
│   ├── src/
│   │   ├── components/       # 9 Comprehensive Divisional Control Modules
│   │   │   ├── auth/         # Login with 1-click role switcher
│   │   │   ├── layout/       # Navigation header with live backend status badge
│   │   │   └── modules/      # Overview, Maintenance Hub, AI Planner, Gantt, Impact, Safety
│   │   ├── services/
│   │   │   └── api.js        # API client connecting React directly to FastAPI backend
│   │   ├── data/             # Sourced Hugging Face data & model evaluation metrics
│   │   └── App.jsx           # Root application shell & state orchestration
│   ├── package.json
│   └── vite.config.js        # Vite dev server with integrated backend proxy
│
└── README.md
```

---

## 🧠 Machine Learning Models

### 1. Maintenance Defect Risk Classifier (`RandomForestClassifier`)
- **Trained on:** Cloned historical maintenance data + open-source Hugging Face railway telemetry (`samyuktha01/Indian_Railway_maintance`).
- **Input Features:** `severity`, `safety_criticality`, `overdue_days`, `rail_wear_mm`, `vibration_level`, `bearing_temperature_c`.
- **Performance:** **96.33% Accuracy**, **0.9950 ROC-AUC**, **84.51% F1-Score**.
- **Top Predictive Drivers:** Safety Criticality (34.4%), Severity (26.4%), Overdue Days (15.2%), Rail Wear (9.4%).

### 2. Train Delay & Operational Impact Regressor (`GradientBoostingRegressor`)
- **Trained on:** Indian Railways delay records + corridor traffic profiles from `Trains_Schedule_CLEANED.csv`.
- **Input Features:** `block_duration_hours`, `traffic_intensity`, `distance_km`, `activities_bundled`, `has_loop_reroute`.
- **Performance:** **$R^2 = 0.9374$**, **$\text{MAE} = 2.21$ minutes**, **$\text{RMSE} = 2.82$ minutes**.
- **Top Delay Drivers:** Block Duration (24.9%), Traffic Intensity (24.9%), Distance (18.1%), Loop Reroute (13.8%).

---

## ⚡ Quick Start: Running Locally

### Option 1: Unified Server (Frontend + Backend on 1 Link)
```bash
# 1. Install Python dependencies
cd backend
pip install -r requirements.txt

# 2. Start the unified server
python run_server.py
```
Open **`http://127.0.0.1:8000/`** in your browser. Both the React UI and ML APIs are operational on this single port!

### Option 2: Vite Frontend Dev Server with Auto-Proxy
```bash
# In BlockNexa directory:
npm install
npm run dev
```
Open **`http://localhost:5173/`**. Vite automatically proxies `/api` and `/health` requests to the FastAPI backend.

---

## 🔄 Re-Training the Models
```bash
python backend/scripts/train_model.py
```

---

## 📜 Open Source Attribution & Datasets
- **Hugging Face Hub:** [`samyuktha01/Indian_Railway_maintance`](https://huggingface.co/datasets/samyuktha01/Indian_Railway_maintance) (CC BY 4.0, 100K Records)
- **Train Timetable & Historical Blocks:** [`sawantpranav/Railway_Block_Planner`](https://github.com/sawantpranav/Railway_Block_Planner)
