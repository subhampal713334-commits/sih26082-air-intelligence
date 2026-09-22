from pathlib import Path
import shutil

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "outputs"
TARGET = ROOT / "deployment_data"


def compact_csv(filename: str, target_filename: str) -> None:
    source = SOURCE / filename
    frame = pd.read_csv(source)
    frame["Timestamp"] = pd.to_datetime(frame["Timestamp"], utc=True)
    compact = frame.sort_values(["Station ID", "Timestamp"]).groupby(
        "Station ID", group_keys=False
    ).tail(72)
    compact.to_csv(TARGET / "outputs" / target_filename, index=False)


def main() -> None:
    (TARGET / "outputs").mkdir(parents=True, exist_ok=True)
    (TARGET / "metadata").mkdir(parents=True, exist_ok=True)
    compact_csv(
        "SIH26082_STAGE_13B_ALERT_ENGINE_2025.csv",
        "SIH26082_STAGE_13B_ALERT_ENGINE_2025.csv",
    )
    compact_csv(
        "MULTI_POLLUTANT_FORECASTS_2025.csv",
        "MULTI_POLLUTANT_FORECASTS_2025.csv",
    )
    for filename in ["CPCB_STATION_COORDINATES.csv", "MULTI_POLLUTANT_FORECAST_RESULTS.csv"]:
        shutil.copy2(SOURCE / filename, TARGET / "outputs" / filename)
    shutil.copy2(ROOT / "metadata" / "MANIFEST.json", TARGET / "metadata" / "MANIFEST.json")


if __name__ == "__main__":
    main()