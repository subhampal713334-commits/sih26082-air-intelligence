import { Flame, Radio, Route, Wind } from "lucide-react";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

type FirePayload = { status: string; title: string; message: string; intended_inputs: string[] };

export function Fire() {
  const { data, loading, error } = useApi<FirePayload>("/fire");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Stubble-burning and plume context</span>
          <h1>Regional Fire Influence</h1>
          <p>Contextual architecture for regional fire-source influence without inventing hotspot observations.</p>
        </div>
        <div className="status-strip">
          <span className="status-live">{data.status.replace("_", " ")}</span>
          <strong>{data.title}</strong>
          <small>Current forecasts remain the verified 42-model pollutant system.</small>
        </div>
      </header>
      <section className="panel fire-panel">
        <div className="fire-radar" aria-hidden="true">
          <Flame size={44} />
          <span />
          <span />
        </div>
        <div>
          <h2>{data.title}</h2>
          <p>{data.message}</p>
          <div className="chip-row">
            <span className="chip">No fabricated hotspots</span>
            <span className="chip">FIRMS-ready layer</span>
            <span className="chip">Forecast models unchanged</span>
          </div>
        </div>
      </section>
      <section className="panel">
        <h2>Planned FIRMS Inputs</h2>
        <div className="chip-row">
          {data.intended_inputs.map((item, index) => {
            const Icon = index % 3 === 0 ? Flame : index % 3 === 1 ? Wind : Route;
            return <span className="chip icon-chip" key={item}><Icon size={15} />{item}</span>;
          })}
        </div>
      </section>
      <section className="panel">
        <h2>Integration Logic</h2>
        <div className="timeline">
          <span><Radio size={16} /> Fire source feed</span>
          <span><Wind size={16} /> Wind transport context</span>
          <span><Route size={16} /> Distance-weighted plume signal</span>
          <span><Flame size={16} /> Dashboard influence layer</span>
        </div>
      </section>
    </div>
  );
}
