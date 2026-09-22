import { useState } from "react";
import { AlertTriangle, Filter } from "lucide-react";
import { AlertItem } from "../api";
import { AqiBadge } from "../components/Aqi";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

export function Alerts() {
  const [severity, setSeverity] = useState("");
  const path = severity ? `/alerts?severity=${severity}&limit=80` : "/alerts?limit=80";
  const { data, loading, error } = useApi<AlertItem[]>(path);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  const criticalCount = data.filter((alert) => alert.priority === "CRITICAL").length;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Risk, trend, persistence, and recommendation</span>
          <h1>Alert Center</h1>
          <p>Station-level early-warning alerts generated from verified forecast artifacts.</p>
        </div>
        <div className="status-strip">
          <span className="status-live">Filtered feed</span>
          <strong>{data.length} alerts</strong>
          <small>{criticalCount} critical in current view</small>
        </div>
      </header>
      <div className="toolbar panel">
        <label>
          <Filter size={16} />
          <select value={severity} onChange={(event) => setSeverity(event.target.value)} aria-label="Alert severity">
            <option value="">All severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="SEVERE">SEVERE</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>
      </div>
      <div className="alert-list">
        {data.map((alert) => (
          <article className="panel alert-card" key={`${alert.station_id}-${alert.timestamp}`}>
            <div className="alert-head">
              <strong><AlertTriangle size={16} /> {alert.priority}</strong>
              <AqiBadge category={alert.category} />
            </div>
            <span>{alert.station_name}</span>
            <small>{new Date(alert.timestamp).toLocaleString()}</small>
            <div className="alert-metrics">
              <span>AQI <b>{Math.round(alert.aqi)}</b></span>
              <span>{alert.risk}</span>
              <span>{alert.dominant_pollutant}</span>
              <span>{alert.trend}</span>
              <span>{alert.persistence}</span>
            </div>
            <p>{alert.message}</p>
            <p>{alert.recommendation}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
