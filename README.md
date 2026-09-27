## 🌍 Overview

**VayuGuard–NCR** is a weather-coupled, multi-pollutant air-pollution forecasting and early-warning system designed for **Delhi NCR**.

It combines **CPCB station-level air-quality observations** with **ERA5 meteorological information** to forecast seven major pollutants across six horizons up to **72 hours**.

The forecasts are converted into **CPCB-based AQI**, risk levels and station-level alerts, while dominant-pollutant and persistence/trend analysis provide additional intelligence.

### Core Pipeline

```text
CPCB + ERA5
     ↓
Data Preparation
     ↓
42 XGBoost Models
     ↓
7 Pollutants × 6 Horizons
     ↓
Future Concentrations
     ↓
CPCB AQI
     ↓
Risk + Dominant Pollutant + Trend
     ↓
Station Alerts
     ↓
FastAPI → React Dashboard
```

---

# 🎯 Problem Statement

### SIH26082 — Air Pollution–Weather Coupled Forecasting System (Delhi NCR Focus)

Air pollution is dynamic and influenced by both pollutant behaviour and atmospheric conditions.

Key challenges include:

- Multiple pollutants contributing to air-quality risk
- Spatial variation between monitoring stations
- Meteorological effects on pollution dispersion and accumulation
- Persistent pollution episodes
- Regional fire and stubble-burning activity

VayuGuard–NCR moves beyond reactive AQI monitoring by providing **future pollution forecasts and early-warning intelligence**.

---

# 💡 Proposed Solution

The system forecasts:

### 7 Pollutants

```text
PM2.5 • PM10 • NO₂ • SO₂ • CO • O₃ • NH₃
```

### 6 Forecast Horizons

```text
+1h • +6h • +12h • +24h • +48h • +72h
```

Therefore:

```text
7 Pollutants × 6 Horizons = 42 XGBoost Models
```

The predicted pollutant concentrations are then processed using the CPCB AQI methodology and transformed into actionable station-level intelligence.

---

# ✨ Key Features

- 🌫️ **Multi-pollutant forecasting** for 7 major pollutants
- ⏱️ **72-hour forecasting** across 6 horizons
- 🤖 **42 specialized XGBoost models**
- 🌦️ **ERA5 weather-coupled forecasting**
- 📊 **CPCB-based AQI calculation**
- 🚨 **Risk classification and station-level alerts**
- 🔎 **Dominant-pollutant detection**
- 📈 **Persistence and trend analysis**
- 📍 **15 monitoring stations**
- 🔥 **Fire/stubble-burning contextual information**
- 🖥️ **FastAPI + React interactive dashboard**

---

# 🏭 Data Sources

## CPCB

**Central Pollution Control Board** provides the station-level air-quality observations used by the system.

CPCB's breakpoint/sub-index methodology is also used for AQI derivation.

```text
CPCB → Pollution Data + AQI Methodology
```

## ERA5

**ERA5** is the atmospheric reanalysis dataset produced by ECMWF.

It provides meteorological information used to make the forecasting architecture weather-aware.

```text
ERA5 → Meteorological Information
```

---

# 🧠 Technical Approach

The forecasting layer uses **XGBoost** because the project primarily deals with structured/tabular pollution and meteorological information and requires modelling nonlinear relationships across multiple forecasting tasks.

Each model predicts:

> **One pollutant at one specific forecast horizon.**

Importantly, the ML models **do not directly predict AQI**.

Instead:

```text
XGBoost
   ↓
Pollutant Concentrations
   ↓
CPCB Breakpoints / Sub-Indices
   ↓
AQI
   ↓
Risk + Intelligence
```

This preserves individual pollutant information and allows the system to identify the dominant pollutant.

---

# 🚨 Early-Warning Intelligence

After forecasting, VayuGuard–NCR generates:

- Risk levels
- Dominant pollutant
- Persistence/trend information
- Station-level alerts

This transforms raw forecasts into actionable information.

```text
Forecast + AQI + Risk + Trend
                ↓
       Station-Level Alert
```

---

# 🔥 Environmental Context

Fire and stubble-burning information is included as an **environmental context layer** to help interpret regional pollution episodes.

It is **not currently used as a direct input to the existing 42 XGBoost models**.

