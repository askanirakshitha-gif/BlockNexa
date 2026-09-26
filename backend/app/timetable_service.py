"""
BlockNexa Backend — Indian Railways Timetable & Station Service
Provides high-performance search over Trains_Schedule_CLEANED.csv
"""

import os
import pandas as pd
from typing import List, Dict, Any

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(APP_DIR, ".."))
CSV_PATH = os.path.join(BACKEND_DIR, "data", "Trains_Schedule_CLEANED.csv")


class TimetableService:
    def __init__(self):
        self.cached_df = None
        self._load_timetable_cache()

    def _load_timetable_cache(self):
        if os.path.exists(CSV_PATH):
            try:
                # Load sample for quick response times
                self.cached_df = pd.read_csv(CSV_PATH, nrows=60000)
                print(f"[OK] TimetableService cached {len(self.cached_df)} rows from Trains_Schedule_CLEANED.csv")
            except Exception as e:
                print(f"[!] Warning reading Trains_Schedule_CLEANED.csv: {e}")
        else:
            print(f"[!] Warning: {CSV_PATH} not found.")

    def search_station_trains(self, station_code: str, limit: int = 15) -> List[Dict[str, Any]]:
        stn = station_code.strip().upper()
        if self.cached_df is None or self.cached_df.empty:
            return []

        matched = self.cached_df[self.cached_df["station_code"].str.upper() == stn]
        if matched.empty:
            # Fallback to fuzzy search in station_name
            matched = self.cached_df[self.cached_df["station_name"].str.contains(stn, case=False, na=False)]

        results = []
        for _, row in matched.head(limit).iterrows():
            results.append({
                "train_number": str(row.get("train_number")),
                "train_name": str(row.get("train_name")),
                "station_name": str(row.get("station_name")),
                "station_code": str(row.get("station_code")),
                "arrival": str(row.get("arrival")),
                "departure": str(row.get("departure")),
                "day": int(row.get("day", 1)),
            })
        return results


timetable_service = TimetableService()
