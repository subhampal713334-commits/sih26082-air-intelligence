from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.aqi_service import station_aqi
from services.alert_service import station_alerts
from services.forecast_service import pollutant_series, station_forecast
from services.station_service import get_station, list_stations
from services.weather_service import station_weather

router = APIRouter(prefix="/stations", tags=["stations"])


@router.get("", summary="List Delhi NCR CPCB stations with latest AQI summary")
def stations(store: DataStore = Depends(get_store)):
    return list_stations(store)


@router.get("/{station_id}", summary="Station detail")
def station_detail(station_id: str, store: DataStore = Depends(get_store)):
    return get_station(store, station_id)


@router.get("/{station_id}/aqi", summary="AQI horizons for a station")
def station_aqi_endpoint(station_id: str, store: DataStore = Depends(get_store)):
    return station_aqi(store, station_id)


@router.get("/{station_id}/forecast", summary="Multi-pollutant forecast for a station")
def station_forecast_endpoint(station_id: str, store: DataStore = Depends(get_store)):
    return station_forecast(store, station_id)


@router.get("/{station_id}/pollutants", summary="Time-series pollutant forecast curves")
def station_pollutants_endpoint(
    station_id: str, pollutant: str = "PM2.5", limit: int = 72, store: DataStore = Depends(get_store)
):
    return pollutant_series(store, station_id, pollutant, limit)


@router.get("/{station_id}/alerts", summary="Alerts for a station")
def station_alerts_endpoint(station_id: str, limit: int = 25, store: DataStore = Depends(get_store)):
    return station_alerts(store, station_id, limit)


@router.get("/{station_id}/weather", summary="Verified ERA5 and physics-informed factors")
def station_weather_endpoint(station_id: str, store: DataStore = Depends(get_store)):
    return station_weather(store, station_id)


@router.get("/{station_id}/risk", summary="Latest station risk state")
def station_risk_endpoint(station_id: str, store: DataStore = Depends(get_store)):
    detail = get_station(store, station_id)
    return {
        "station_id": station_id,
        "risk": detail.get("risk"),
        "trend": detail.get("trend"),
        "persistence": detail.get("persistence"),
        "alert_priority": detail.get("alert_priority"),
        "dominant_pollutant": detail.get("dominant_pollutant"),
    }
