from __future__ import annotations

from fastapi import HTTPException

from dataloader import DataStore
from services.common import row_value


def station_weather(store: DataStore, station_id: str) -> dict:
    if store.station_or_none(station_id) is None:
        raise HTTPException(status_code=404, detail=f"Unknown station: {station_id}")
    row = store.latest_station_row(store.alert_engine, station_id)
    if row is None:
        return {"station_id": station_id, "status": "Data unavailable", "factors": []}
    cols = store.available_weather_columns()
    labels = {
        "ERA5_boundary_layer_height": "Boundary layer height",
        "ERA5_wind_speed_10m": "10 m wind speed",
        "ERA5_temperature_2m_C": "2 m temperature",
        "ERA5_dewpoint_2m_C": "2 m dewpoint",
        "ERA5_dewpoint_spread_C": "Dewpoint spread",
        "PHY_dispersion_index": "Dispersion index",
        "PHY_stagnation_index": "Stagnation index",
        "PHY_low_wind_indicator": "Low-wind indicator",
        "PHY_shallow_BLH_indicator": "Shallow BLH indicator",
        "PHY_dispersion_regime_score": "Dispersion regime score",
        "PHY_stagnation_regime_score": "Stagnation regime score",
    }
    return {
        "station_id": station_id,
        "timestamp": row_value(row, "Timestamp"),
        "status": "verified_artifact_data" if cols else "Data unavailable",
        "factors": [
            {"key": col, "label": labels.get(col, col), "value": row_value(row, col)}
            for col in cols
        ],
        "note": "Meteorological values come from the existing ERA5/physics-informed alert artifact.",
    }
