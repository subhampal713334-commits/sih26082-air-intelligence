import { Activity, AlertTriangle, BrainCircuit, Database, Flame, Gauge, MapPin, Wind } from "lucide-react";
import { Overview } from "../api";
import { AqiOutlook, MultiPollutantChart } from "../components/Charts";
import { KpiCard } from "../components/KpiCard";
import { StationMap } from "../components/StationMap";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";
import { AqiBadge } from "../components/Aqi";

export function Dashboard() {
  const { data, loading, error } = useApi<Overview>("/overview");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  const worst = data.current.highest_risk_station;
  const forecast = worst?.forecast ?? [];
  const alertTone = data.current.critical_alert_count > 0 ? "rose" : "emerald";
  return (
    <div className="page">
      <header className="hero">
        <div>
          <span className="eyebrow">Delhi NCR early-warning system</span>
          <h1>Delhi NCR 72-hour air-pollution forecasting</h1>
          <p>{data.system}</p>
          <div className="chip-row">
            <span className="chip">Multi-pollutant forecasting</span>
            <span className="chip">Weather-pollution coupling</span>
            <span className="chip">CPCB AQI derivation</span>
            <span className="chip">Station-level alerts</span>
          </div>
        </div>
        <div className="status-strip">
          <span className="status-live">Verified artifact mode</span>
          <strong>{data.model_inventory?.trained_model_count ?? 42} XGBoost pollutant models</strong>
          <small>Last dataset timestamp</small>
          <span>{new Date(data.latest_available_timestamp).toLocaleString()}</span>
          <small>{data.dataset_status}</small>
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard label="Latest AQI" value={Math.round(data.current.aqi)} detail={<AqiBadge category={data.current.category} />} icon={<Gauge />} tone="amber" />
        <KpiCard label="Dominant Pollutant" value={data.current.dominant_pollutant} detail="Across latest station summaries" icon={<Activity />} tone="cyan" />
        <KpiCard label="Highest Risk Station" value={worst?.station_name ?? "Data unavailable"} detail={worst?.risk ?? "Risk unavailable"} icon={<MapPin />} tone="violet" />
        <KpiCard label="Critical Alerts" value={data.current.critical_alert_count} detail="Latest available timestamp" icon={<AlertTriangle />} tone={alertTone} />
      </section>

      <section className="multi-pollutant-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">42 pollutant forecasts → CPCB AQI → Alerts</span>
            <h2>MULTI-POLLUTANT FORECAST</h2>
          </div>
          <span className="mini-stat">7 pollutants × 6 horizons</span>
        </div>
        <MultiPollutantChart data={forecast} />
      </section>

      <section className="dashboard-grid">
        <div className="panel wide">
          <div className="section-title">
            <div>
              <span className="eyebrow">15 CPCB monitoring stations</span>
              <h2>Delhi NCR Station Intelligence</h2>
            </div>
            <span className="mini-stat">{data.total_stations} stations</span>
          </div>
          <StationMap stations={data.station_summary} />
        </div>
        <div className="panel">
          <div className="section-title">
            <div>
              <span className="eyebrow">Worst-station trajectory</span>
              <h2>72-hour AQI Outlook</h2>
            </div>
          </div>
          {forecast.length ? <AqiOutlook data={forecast} /> : <div className="state compact">Forecast unavailable</div>}
          <div className="outlook-strip">
            {forecast.map((point) => (
              <div key={point.label}>
                <span>{point.label}</span>
                <strong>{Math.round(point.aqi)}</strong>
                <small>{point.category}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="intel-grid">
        <article className="panel factor">
          <BrainCircuit />
          <span>Forecast Architecture</span>
          <strong>{data.pollutants.length} pollutants x {data.horizons.length} horizons</strong>
          <small>AQI is derived from CPCB sub-index logic, not presented as a separate ML model.</small>
        </article>
        <article className="panel factor">
          <Wind />
          <span>Atmospheric Intelligence</span>
          <strong>Physics-informed ML</strong>
          <small>Meteorological dispersion context is shown only from verified artifacts.</small>
        </article>
        <article className="panel factor">
          <Flame />
          <span>Regional Fire Context</span>
          <strong>Integration ready</strong>
          <small>No fire hotspots are fabricated when FIRMS-style inputs are unavailable.</small>
        </article>
        <article className="panel factor">
          <Database />
          <span>Artifact Source</span>
          <strong>Precomputed 2025 forecasts</strong>
          <small>Historical dataset timestamps are exposed honestly instead of labelled live.</small>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <span className="eyebrow">Early-warning feed</span>
            <h2>Latest Alerts</h2>
          </div>
        </div>
        <div className="alert-list">
          {data.latest_alerts.map((alert) => (
            <article key={`${alert.station_id}-${alert.timestamp}`} className="alert-card">
              <div className="alert-head">
                <strong>{alert.priority}</strong>
                <AqiBadge category={alert.category} />
              </div>
              <span>{alert.station_name}</span>
              <small>AQI {Math.round(alert.aqi)} | {alert.dominant_pollutant} | {alert.trend} | {alert.persistence}</small>
              <p>{alert.recommendation}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
