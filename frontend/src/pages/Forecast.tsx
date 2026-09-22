import { useMemo, useState } from "react";
import { BarChart3, Clock, Database, Gauge, MapPin } from "lucide-react";
import { ForecastPoint, Station } from "../api";
import { AqiBadge } from "../components/Aqi";
import { AqiOutlook, MultiPollutantChart, PollutantChart } from "../components/Charts";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

const pollutantList = ["PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"];
const horizonOptions = [1, 6, 12, 24, 48, 72];

export function Forecast() {
  const { data: stations } = useApi<Station[]>("/stations");
  const [stationId, setStationId] = useState("site_124");
  const [pollutant, setPollutant] = useState("PM2.5");
  const [horizon, setHorizon] = useState(72);
  const { data, loading, error } = useApi<{ forecast: ForecastPoint[] }>(`/forecasts/${stationId}`);
  const visible = useMemo(() => (data?.forecast ?? []).filter((point) => point.horizon_h <= horizon), [data, horizon]);
  const selectedStation = stations?.find((station) => station.station_id === stationId);
  const peak = visible.reduce<ForecastPoint | null>((current, point) => !current || point.aqi > current.aqi ? point : current, null);

  const renderPollutantTable = () => {
    if (!data?.forecast) return null;
    return (
      <table className="pollutant-table">
        <thead>
          <tr>
            <th>Pollutant</th>
            <th>Unit</th>
            {data.forecast.map((point) => <th key={point.label}>{point.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {pollutantList.map((p) => (
            <tr key={p}>
              <td><strong>{p}</strong></td>
              <td>µg/m³</td>
              {data.forecast.map((point) => (
                <td key={`${p}-${point.label}`}>{point.pollutants?.[p] != null ? point.pollutants[p].toFixed(1) : "—"}</td>
              ))}
            </tr>
          ))}
          <tr className="aqi-row">
            <td><strong>AQI</strong></td>
            <td>—</td>
            {data.forecast.map((point) => (
              <td key={`aqi-${point.label}`}><strong>{Math.round(point.aqi)}</strong></td>
            ))}
          </tr>
          <tr>
            <td><strong>Dominant pollutant</strong></td>
            <td>—</td>
            {data.forecast.map((point) => <td key={`dom-${point.label}`}>{point.dominant_pollutant}</td>)}
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Interactive pollutant horizon analysis</span>
          <h1>Forecast Workbench</h1>
          <p>Explore verified multi-pollutant forecasts across CPCB stations and model horizons.</p>
        </div>
      </header>
      <div className="toolbar panel">
        <label>
          <MapPin size={16} />
          <select value={stationId} onChange={(event) => setStationId(event.target.value)} aria-label="Station">
          {stations?.map((station) => <option key={station.station_id} value={station.station_id}>{station.station_name}</option>)}
          </select>
        </label>
        <label>
          <BarChart3 size={16} />
          <select value={pollutant} onChange={(event) => setPollutant(event.target.value)} aria-label="Pollutant">
            {pollutantList.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <Clock size={16} />
          <select value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} aria-label="Forecast horizon">
            {horizonOptions.map((item) => <option key={item} value={item}>{item}h horizon</option>)}
          </select>
        </label>
      </div>
      {loading && <Loading />}
      {error && <ErrorState message={error} />}
      {data && (
        <>
          <section className="multi-pollutant-section">
            <div className="section-title">
              <div>
                <span className="eyebrow">42 pollutant forecasts → CPCB AQI → Alerts</span>
                <h2>MULTI-POLLUTANT FORECAST</h2>
              </div>
              <span className="mini-stat">7 pollutants × 6 horizons</span>
            </div>
            <MultiPollutantChart data={data.forecast} />
          </section>

          <section className="kpi-grid three">
            <article className="panel kpi tone-cyan">
              <div className="kpi-top"><span>Station</span><MapPin /></div>
              <strong>{selectedStation?.station_name ?? stationId}</strong>
              <div className="kpi-detail">{selectedStation?.station_id}</div>
            </article>
            <article className="panel kpi tone-amber">
              <div className="kpi-top"><span>Peak AQI in view</span><Gauge /></div>
              <strong>{peak ? Math.round(peak.aqi) : "Data unavailable"}</strong>
              <div className="kpi-detail">{peak && <AqiBadge category={peak.category} />}</div>
            </article>
            <article className="panel kpi tone-violet">
              <div className="kpi-top"><span>Dominant pollutant</span><Database /></div>
              <strong>{peak?.dominant_pollutant ?? "Data unavailable"}</strong>
              <div className="kpi-detail">{peak?.risk ?? "Risk unavailable"}</div>
            </article>
          </section>

          <div className="dashboard-grid">
            <div className="panel">
              <div className="section-title">
                <div>
                  <span className="eyebrow">CPCB AQI derived section</span>
                  <h2>72-hour AQI Outlook</h2>
                </div>
              </div>
              {data.forecast.length ? <AqiOutlook data={data.forecast} /> : <div className="state compact">Forecast unavailable</div>}
              <div className="outlook-strip">
                {data.forecast.map((point) => (
                  <div key={point.label}>
                    <span>{point.label}</span>
                    <strong>{Math.round(point.aqi)}</strong>
                    <small>{point.category}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="section-title">
                <div>
                  <span className="eyebrow">{horizon}h selected horizon</span>
                  <h2>{pollutant} Forecast</h2>
                </div>
              </div>
              <PollutantChart data={visible} pollutant={pollutant} />
            </div>
          </div>

          <section className="panel table-panel">
            <h2>Forecast Table</h2>
            <table>
              <thead><tr><th>Horizon</th><th>AQI</th><th>Category</th><th>Risk</th><th>Dominant</th><th>Forecast timestamp</th></tr></thead>
              <tbody>
                {visible.map((point) => (
                  <tr key={point.label}>
                    <td>{point.label}</td>
                    <td>{Math.round(point.aqi)}</td>
                    <td>{point.category}</td>
                    <td>{point.risk}</td>
                    <td>{point.dominant_pollutant}</td>
                    <td>{new Date(point.forecast_timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="panel table-panel">
            <div className="section-title">
              <div>
                <span className="eyebrow">All 7 pollutants, all 6 horizons</span>
                <h2>Multi-Pollutant Forecast Table</h2>
              </div>
            </div>
            {renderPollutantTable()}
          </section>
        </>
      )}
    </div>
  );
}
