import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Legend, Tooltip, Filler,
} from "chart.js";
import { WiThermometer, WiHumidity } from "react-icons/wi";
import { TbActivityHeartbeat } from "react-icons/tb";
import { MdSpeed, MdOutlineRadar } from "react-icons/md";
import StatCard from "../components/StatCard.jsx";
import { chartOptions, makeDataset, RISK_CONFIG } from "../components/chartConfig.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

function RiskBanner({ risk, riskScore }) {
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.LOW;
  return (
    <div className={`rounded-2xl border p-4 md:p-5 ${cfg.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6`}>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Landslide Risk Level</p>
        <p className={`text-2xl md:text-3xl font-black ${cfg.color}`}>{cfg.icon} {risk}</p>
        <p className="text-slate-400 text-sm mt-1">
          Risk Score: <span className={`font-bold ${cfg.color}`}>{riskScore} / 100</span>
        </p>
      </div>
      <div className="w-full sm:w-40">
        <div className="text-slate-400 text-xs mb-1 text-right">{riskScore}%</div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all duration-500 ${cfg.bar}`}
            style={{ width: `${Math.min(riskScore, 100)}%` }} />
        </div>
        <div className="flex justify-between text-slate-600 text-xs mt-1">
          <span>0</span><span>50</span><span>100</span>
        </div>
      </div>
    </div>
  );
}

function SensorChart({ title, chartData }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
      <h3 className="text-slate-300 font-semibold mb-4 text-xs uppercase tracking-widest">{title}</h3>
      <Line data={chartData} options={chartOptions()} />
    </div>
  );
}

export default function Dashboard({ data, risk }) {
  const labels = data.map((d) => new Date(d.createdAt).toLocaleTimeString());
  const latest = data[data.length - 1];

  const accelChart = { labels, datasets: [
    makeDataset("X (ax)", data.map((d) => d.ax), "#38bdf8"),
    makeDataset("Y (ay)", data.map((d) => d.ay), "#a78bfa"),
    makeDataset("Z (az)", data.map((d) => d.az), "#34d399"),
  ]};

  const gyroChart = { labels, datasets: [
    makeDataset("X (gx)", data.map((d) => d.gx), "#f472b6"),
    makeDataset("Y (gy)", data.map((d) => d.gy), "#fb923c"),
    makeDataset("Z (gz)", data.map((d) => d.gz), "#facc15"),
  ]};

  const magChart = { labels, datasets: [
    makeDataset("X (mx)", data.map((d) => d.mx), "#38bdf8"),
    makeDataset("Y (my)", data.map((d) => d.my), "#a78bfa"),
    makeDataset("Z (mz)", data.map((d) => d.mz), "#34d399"),
  ]};

  const envChart = { labels, datasets: [
    makeDataset("Temperature (°C)", data.map((d) => d.temp), "#fb923c"),
    makeDataset("Humidity (%)",      data.map((d) => d.hum),  "#38bdf8"),
  ]};

  return (
    <div>
      <RiskBanner risk={risk.risk} riskScore={risk.riskScore} />

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          <StatCard label="Temperature" value={latest.temp?.toFixed(2)} unit="°C"    color="text-orange-400" sub="HS3003 sensor" icon={<WiThermometer size={22} />} />
          <StatCard label="Humidity"    value={latest.hum?.toFixed(2)}  unit="%"     color="text-sky-400"    sub="HS3003 sensor" icon={<WiHumidity size={22} />} />
          <StatCard label="Accel Y"     value={latest.ay?.toFixed(3)}   unit="g"     color="text-violet-400" sub="IMU BMI270" icon={<TbActivityHeartbeat size={18} />} />
          <StatCard label="Gyro Mag"    value={Math.sqrt(latest.gx**2 + latest.gy**2 + latest.gz**2).toFixed(3)} unit="°/s" color="text-pink-400" sub="IMU BMI270" icon={<MdSpeed size={18} />} />
          <StatCard label="Risk Score"  value={risk.riskScore}           unit="/ 100" color={RISK_CONFIG[risk.risk]?.color} sub="Combined score" icon={<MdOutlineRadar size={18} />} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <SensorChart title="Accelerometer (g) — Ground Movement" chartData={accelChart} />
        <SensorChart title="Gyroscope (°/s) — Slope Tilt"        chartData={gyroChart} />
        <SensorChart title="Magnetometer (µT) — Field Anomaly"   chartData={magChart} />
      </div>

      <SensorChart title="Temperature & Humidity — Soil Saturation" chartData={envChart} />
    </div>
  );
}
