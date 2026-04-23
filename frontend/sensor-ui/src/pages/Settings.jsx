import { MdSettings, MdTune, MdDevices, MdInfo } from "react-icons/md";

export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2"><MdSettings className="text-slate-400" /> Settings</h2>
      <p className="text-slate-400 text-sm mb-6">System configuration and thresholds</p>

      {/* Thresholds */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><MdTune className="text-yellow-400" /> Risk Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "MEDIUM threshold (score ≥)", value: "20", color: "text-yellow-400" },
            { label: "HIGH threshold (score ≥)",   value: "45", color: "text-orange-400" },
            { label: "CRITICAL threshold (score ≥)", value: "70", color: "text-red-400" },
            { label: "Humidity danger level (%)",  value: "85", color: "text-sky-400" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">{item.label}</label>
              <input
                defaultValue={item.value}
                className={`bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm font-bold ${item.color} focus:outline-none focus:border-sky-500`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><MdDevices className="text-sky-400" /> Device Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Serial Port",   value: "COM5" },
            { label: "Baud Rate",     value: "115200" },
            { label: "Poll Interval", value: "500ms" },
            { label: "Data Window",   value: "30 readings" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">{item.label}</label>
              <input
                defaultValue={item.value}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><MdInfo className="text-slate-400" /> About</h3>
        <div className="text-slate-400 text-sm space-y-1">
          <p>System: <span className="text-white">LandWatch v1.0</span></p>
          <p>Sensors: <span className="text-white">Arduino Nano 33 BLE — IMU BMI270 + BMM150 + HS3003</span></p>
          <p>Backend: <span className="text-white">Node.js + Express + MongoDB</span></p>
          <p>Frontend: <span className="text-white">React + Vite + Tailwind CSS</span></p>
          <p>Purpose: <span className="text-white">Real-time landslide early warning system</span></p>
        </div>
      </div>
    </div>
  );
}
