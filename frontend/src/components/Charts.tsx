import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { ForecastPoint } from "../api";

const tooltipStyle = {
  background: "rgba(9, 18, 24, .96)",
  border: "1px solid rgba(125, 211, 252, .22)",
  borderRadius: 8,
  color: "#e7f2f2",
  boxShadow: "0 18px 42px rgba(0,0,0,.35)"
};

export function AqiOutlook({ data }: { data: ForecastPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="aqiFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.42} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
        <XAxis dataKey="label" stroke="#91a4b7" />
        <YAxis stroke="#91a4b7" domain={[0, 500]} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
        <Area type="monotone" dataKey="aqi" stroke="#f59e0b" fill="url(#aqiFill)" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PollutantChart({ data, pollutant }: { data: ForecastPoint[]; pollutant: string }) {
  const rows = data.map((point) => ({
    label: point.label,
    value: pollutant === "AQI" ? point.aqi : point.pollutants?.[pollutant]
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={rows} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
        <XAxis dataKey="label" stroke="#91a4b7" />
        <YAxis stroke="#91a4b7" />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
        <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }} activeDot={{ r: 7 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MultiPollutantChart({ data }: { data: ForecastPoint[] }) {
  const rows = data.map((point) => ({
    label: point.label,
    "PM2.5": point.pollutants?.["PM2.5"],
    PM10: point.pollutants?.["PM10"],
    NO2: point.pollutants?.["NO2"],
    SO2: point.pollutants?.["SO2"],
    CO: point.pollutants?.["CO"],
    O3: point.pollutants?.["O3"],
    NH3: point.pollutants?.["NH3"],
  }));

  const colors: Record<string, string> = {
    "PM2.5": "#18BC9C",
    PM10: "#E67E22",
    NO2: "#27AE60",
    SO2: "#8E44AD",
    CO: "#2C3E50",
    O3: "#F39C12",
    NH3: "#9B59B6",
  };

  const legendItems = [
    { name: "PM2.5", color: colors["PM2.5"] },
    { name: "PM10", color: colors["PM10"] },
    { name: "NO2", color: colors["NO2"] },
    { name: "SO2", color: colors["SO2"] },
    { name: "CO", color: colors["CO"] },
    { name: "O3", color: colors["O3"] },
    { name: "NH3", color: colors["NH3"] },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={rows} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="multiPollutantFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
        <XAxis dataKey="label" stroke="#91a4b7" />
        <YAxis stroke="#91a4b7" domain={[0, 500]} />
        <Tooltip contentStyle={{ background: "rgba(9, 18, 24, .96)", border: "1px solid rgba(125, 211, 252, .22)", borderRadius: 8, color: "#e7f2f2" }} labelStyle={{ color: "#fff" }} />
        {legendItems.map(({ name, color }) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        ))}
        <Legend verticalAlign="bottom" height={36} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MetricBar({ data, metric }: { data: Record<string, unknown>[]; metric: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
        <XAxis dataKey="Horizon_h" stroke="#91a4b7" />
        <YAxis stroke="#91a4b7" />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
        <Bar dataKey={metric} fill="#7dd3fc" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
