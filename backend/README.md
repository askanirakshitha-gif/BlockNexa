# BlockNexa — AI Backend Architecture & API Server
### Indian Railways • Central Railway (Bhusawal Division)

The `backend` directory provides the production-ready Python & FastAPI server hosting the trained machine learning models, optimization solver, and data pipeline.

---

## 📁 Backend Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application with CORS and route handlers
│   ├── schemas.py           # Pydantic data validation schemas
│   ├── ml_engine.py         # Loads RandomForest and GradientBoosting models
│   ├── planner_engine.py    # Combinatorial block bundling & delay optimization
│   └── timetable_service.py # Fast search over Trains_Schedule_CLEANED.csv
├── data/                    # Cloned CSV datasets from sawantpranav/Railway_Block_Planner
│   ├── Trains_Schedule_CLEANED.csv                     (374,496 rows)
│   ├── indian_railway_delay_data_-selected-columns.csv (Real delay data)
│   ├── maintenance_history.csv                         (Past defect records)
│   ├── block_history.csv                               (Past block sanctions)
│   ├── corridor_reference.csv                          (Section speeds & GMT)
│   └── goods_train_forecast.csv                        (Freight paths)
├── models/                  # Serialized ML model binaries (.joblib)
│   ├── maintenance_risk_rf.joblib (RandomForest Classifier, 96.3% Acc)
│   └── train_delay_gbr.joblib     (GradientBoosting Regressor, R² = 0.937)
├── scripts/                 # Standalone training and ingestion scripts
│   ├── train_model.py       # End-to-end model training pipeline
│   └── import_hf_dataset.py # Hugging Face open-source dataset ingestion
├── requirements.txt         # Python dependencies
├── run_server.py            # 1-Click backend launcher
└── README.md                # Backend documentation
```

---

## 🚀 How to Run the Backend Server

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (if needed)
pip install -r requirements.txt

# 3. Launch server
python run_server.py
```

The server will start at:
- **API Base:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Alternative ReDoc:** `http://127.0.0.1:8000/redoc`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifies ML models and dataset file health. |
| `POST` | `/api/ml/predict-risk` | Predicts defect deferral risk probability (Random Forest). |
| `POST` | `/api/ml/predict-delay` | Predicts train delay minutes under block possessions (Gradient Boosting). |
| `GET` | `/api/ml/metrics` | Returns model accuracy (96.3%), R² score (0.937), and feature importances. |
| `POST` | `/api/planner/solve` | Solves multi-objective block bundling and delay minimization. |
| `GET` | `/api/timetable/trains` | Queries train schedules by station code (`BSL`, `MMR`, `CSN`, `JL`). |
| `GET` | `/api/history/blocks` | Retrieves historical block records. |

---

## 🧠 Re-Training the ML Models

To re-train the models on updated CSVs anytime:

```bash
python scripts/train_model.py
```
This updates both `.joblib` files in `models/` and exports frontend metrics.
