from __future__ import annotations

from fastapi import HTTPException

from dataloader import DataStore
from services.common import pollutant_payload, row_value


def list_stations(store: DataStore) -> list[dict]:
    latest = store.latest_rows(store.alert_engine)
    latest_by_station = latest.set_index("Station ID")
    stations = []
    for station in store.records(store.stations):
        station_id = station["Station ID"]
        row = latest_by_station.loc[station_id] if station_id in latest_by_station.index else None
        stations.append(_station_summary(station, row))
    return stations


def get_station(store: DataStore, station_id: str) -> dict:
    station = store.station_or_none(station_id)
    if station is None:
        raise HTTPException(status_code=404, detail=f"Unknown station: {station_id}")
    row = store.latest_station_row(store.alert_engine, station_id)
    pollutant_row = store.latest_station_row(store.pollutants, station_id)
    if row is None:
        raise HTTPException(status_code=404, detail=f"No AQI data for station: {station_id}")
    summary = _station_summary(station, row)
    summary["forecast"] = pollutant_payload(row, pollutant_row)
    summary["trend"] = row_value(row, "Forecast_Trend")
    summary["persistence"] = row_value(row, "Pollution_Persistence")
    summary["alert_priority"] = row_value(row, "Alert_Priority")
    summary["message"] = row_value(row, "Primary_Alert_Message")
    return summary


def _station_summary(station: dict, row) -> dict:
    data = {
        "station_id": station["Station ID"],
        "station_name": station["Station Name"],
        "latitude": station["Latitude"],
        "longitude": station["Longitude"],
    }
    if row is not None:
        data.update(
            {
                "timestamp": row_value(row, "Timestamp"),
                "aqi": row_value(row, "Forecast_AQI_+1h"),
                "category": row_value(row, "AQI_Category_+1h"),
                "risk": row_value(row, "Risk_Level_+1h"),
                "dominant_pollutant": row_value(row, "Dominant_Pollutant_+1h"),
                "trend": row_value(row, "Forecast_Trend"),
                "persistence": row_value(row, "Pollution_Persistence"),
                "alert_priority": row_value(row, "Alert_Priority"),
            }
        )
    return data
