from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from dataloader import get_store
from routers import alerts, dashboard, fire, forecasts, stations, validation, weather

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "Delhi NCR multi-pollutant forecasting and early-warning API using "
        "precomputed CPCB + ERA5 + physics-informed artifacts."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in [
    dashboard.router,
    stations.router,
    forecasts.router,
    alerts.router,
    weather.router,
    validation.router,
    fire.router,
]:
    app.include_router(router, prefix=settings.api_prefix)


@app.on_event("startup")
def startup_load_artifacts() -> None:
    get_store()


@app.get("/api/health", tags=["health"], summary="Health check")
def health():
    store = get_store()
    return {
        "status": "ok",
        "application": settings.app_name,
        "dataset_status": "historical_precomputed_2025_artifacts",
        "latest_available_timestamp": store.latest_timestamp.isoformat(),
        "stations": len(store.stations),
        "models": store.model_inventory()["trained_model_count"],
    }
