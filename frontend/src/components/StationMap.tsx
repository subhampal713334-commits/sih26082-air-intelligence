import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import { Station } from "../api";
import { AqiBadge, categoryClass } from "./Aqi";

function marker(station: Station) {
  const pulse = ["CRITICAL", "SEVERE", "VERY HIGH"].includes(String(station.risk || station.alert_priority || "").toUpperCase());
  return L.divIcon({
    className: "station-marker-wrap",
    html: `<span class="station-marker ${categoryClass(station.category)} ${pulse ? "is-pulsing" : ""}"><b>${Math.round(station.aqi ?? 0)}</b></span>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
}

export function StationMap({ stations }: { stations: Station[] }) {
  return (
    <div className="map-panel">
      <MapContainer center={[28.61, 77.21]} zoom={10} scrollWheelZoom={false} className="map">
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.station_id}
            position={[station.latitude, station.longitude]}
            icon={marker(station)}
          >
            <Popup>
              <div className="map-popup">
                <strong>{station.station_name}</strong>
                <span>{station.station_id}</span>
                <b>AQI {Math.round(station.aqi ?? 0)}</b>
                <AqiBadge category={station.category} />
                <small>{station.dominant_pollutant || "Data unavailable"} | {station.trend || "Trend unavailable"}</small>
                <Link to={`/stations/${station.station_id}`}>Open station</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
