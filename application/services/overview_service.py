from __future__ import annotations

from collections import Counter

from dataloader import DataStore
from services.alert_service import list_alerts
from services.forecast_service import station_forecast
from services.station_service import list_stations


def overview(store: DataStore) -> dict:
    stations = list_stations(store)
    ranked = sorted(
        [station for station in stations if station.get("aqi") is not None],
        key=lambda station: station["aqi"],
        reverse=True,
    )
    dominant = Counter(
        station.get("dominant_pollutant")
        for station in stations
        if station.get("dominant_pollutant")
    ).most_common(1)
    critical_alerts = [
        station for station in stations if str(station.get("alert_priority", "")).upper() == "CRITICAL"
    ]
    highest_risk_station = (
        station_forecast(store, ranked[0]["station_id"]) if ranked else None
    )
    return {
        "project": "SIH26082",
        "region": "Delhi NCR",
        "system": "72-hour multi-pollutant, weather-pollution coupled early-warning dashboard",
        "dataset_status": "historical_precomputed_2025_artifacts",
        "latest_available_timestamp": store.latest_timestamp.isoformat(),
        "total_stations": len(stations),
        "pollutants": store.manifest.get("pollutants", []),
        "horizons": store.manifest.get("forecast_horizons", []),
        "model_inventory": store.model_inventory(),
        "current": {
            "aqi": ranked[0]["aqi"] if ranked else None,
            "category": ranked[0]["category"] if ranked else "Data unavailable",
            "dominant_pollutant": dominant[0][0] if dominant else "Data unavailable",
            "highest_risk_station": highest_risk_station,
            "critical_alert_count": len(critical_alerts),
        },
        "station_summary": stations,
        "latest_alerts": list_alerts(store, limit=10),
    }
