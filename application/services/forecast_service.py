from __future__ import annotations

from fastapi import HTTPException

from dataloader import DataStore
from config import POLLUTANTS, HORIZONS
from services.common import pollutant_payload, row_value


def station_forecast(store: DataStore, station_id: str) -> dict:
    station = store.station_or_none(station_id)
    if station is None:
        raise HTTPException(status_code=404, detail=f"Unknown station: {station_id}")
    row = store.latest_station_row(store.alert_engine, station_id)
    pollutant_row = store.latest_station_row(store.pollutants, station_id)
    if row is None:
        raise HTTPException(status_code=404, detail=f"No forecast data for station: {station_id}")
    return {
        "station_id": station["Station ID"],
        "station_name": station["Station Name"],
        "latitude": station["Latitude"],
        "longitude": station["Longitude"],
        "timestamp": row_value(row, "Timestamp"),
        "aqi": row_value(row, "Forecast_AQI_+1h"),
        "category": row_value(row, "AQI_Category_+1h"),
        "risk": row_value(row, "Risk_Level_+1h"),
        "dominant_pollutant": row_value(row, "Dominant_Pollutant_+1h"),
        "trend": row_value(row, "Forecast_Trend"),
        "persistence": row_value(row, "Pollution_Persistence"),
        "alert_priority": row_value(row, "Alert_Priority"),
        "dataset_status": "precomputed_2025_forecast_artifact",
        "pollutants": POLLUTANTS,
        "horizons": HORIZONS,
        "forecast": pollutant_payload(row, pollutant_row),
    }


def all_latest_forecasts(store: DataStore) -> list[dict]:
    rows = store.latest_rows(store.alert_engine)
    pollutant_rows = store.latest_rows(store.pollutants).set_index("Station ID")
    payload = []
    for _, row in rows.iterrows():
        station_id = row["Station ID"]
        pollutant_row = pollutant_rows.loc[station_id] if station_id in pollutant_rows.index else None
        station = store.station_or_none(station_id) or {}
        payload.append(
            {
                "station_id": station_id,
                "station_name": station.get("Station Name", station_id),
                "timestamp": row_value(row, "Timestamp"),
                "forecast": pollutant_payload(row, pollutant_row),
            }
        )
    return payload


def pollutant_series(store: DataStore, station_id: str, pollutant: str = "PM2.5", limit: int = 72) -> dict:
    if store.station_or_none(station_id) is None:
        raise HTTPException(status_code=404, detail=f"Unknown station: {station_id}")
    if pollutant not in ["AQI", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"]:
        raise HTTPException(status_code=400, detail=f"Unsupported pollutant: {pollutant}")
    rows = store.station_rows(store.alert_engine, station_id, limit)
    pollutant_rows = store.station_rows(store.pollutants, station_id, limit)
    by_time = pollutant_rows.set_index("Timestamp")
    points = []
    for _, row in rows.iterrows():
        timestamp = row["Timestamp"]
        p_row = by_time.loc[timestamp] if timestamp in by_time.index else None
        point = {"timestamp": row_value(row, "Timestamp")}
        for horizon in [1, 6, 12, 24, 48, 72]:
            suffix = f"+{horizon}h"
            if pollutant == "AQI":
                point[suffix] = row_value(row, f"Forecast_AQI_{suffix}")
            elif p_row is not None:
                point[suffix] = row_value(p_row, f"{pollutant}_Forecast_{suffix}")
        points.append(point)
    return {"station_id": station_id, "pollutant": pollutant, "points": points}
