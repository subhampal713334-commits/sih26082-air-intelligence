from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.forecast_service import all_latest_forecasts, station_forecast

router = APIRouter(prefix="/forecasts", tags=["forecasts"])


@router.get("", summary="Latest forecasts for all stations")
def forecasts(store: DataStore = Depends(get_store)):
    return all_latest_forecasts(store)


@router.get("/{station_id}", summary="Latest forecast for a station")
def forecast_by_station(station_id: str, store: DataStore = Depends(get_store)):
    return station_forecast(store, station_id)
