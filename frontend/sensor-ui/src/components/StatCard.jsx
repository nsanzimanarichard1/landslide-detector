export default function StatCard({ label, value, unit, color, sub, icon }) {
  return (
    <div className="rounded-xl p-4 bg-slate-800 border border-slate-700 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <span className={`text-2xl font-bold ${color}`}>
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}
