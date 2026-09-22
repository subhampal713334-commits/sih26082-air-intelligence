import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit } from "lucide-react";
import { MetricBar } from "../components/Charts";
import { ErrorState, Loading } from "../components/Status";
import { useApi } from "../hooks";

type ValidationPayload = {
  methodology: Record<string, string | boolean>;
  metrics: Record<string, string | number>[];
  model_inventory: { trained_model_count: number; expected_model_count: number; model_type: string };
};

export function Validation() {
  const [pollutant, setPollutant] = useState("PM2.5");
  const { data, loading, error } = useApi<ValidationPayload>("/validation");
  const pollutants = useMemo(() => Array.from(new Set(data?.metrics.map((row) => String(row.Pollutant)) ?? [])), [data]);
  useEffect(() => {
    if (pollutants.length && !pollutants.includes(pollutant)) {
      setPollutant(pollutants[0]);
    }
  }, [pollutants, pollutant]);
  const rows = useMemo(() => data?.metrics.filter((row) => row.Pollutant === pollutant) ?? [], [data, pollutant]);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "No data"} />;
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Model Intelligence</span>
          <h1>Forecast Validation</h1>
          <p>Validation metrics are loaded from existing artifacts, preserving the chronological train/validation/test methodology.</p>
        </div>
        <div className="status-strip">
          <span className="status-live">Model inventory</span>
          <strong>{data.model_inventory.trained_model_count}/{data.model_inventory.expected_model_count}</strong>
          <small>{data.model_inventory.model_type} pollutant models</small>
        </div>
      </header>
      <div className="toolbar panel">
        <label>
          <Activity size={16} />
          <select value={pollutant} onChange={(event) => setPollutant(event.target.value)} aria-label="Pollutant">
            {pollutants.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <span>{rows.length} horizon rows</span>
      </div>
      <section className="dashboard-grid">
        <div className="panel"><h2>Test MAE</h2><MetricBar data={rows} metric="Test_MAE" /></div>
        <div className="panel"><h2>Test RMSE</h2><MetricBar data={rows} metric="Test_RMSE" /></div>
        <div className="panel"><h2>Test R2</h2><MetricBar data={rows} metric="Test_R2" /></div>
      </section>
      <section className="panel">
        <div className="method-card">
          <BrainCircuit />
          <div>
            <h2>Methodology</h2>
            <p>Chronological split: 2021-2023 training, 2024 validation, 2025 test. No random split.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
