from __future__ import annotations

from dataloader import DataStore


def fire_context(store: DataStore) -> dict:
    return {
        "status": "integration_ready",
        "title": "Regional fire / stubble-burning influence layer",
        "message": (
            "No fire hotspot dataset is present in the repository artifacts. The current "
            "42 XGBoost pollutant models are not retrained with a fire layer."
        ),
        "intended_inputs": [
            "FIRMS fire hotspots",
            "fire radiative power",
            "wind speed and direction",
            "distance-weighted regional activity",
            "upwind fire count",
        ],
        "stations_available": len(store.stations),
    }
