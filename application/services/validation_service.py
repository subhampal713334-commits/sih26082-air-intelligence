from __future__ import annotations

from dataloader import DataStore


def validation_summary(store: DataStore) -> dict:
    records = store.records(store.validation.sort_values(["Pollutant", "Horizon_h"]))
    return {
        "methodology": {
            "split": "chronological",
            "train": "2021-2023",
            "validation": "2024",
            "test": "2025",
            "random_split": False,
        },
        "metrics": records,
        "model_inventory": store.model_inventory(),
    }
