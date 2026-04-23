import { MdAssessment, MdPrint, MdLocationOn, MdSensors, MdStorage, MdCode } from "react-icons/md";
import { RISK_CONFIG } from "../components/chartConfig.js";

function Section({ title, children }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
      <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value, color = "text-white" }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}

export default function Reports({ data, alerts }) {
  if (!data.length) return <p className="text-slate-500">Loading report data...</p>;

  const temps   = data.map((d) => d.temp).filter(Boolean);
  const hums    = data.map((d) => d.hum).filter(Boolean);
  const scores  = data.map((d) => d.riskScore || 0);
  const avg     = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  const max     = (arr) => Math.max(...arr).toFixed(2);
  const min     = (arr) => Math.min(...arr).toFixed(2);

  const riskCounts = data.reduce((acc, d) => {
    acc[d.risk] = (acc[d.risk] || 0) + 1;
    return acc;
  }, {});

  const generated = new Date().toLocaleString();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2"><MdAssessment className="text-sky-400" /> System Report</h2>
          <p className="text-slate-400 text-sm">Generated: {generated}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <MdPrint /> Print Report
        </button>
      </div>

      <Section title={<span className="flex items-center gap-2"><MdLocationOn className="text-sky-400" /> System Overview</span>}>
        <Row label="Monitoring System"   value="LandWatch v1.0" />
        <Row label="Sensors"             value="Arduino IMU BMI270 + HS3003" />
        <Row label="Serial Port"         value="COM5 @ 115200 baud" />
        <Row label="Database"            value="MongoDB · sensors collection" />
        <Row label="Total Readings"      value={data.length} color="text-sky-400" />
        <Row label="Total Alerts"        value={alerts.length} color="text-orange-400" />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
      <Section title={<span className="flex items-center gap-2"><MdSensors className="text-orange-400" /> Temperature & Humidity</span>}>
          <Row label="Avg Temperature" value={`${avg(temps)}°C`}  color="text-orange-400" />
          <Row label="Max Temperature" value={`${max(temps)}°C`}  color="text-red-400" />
          <Row label="Min Temperature" value={`${min(temps)}°C`}  color="text-sky-400" />
          <Row label="Avg Humidity"    value={`${avg(hums)}%`}    color="text-sky-400" />
          <Row label="Max Humidity"    value={`${max(hums)}%`}    color="text-orange-400" />
          <Row label="Min Humidity"    value={`${min(hums)}%`}    color="text-emerald-400" />
        </Section>

        <Section title="⚠️ Risk Distribution">
          {Object.entries(riskCounts).map(([level, count]) => {
            const cfg = RISK_CONFIG[level];
            const pct = ((count / data.length) * 100).toFixed(1);
            return (
              <div key={level} className="py-2 border-b border-slate-700/50 last:border-0">
                <div className="flex justify-between mb-1">
                  <span className={`font-bold text-sm ${cfg.color}`}>{cfg.icon} {level}</span>
                  <span className="text-white text-sm font-bold">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Section>
      </div>

      <Section title="📊 Risk Score Statistics">
        <Row label="Average Risk Score" value={`${avg(scores)} / 100`} color="text-yellow-400" />
        <Row label="Peak Risk Score"    value={`${max(scores)} / 100`} color="text-red-400" />
        <Row label="Lowest Risk Score"  value={`${min(scores)} / 100`} color="text-emerald-400" />
        <Row label="Critical Events"    value={alerts.filter((a) => a.risk === "CRITICAL").length} color="text-red-400" />
        <Row label="High Events"        value={alerts.filter((a) => a.risk === "HIGH").length}     color="text-orange-400" />
      </Section>

      <Section title="🕒 Recent Alert History">
        {alerts.slice(0, 10).length === 0 ? (
          <p className="text-slate-500 text-sm">No alerts recorded</p>
        ) : (
          alerts.slice(0, 10).map((a) => {
            const cfg = RISK_CONFIG[a.risk];
            return (
              <div key={a._id} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                <span className={`font-bold text-sm ${cfg.color}`}>{cfg.icon} {a.risk} — score: {a.riskScore}</span>
                <span className="text-slate-400 text-xs">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            );
          })
        )}
      </Section>
    </div>
  );
}
