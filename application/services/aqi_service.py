from __future__ import annotations

from config import HORIZONS
from dataloader import DataStore
from services.common import horizon_payload, row_value


AQI_BREAKPOINTS = [
    (0, 50, "Good"),
    (51, 100, "Satisfactory"),
    (101, 200, "Moderate"),
    (201, 300, "Poor"),
    (301, 400, "Very Poor"),
    (401, 500, "Severe"),
]


def category_for_aqi(aqi: float | int | None) -> str:
    if aqi is None:
        return "Data unavailable"
    capped = min(max(float(aqi), 0), 500)
    for low, high, label in AQI_BREAKPOINTS:
        if low <= capped <= high:
            return label
    return "Severe"


def station_aqi(store: DataStore, station_id: str) -> dict:
    row = store.latest_station_row(store.alert_engine, station_id)
    if row is None:
        return {"station_id": station_id, "status": "Data unavailable", "horizons": []}
    return {
        "station_id": station_id,
        "timestamp": row_value(row, "Timestamp"),
        "horizons": [horizon_payload(row, horizon) for horizon in HORIZONS],
    }
