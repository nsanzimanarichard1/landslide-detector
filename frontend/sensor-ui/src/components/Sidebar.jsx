import { MdDashboard, MdWarning, MdAssessment, MdMap, MdSettings } from "react-icons/md";
import { FiWifi } from "react-icons/fi";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={20} /> },
  { id: "alerts",    label: "Alerts",    icon: <MdWarning size={20} /> },
  { id: "reports",   label: "Reports",   icon: <MdAssessment size={20} /> },
  { id: "map",       label: "Map",       icon: <MdMap size={20} /> },
  { id: "settings",  label: "Settings",  icon: <MdSettings size={20} /> },
];

const RISK_CONFIG = {
  LOW:      { color: "text-emerald-400", label: "LOW" },
  MEDIUM:   { color: "text-yellow-400",  label: "MEDIUM" },
  HIGH:     { color: "text-orange-400",  label: "HIGH" },
  CRITICAL: { color: "text-red-400",     label: "CRITICAL" },
};

export default function Sidebar({ active, onNavigate, risk }) {
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.LOW;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-56 lg:w-60 min-h-screen bg-slate-900 border-r border-slate-800 flex-col shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            <FiWifi className="text-sky-400" /> LandWatch
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Landslide Monitoring</p>
        </div>

        {/* Live Risk */}
        <div className="mx-3 mt-4 rounded-xl bg-slate-800 border border-slate-700 p-3">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Current Risk</p>
          <p className={`font-black text-lg ${cfg.color}`}>{cfg.label}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 text-xs">Live monitoring</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3
                ${active === item.id
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-slate-600 text-xs">Arduino IMU + HS3003</p>
          <p className="text-slate-600 text-xs">COM5 · MongoDB</p>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-all
              ${active === item.id ? "text-sky-400" : "text-slate-500"}`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