Direct integration would require validated fire/emission variables and model retraining.

---

# 🏗️ System Architecture

```text
┌─────────────────────┐
│   CPCB Air Quality  │
└──────────┬──────────┘
           │
           ├──────────────┐
           │              │
           ▼              ▼
┌─────────────────┐ ┌─────────────────┐
│ Data Preparation│ │ ERA5 Meteorology│
└────────┬────────┘ └────────┬────────┘
         └──────────┬────────┘
                    ▼
          ┌───────────────────┐
          │ 42 XGBoost Models │
          └─────────┬─────────┘
                    ▼
          Future Concentrations
                    │
                    ▼
               CPCB AQI
                    │
                    ▼
        Risk + Dominant Pollutant
        + Persistence / Trend
                    │
                    ▼
             Station Alerts
                    │
                    ▼
             FastAPI Backend
                    │
                    ▼
             React Dashboard
```

---

# 💻 Technology Stack

| Component | Technology |
|---|---|
| Machine Learning | XGBoost |
| Programming | Python |
| Data Processing | Pandas |
| Backend | FastAPI |
| Frontend | React |
| Air Quality | CPCB |
| Meteorology | ERA5 |
| AQI | CPCB Methodology |

---

# 📊 Dashboard

The dashboard provides:

### 72-Hour Forecasting
Station-wise forecasts for all seven pollutants across six horizons.

### Intelligent Alerts
Risk level, dominant pollutant, persistence/trend and station alerts.

### Station Intelligence
Location-specific pollution and AQI information across 15 stations.

### Environmental Context
Meteorological and fire/stubble-burning information alongside pollution forecasts.

---

# 🧪 Validation

The forecasting system is evaluated across:

- Pollutants
- Forecast horizons
- Stations

using:

- **MAE** — Mean Absolute Error
- **RMSE** — Root Mean Squared Error
- **R²** — Coefficient of Determination

The project does not rely on a single generic "accuracy" percentage because pollutant forecasting is a regression problem.

---

# ✅ System Verification

The integrated application has been verified through:

- FastAPI/Pandas import checks
- Uvicorn startup verification
- API endpoint checks
- **9 automated backend tests**
- React production build verification
- Frontend-backend connectivity verification

---

# ⚠️ Limitations

Current limitations include:

- Forecast uncertainty, especially at longer horizons
- Missing or inconsistent air-quality observations
- Meteorological spatial-resolution limitations
- Difficulty modelling sudden episodic events
- Fire/stubble-burning information is currently contextual rather than a direct ML input

**WRF-Chem is not part of the current implementation** and is considered a potential future extension.

---

# 🚀 Future Roadmap

- Automated CPCB and meteorological data ingestion
- Scheduled model retraining and validation
- Higher-resolution meteorological information
- Validated fire/emission features
- Production-scale deployment
- Physics-informed extensions such as WRF-Chem
- Expansion to additional cities and monitoring stations

---

# 💡 Innovation

The innovation is not simply the use of XGBoost.

VayuGuard–NCR integrates:

```text
Multi-Pollutant Forecasting
        +
Weather Coupling
        +
42-Model Forecast Matrix
        +
CPCB AQI
        +
Dominant-Pollutant Detection
        +
Persistence / Trend Analysis
        +
Station-Level Alerts
        +
Environmental Context
```

into one end-to-end forecasting and early-warning workflow.

---

# 🏆 Smart India Hackathon 2026

**Problem Statement:** SIH26082  
**Title:** Air Pollution–Weather Coupled Forecasting System (Delhi NCR Focus)  
**Theme:** Clean & Green Technology  
**Category:** Software  
**Team:** AeroForge  
**Project:** VayuGuard–NCR

---

# Live Demo

🔗 [Try the app here](https://vayuguard-ncr.vercel.app/)

---

# 📚 References

- Central Pollution Control Board (CPCB) — National Air Quality Index
- ERA5 / ECMWF / Copernicus
- Chen & Guestrin — *XGBoost: A Scalable Tree Boosting System*
- WRF-Chem / UCAR — Future physics-informed extension

---

<p align="center">
  <b>VayuGuard–NCR</b><br>
  <i>From Pollution Data to 72-Hour Early-Warning Intelligence.</i>
</p>
