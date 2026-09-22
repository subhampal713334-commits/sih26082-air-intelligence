from fastapi import APIRouter, Depends

from dataloader import DataStore, get_store
from services.weather_service import station_weather

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/{station_id}", summary="Station meteorology and physics-informed factors")
def weather(station_id: str, store: DataStore = Depends(get_store)):
    return station_weather(store, station_id)
