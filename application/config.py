from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "SIH26082 Air Pollution Intelligence"
    api_prefix: str = "/api"
    project_root: Path = Path(__file__).resolve().parents[1]

    @property
    def data_root(self) -> Path:
        deployment_roots = [
            self.project_root / "deployment_data",
            self.project_root / "application" / "deployment_data",
        ]
        for deployment_root in deployment_roots:
            if deployment_root.exists():
                return deployment_root
        return self.project_root

    @property
    def outputs_dir(self) -> Path:
        return self.data_root / "outputs"

    @property
    def models_dir(self) -> Path:
        return self.data_root / "models"

    @property
    def metadata_dir(self) -> Path:
        return self.data_root / "metadata"

    @property
    def stations_csv(self) -> Path:
        return self.outputs_dir / "CPCB_STATION_COORDINATES.csv"

    @property
    def alert_engine_csv(self) -> Path:
        return self.outputs_dir / "SIH26082_STAGE_13B_ALERT_ENGINE_2025.csv"

    @property
    def pollutant_forecasts_csv(self) -> Path:
        return self.outputs_dir / "MULTI_POLLUTANT_FORECASTS_2025.csv"

    @property
    def validation_csv(self) -> Path:
        return self.outputs_dir / "MULTI_POLLUTANT_FORECAST_RESULTS.csv"

    @property
    def manifest_json(self) -> Path:
        return self.metadata_dir / "MANIFEST.json"


POLLUTANTS = ["PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"]
HORIZONS = [1, 6, 12, 24, 48, 72]
WEATHER_COLUMNS = [
    "ERA5_boundary_layer_height",
    "ERA5_wind_speed_10m",
    "ERA5_temperature_2m_C",
    "ERA5_dewpoint_2m_C",
    "ERA5_dewpoint_spread_C",
    "PHY_dispersion_index",
    "PHY_stagnation_index",
    "PHY_low_wind_indicator",
    "PHY_shallow_BLH_indicator",
    "PHY_dispersion_regime_score",
    "PHY_stagnation_regime_score",
]


@lru_cache
def get_settings() -> Settings:
    return Settings()
