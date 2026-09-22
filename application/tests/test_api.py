from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_station_listing():
    response = client.get("/api/stations")
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) == 15
    assert {"station_id", "station_name", "aqi"}.issubset(stations[0])


def test_station_lookup():
    response = client.get("/api/stations/site_124")
    assert response.status_code == 200
    assert response.json()["station_id"] == "site_124"


def test_missing_station():
    response = client.get("/api/stations/not_a_station")
    assert response.status_code == 404


def test_aqi_retrieval():
    response = client.get("/api/stations/site_124/aqi")
    assert response.status_code == 200
    assert len(response.json()["horizons"]) == 6


def test_forecast_retrieval():
    response = client.get("/api/stations/site_124/forecast")
    assert response.status_code == 200
    forecast = response.json()["forecast"]
    assert len(forecast) == 6
    assert "PM2.5" in forecast[0]["pollutants"]


def test_alert_retrieval():
    response = client.get("/api/stations/site_124/alerts?limit=5")
    assert response.status_code == 200
    assert len(response.json()) == 5


def test_horizon_serialization():
    response = client.get("/api/forecasts/site_124")
    assert response.status_code == 200
    labels = [item["label"] for item in response.json()["forecast"]]
    assert labels == ["+1h", "+6h", "+12h", "+24h", "+48h", "+72h"]


def test_validation():
    response = client.get("/api/validation")
    assert response.status_code == 200
    assert len(response.json()["metrics"]) == 42
