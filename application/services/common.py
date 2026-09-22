from __future__ import annotations

import re
from typing import Any

import numpy as np
import pandas as pd

from config import HORIZONS, POLLUTANTS


def value_or_none(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, float) and np.isnan(value):
        return None
    if isinstance(value, np.generic):
        return value.item()
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


def row_value(row: pd.Series, column: str) -> Any:
    return value_or_none(row[column]) if column in row.index else None


def parse_recommendation(message: str | None) -> str:
    if not message:
        return "Data unavailable"
    match = re.search(r"Recommendation:\s*(.*)$", message)
    return match.group(1).strip() if match else message


def horizon_payload(row: pd.Series, horizon: int) -> dict[str, Any]:
    suffix = f"+{horizon}h"
    return {
        "horizon_h": horizon,
        "label": suffix,
        "aqi": row_value(row, f"Forecast_AQI_{suffix}"),
        "category": row_value(row, f"AQI_Category_{suffix}"),
        "risk": row_value(row, f"Risk_Level_{suffix}"),
        "dominant_pollutant": row_value(row, f"Dominant_Pollutant_{suffix}"),
        "warning": row_value(row, f"Warning_{suffix}"),
        "recommendation": row_value(row, f"Recommendation_{suffix}"),
        "severity_message": row_value(row, f"Severity_Message_{suffix}"),
        "pollutant_message": row_value(row, f"Pollutant_Message_{suffix}"),
        "weather_explanation": row_value(row, f"Weather_Explanation_{suffix}"),
        "subindices": {
            pollutant: row_value(row, f"{pollutant}_SI_{suffix}") for pollutant in POLLUTANTS
        },
    }


def pollutant_payload(row: pd.Series, pollutant_row: pd.Series | None) -> list[dict[str, Any]]:
    points: list[dict[str, Any]] = []
    for horizon in HORIZONS:
        suffix = f"+{horizon}h"
        item = horizon_payload(row, horizon)
        item["forecast_timestamp"] = (
            pd.to_datetime(row["Timestamp"]) + pd.Timedelta(hours=horizon)
        ).isoformat()
        item["pollutants"] = {}
        if pollutant_row is not None:
            for pollutant in POLLUTANTS:
                item["pollutants"][pollutant] = row_value(
                    pollutant_row, f"{pollutant}_Forecast_{suffix}"
                )
        points.append(item)
    return points
