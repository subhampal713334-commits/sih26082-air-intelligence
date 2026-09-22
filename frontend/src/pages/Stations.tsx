import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Station } from "../api";
import { AqiBadge } from "../components/Aqi";
import { StationMap } from "../components/StationMap";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

export function Stations() {
  const { data, loading, error } = useApi<Station[]>("/stations");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">CPCB station network</span>
          <h1>Monitoring Stations</h1>
          <p>Explore Delhi NCR station intelligence with AQI category, dominant pollutant, and trend context.</p>
        </div>
        <div className="status-strip">
          <strong>{data.length} stations</strong>
          <small>Coordinates loaded from repository artifacts</small>
        </div>
      </header>
      <section className="panel">
        <StationMap stations={data} />
      </section>
      <div className="station-grid">
        {data.map((station) => (
          <Link to={`/stations/${station.station_id}`} className="panel station-card" key={station.station_id}>
            <div className="station-card-head">
              <MapPin size={17} />
              <strong>{station.station_name}</strong>
            </div>
            <span>{station.station_id}</span>
            <AqiBadge category={station.category} />
            <b>AQI {Math.round(station.aqi ?? 0)}</b>
            <small>{station.dominant_pollutant} | {station.trend}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
