import { NavLink, Route, Routes } from "react-router-dom";
import { Activity, AlertTriangle, BarChart3, Flame, Gauge, Map, RadioTower, Wind } from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Stations } from "./pages/Stations";
import { StationDetail } from "./pages/StationDetail";
import { Forecast } from "./pages/Forecast";
import { Alerts } from "./pages/Alerts";
import { Atmosphere } from "./pages/Atmosphere";
import { Fire } from "./pages/Fire";
import { Validation } from "./pages/Validation";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/stations", label: "Stations", icon: Map },
  { to: "/forecast", label: "Forecast", icon: BarChart3 },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/atmosphere", label: "Atmosphere", icon: Wind },
  { to: "/fire", label: "Fire Context", icon: Flame },
  { to: "/validation", label: "Validation", icon: Activity }
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><RadioTower size={22} /></div>
          <span>SIH26082</span>
          <strong>Air Pollution Intelligence</strong>
          <small>Delhi NCR</small>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/stations/:stationId" element={<StationDetail />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/atmosphere" element={<Atmosphere />} />
          <Route path="/fire" element={<Fire />} />
          <Route path="/validation" element={<Validation />} />
        </Routes>
      </main>
    </div>
  );
}
