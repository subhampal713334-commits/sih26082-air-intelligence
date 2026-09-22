from __future__ import annotations

from fastapi import HTTPException

from dataloader import DataStore
from services.common import parse_recommendation, row_value


def list_alerts(
    store: DataStore,
    station_id: str | None = None,
    severity: str | None = None,
    limit: int = 100,
) -> list[dict]:
    rows = store.alert_engine
    if station_id:
        if store.station_or_none(station_id) is None:
            raise HTTPException(status_code=404, detail=f"Unknown station: {station_id}")
        rows = rows[rows["Station ID"].eq(station_id)]
    if severity:
        rows = rows[rows["Alert_Priority"].astype(str).str.upper().eq(severity.upper())]
    rows = rows.sort_values("Timestamp", ascending=False).head(limit)
    return [_alert_payload(store, row) for _, row in rows.iterrows()]


def station_alerts(store: DataStore, station_id: str, limit: int = 25) -> list[dict]:
    return list_alerts(store, station_id=station_id, limit=limit)


def _alert_payload(store: DataStore, row) -> dict:
    station = store.station_or_none(row["Station ID"]) or {}
    message = row_value(row, "Primary_Alert_Message")
    return {
        "timestamp": row_value(row, "Timestamp"),
        "station_id": row_value(row, "Station ID"),
        "station_name": station.get("Station Name", row_value(row, "Station ID")),
        "aqi": row_value(row, "Forecast_AQI_+1h"),
        "category": row_value(row, "AQI_Category_+1h"),
        "risk": row_value(row, "Risk_Level_+1h"),
        "dominant_pollutant": row_value(row, "Dominant_Pollutant_+1h"),
        "trend": row_value(row, "Forecast_Trend"),
        "persistence": row_value(row, "Pollution_Persistence"),
        "priority": row_value(row, "Alert_Priority"),
        "message": message,
        "recommendation": parse_recommendation(message),
    }
