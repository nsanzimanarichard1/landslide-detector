export const chartOptions = () => ({
  responsive: true,
  animation: { duration: 300 },
  plugins: {
    legend: { position: "top", labels: { color: "#94a3b8", font: { size: 11 } } },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { ticks: { color: "#475569", maxTicksLimit: 6, maxRotation: 0 }, grid: { color: "#1e293b" } },
    y: { ticks: { color: "#475569" }, grid: { color: "#1e293b" } },
  },
});

export const makeDataset = (label, values, color) => ({
  label, data: values,
  borderColor: color, backgroundColor: color + "22",
  borderWidth: 2, pointRadius: 0, tension: 0.4, fill: true,
});

export const RISK_CONFIG = {
  LOW:      { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500", bar: "bg-emerald-400", icon: "🟢" },
  MEDIUM:   { color: "text-yellow-400",  bg: "bg-yellow-400/10 border-yellow-500",   bar: "bg-yellow-400",  icon: "🟡" },
  HIGH:     { color: "text-orange-400",  bg: "bg-orange-400/10 border-orange-500",   bar: "bg-orange-400",  icon: "🟠" },
  CRITICAL: { color: "text-red-400",     bg: "bg-red-400/10 border-red-500",         bar: "bg-red-500",     icon: "🔴" },
};
