from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from config import HORIZONS, POLLUTANTS, WEATHER_COLUMNS, get_settings


def _require_file(path: Path) -> Path:
    if not path.exists():
        raise FileNotFoundError(f"Required artifact not found: {path}")
    return path


def _clean_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records = df.replace({np.nan: None}).to_dict(orient="records")
    for row in records:
        for key, value in list(row.items()):
            if hasattr(value, "isoformat"):
                row[key] = value.isoformat()
            elif isinstance(value, np.generic):
                row[key] = value.item()
    return records


class DataStore:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.stations = self._load_stations()
        self.alert_engine = self._load_alert_engine()
        self.pollutants = self._load_pollutants()
        self.validation = self._load_validation()
        self.manifest = self._load_manifest()
        self.latest_timestamp = self.alert_engine["Timestamp"].max()
        self.station_lookup = {
            row["Station ID"]: row for row in _clean_records(self.stations)
        }

    def _load_stations(self) -> pd.DataFrame:
        df = pd.read_csv(_require_file(self.settings.stations_csv))
        return df.sort_values("Station ID").reset_index(drop=True)

    def _load_alert_engine(self) -> pd.DataFrame:
        path = _require_file(self.settings.alert_engine_csv)
        df = pd.read_csv(path)
        df["Timestamp"] = pd.to_datetime(df["Timestamp"], utc=True)
        return df.sort_values(["Station ID", "Timestamp"]).reset_index(drop=True)

    def _load_pollutants(self) -> pd.DataFrame:
        path = _require_file(self.settings.pollutant_forecasts_csv)
        df = pd.read_csv(path)
        df["Timestamp"] = pd.to_datetime(df["Timestamp"], utc=True)
        return df.sort_values(["Station ID", "Timestamp"]).reset_index(drop=True)

    def _load_validation(self) -> pd.DataFrame:
        path = _require_file(self.settings.validation_csv)
        return pd.read_csv(path)

    def _load_manifest(self) -> dict[str, Any]:
        with open(_require_file(self.settings.manifest_json), "r", encoding="utf-8") as handle:
            return json.load(handle)

    def records(self, df: pd.DataFrame) -> list[dict[str, Any]]:
        return _clean_records(df)

    def station_or_none(self, station_id: str) -> dict[str, Any] | None:
        return self.station_lookup.get(station_id)

    def latest_rows(self, df: pd.DataFrame) -> pd.DataFrame:
        return df[df["Timestamp"].eq(self.latest_timestamp)].copy()

    def station_rows(self, df: pd.DataFrame, station_id: str, limit: int = 96) -> pd.DataFrame:
        rows = df[df["Station ID"].eq(station_id)].tail(limit).copy()
        return rows

    def latest_station_row(self, df: pd.DataFrame, station_id: str) -> pd.Series | None:
        rows = df[df["Station ID"].eq(station_id)]
        if rows.empty:
            return None
        return rows.iloc[-1]

    def station_row_at(self, df: pd.DataFrame, station_id: str, timestamp: pd.Timestamp) -> pd.Series | None:
        rows = df[df["Station ID"].eq(station_id) & df["Timestamp"].eq(timestamp)]
        if rows.empty:
            return None
        return rows.iloc[-1]

    def available_timestamps(self, station_id: str, limit: int = 48) -> list[str]:
        rows = self.station_rows(self.alert_engine, station_id, limit=limit)
        timestamps = rows["Timestamp"].sort_values(ascending=False)
        return [timestamp.isoformat() for timestamp in timestamps]

    def available_weather_columns(self) -> list[str]:
        return [col for col in WEATHER_COLUMNS if col in self.alert_engine.columns]

    def model_inventory(self) -> dict[str, Any]:
        model_files = sorted(self.settings.models_dir.glob("*.json"))
        return {
            "model_type": self.manifest.get("model_type", "XGBoost"),
            "expected_model_count": self.manifest.get("expected_model_count"),
            "trained_model_count": len(model_files),
            "pollutants": POLLUTANTS,
            "horizons": [f"+{h}h" for h in HORIZONS],
            "files": [file.name for file in model_files],
        }


@lru_cache
def get_store() -> DataStore:
    return DataStore()
