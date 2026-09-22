
SIH26082 — ESSENTIAL FULL-STACK HACKATHON PACKAGE
=================================================

This package contains the artifacts required to build the
judge-facing application without retraining the models.

TRAINED MODELS
--------------
7 pollutants × 6 horizons = 42 XGBoost models

Pollutants:
PM2.5, PM10, NO2, SO2, CO, O3, NH3

Horizons:
+1h, +6h, +12h, +24h, +48h, +72h

MODEL COUNT
-----------
Expected: 42
Found:    42

OUTPUT PIPELINE
---------------
CPCB observations
        +
ERA5 meteorology
        ↓
Multi-pollutant XGBoost forecasting
        ↓
Future pollutant concentrations
        ↓
CPCB breakpoint AQI
        ↓
AQI category
        ↓
Dominant pollutant
        ↓
Risk level
        ↓
Dynamic alert
        ↓
Recommendation
        ↓
Full-stack dashboard

IMPORTANT
---------
This package intentionally excludes huge intermediate training
datasets and temporary feature Parquet files.

The existing precomputed outputs are included so the application
can run without retraining.

For model-level reproduction, the original training notebook/code
should also be preserved separately.
