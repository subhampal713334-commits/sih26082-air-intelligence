export const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export type Station = {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  aqi?: number;
  category?: string;
  risk?: string;
  dominant_pollutant?: string;
  trend?: string;
  persistence?: string;
  alert_priority?: string;
  forecast?: ForecastPoint[];
};

export type ForecastPoint = {
  horizon_h: number;
  label: string;
  forecast_timestamp: string;
  aqi: number;
  category: string;
  risk: string;
  dominant_pollutant: string;
  warning?: string;
  recommendation?: string;
  weather_explanation?: string;
  pollutants: Record<string, number>;
};

export type Overview = {
  project: string;
  region: string;
  system: string;
  dataset_status: string;
  latest_available_timestamp: string;
  total_stations: number;
  pollutants: string[];
  horizons: string[];
  model_inventory?: {
    trained_model_count: number;
    expected_model_count: number;
    model_type: string;
  };
  current: {
    aqi: number;
    category: string;
    dominant_pollutant: string;
    critical_alert_count: number;
    highest_risk_station?: Station;
  };
  station_summary: Station[];
  latest_alerts: AlertItem[];
};

export type AlertItem = {
  timestamp: string;
  station_id: string;
  station_name: string;
  aqi: number;
  category: string;
  risk: string;
  dominant_pollutant: string;
  trend: string;
  persistence: string;
  priority: string;
  message: string;
  recommendation: string;
};
