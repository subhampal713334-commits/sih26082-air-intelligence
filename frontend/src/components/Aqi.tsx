export function categoryClass(category?: string) {
  const normalized = (category || "").toLowerCase().replace(/\s+/g, "-");
  return `aqi-${normalized || "unknown"}`;
}

export function AqiBadge({ category }: { category?: string }) {
  return <span className={`badge ${categoryClass(category)}`}>{category || "Data unavailable"}</span>;
}
