# SIH26082 Air Pollution Intelligence

Delhi NCR decision-support dashboard for the Ministry of Earth Sciences theme on disaster management. The app consumes the existing trained artifacts and precomputed outputs in this repository; it does not retrain models or rebuild the historical CPCB/ERA5 pipeline.

## System

- 42 trained XGBoost pollutant models: 7 pollutants x 6 horizons.
- Pollutants: PM2.5, PM10, NO2, SO2, CO, O3, NH3.
- Horizons: +1h, +6h, +12h, +24h, +48h, +72h.
- AQI is derived from pollutant forecasts using CPCB sub-indices and the precomputed AQI artifacts.
- Alerts, trend, risk, recommendations, ERA5 meteorology, and physics-informed factors are read from existing output CSVs.
- Fire/stubble-burning is shown as integration-ready unless a real fire dataset is added.

The app is honest about data status: 2025 artifacts are precomputed historical forecast outputs, not a live feed.

## Backend

```bash
cd application
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

Key endpoints:

- `GET /api/health`
- `GET /api/overview`
- `GET /api/dashboard`
- `GET /api/stations`
- `GET /api/stations/{station_id}`
- `GET /api/stations/{station_id}/aqi`
- `GET /api/stations/{station_id}/forecast`
- `GET /api/stations/{station_id}/pollutants`
- `GET /api/stations/{station_id}/alerts`
- `GET /api/stations/{station_id}/weather`
- `GET /api/stations/{station_id}/risk`
- `GET /api/forecasts`
- `GET /api/forecasts/{station_id}`
- `GET /api/alerts`
- `GET /api/validation`
- `GET /api/fire`

Run tests:

```bash
cd application
pytest
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Routes:

- `/`
- `/dashboard`
- `/stations`
- `/stations/:stationId`
- `/forecast`
- `/alerts`
- `/atmosphere`
- `/fire`
- `/validation`

## Data-Honesty Limitations

- No fake live data is generated.
- No fake weather, fire hotspots, validation metrics, or AQI values are generated.
- The regional fire layer is integration-ready because no fire hotspot artifact is present.
- Runtime model inference is optional; the dashboard uses validated precomputed forecast outputs as the authoritative source.
