import { useEffect, useState } from "react";
import { Thermometer, Wind } from "lucide-react";
import { Station } from "../api";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

type Weather = { station_id: string; timestamp: string; status: string; factors: { key: string; label: string; value: number }[]; note: string };

export function Atmosphere() {
  const { data: stations } = useApi<Station[]>("/stations");
  const [stationId, setStationId] = useState("site_124");
  useEffect(() => {
    if (stations?.length && !stations.some((station) => station.station_id === stationId)) {
      setStationId(stations[0].station_id);
    }
  }, [stations, stationId]);
  const { data, loading, error } = useApi<Weather>(`/weather/${stationId}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Weather-pollution coupling</span>
          <h1>Atmospheric Intelligence</h1>
          <p className="lede">Meteorology influences pollutant dispersion and accumulation. Values are shown only when verified in repository artifacts.</p>
        </div>
        <div className="status-strip">
          <span className="status-live">{data.status.replace("_", " ")}</span>
          <strong>{new Date(data.timestamp).toLocaleString()}</strong>
          <small>{data.note}</small>
        </div>
      </header>
      <div className="toolbar panel">
        <label>
          <Wind size={16} />
          <select value={stationId} onChange={(event) => setStationId(event.target.value)} aria-label="Station">
            {stations?.map((station) => <option key={station.station_id} value={station.station_id}>{station.station_name}</option>)}
          </select>
        </label>
      </div>
      <div className="factor-grid">
        {data.factors.map((factor) => (
          <section className="panel factor" key={factor.key}>
            <Thermometer />
            <span>{factor.label}</span>
            <strong>{Number(factor.value).toFixed(2)}</strong>
          </section>
        ))}
        {!data.factors.length && <section className="panel state">Meteorological values unavailable for this artifact.</section>}
      </div>
      <section className="panel">
        <h2>Scientific Framing</h2>
        <p>Weather-pollution coupling supports dispersion, stagnation, boundary-layer, and inversion-related indicators without claiming a full atmospheric chemistry simulation.</p>
      </section>
    </div>
  );
}
