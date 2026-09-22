import { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  detail,
  icon,
  tone = "cyan"
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  tone?: "cyan" | "amber" | "rose" | "emerald" | "violet";
}) {
  return (
    <section className={`panel kpi tone-${tone}`}>
      <div className="kpi-top">
        <span>{label}</span>
        <div className="kpi-icon">{icon}</div>
      </div>
      <strong>{value ?? "Data unavailable"}</strong>
      {detail && <div className="kpi-detail">{detail}</div>}
    </section>
  );
}
