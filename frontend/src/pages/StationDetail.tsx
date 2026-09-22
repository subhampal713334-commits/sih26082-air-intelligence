import { useParams } from "react-router-dom";
import { Activity, AlertTriangle, MapPin, Wind } from "lucide-react";
import { ForecastPoint, Station } from "../api";
import { AqiBadge } from "../components/Aqi";
import { AqiOutlook, PollutantChart } from "../components/Charts";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

type Detail = Station & { forecast: ForecastPoint[]; message: string };

export function StationDetail() {
  const { stationId } = useParams();
  const { data, loading, error } = useApi<Detail>(`/stations/${stationId}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Station-level intelligence</span>
          <h1>{data.station_name}</h1>
          <p>{data.station_id} | {data.latitude}, {data.longitude}</p>
          <div className="chip-row">
            <span className="chip">{data.risk || "Risk unavailable"}</span>
            <span className="chip">{data.dominant_pollutant || "Dominant pollutant unavailable"}</span>
            <span className="chip">{data.trend || "Trend unavailable"}</span>
          </div>
        </div>
        <div className={`aqi-orb ${data.category?.toLowerCase().replace(/\s+/g, "-") || ""}`}>
          <span>AQI</span>
          <strong>{Math.round(data.aqi ?? 0)}</strong>
          <AqiBadge category={data.category} />
        </div>
      </header>
      <section className="kpi-grid four">
        <section className="panel kpi tone-cyan">
          <div className="kpi-top"><span>Station ID</span><MapPin /></div>
          <strong>{data.station_id}</strong>
          <div className="kpi-detail">CPCB coordinate artifact</div>
        </section>
        <section className="panel kpi tone-violet">
          <div className="kpi-top"><span>Dominant Pollutant</span><Activity /></div>
          <strong>{data.dominant_pollutant || "Data unavailable"}</strong>
          <div className="kpi-detail">{data.category}</div>
        </section>
        <section className="panel kpi tone-amber">
          <div className="kpi-top"><span>Forecast Trend</span><Wind /></div>
          <strong>{data.trend || "Data unavailable"}</strong>
          <div className="kpi-detail">{data.persistence || "Persistence unavailable"}</div>
        </section>
        <section className="panel kpi tone-rose">
          <div className="kpi-top"><span>Alert Priority</span><AlertTriangle /></div>
          <strong>{data.alert_priority || "Data unavailable"}</strong>
          <div className="kpi-detail">{data.risk || "Risk unavailable"}</div>
        </section>
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <h2>72-hour Forecast</h2>
          <AqiOutlook data={data.forecast} />
        </div>
        <div className="panel">
          <h2>Pollutant Curve</h2>
          <PollutantChart data={data.forecast} pollutant={data.dominant_pollutant || "PM2.5"} />
        </div>
      </section>
      <section className="panel table-panel">
        <h2>Forecast Table</h2>
        <table>
          <thead><tr><th>Horizon</th><th>AQI</th><th>Category</th><th>Risk</th><th>Dominant</th><th>Recommendation</th></tr></thead>
          <tbody>
            {data.forecast.map((point) => (
              <tr key={point.label}>
                <td>{point.label}</td><td>{Math.round(point.aqi)}</td><td>{point.category}</td><td>{point.risk}</td><td>{point.dominant_pollutant}</td><td>{point.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
