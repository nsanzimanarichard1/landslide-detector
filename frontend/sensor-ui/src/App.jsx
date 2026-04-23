import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Alerts from "./pages/Alerts.jsx";
import Reports from "./pages/Reports.jsx";
import ZoneMap from "./pages/ZoneMap.jsx";
import Settings from "./pages/Settings.jsx";

const API = "http://localhost:5000/api";

export default function App() {
  const [page,   setPage]   = useState("dashboard");
  const [data,   setData]   = useState([]);
  const [risk,   setRisk]   = useState({ risk: "LOW", riskScore: 0 });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const poll = async () => {
      const [sensorRes, riskRes, alertRes] = await Promise.all([
        axios.get(`${API}/data`),
        axios.get(`${API}/risk`),
        axios.get(`${API}/alerts`),
      ]);
      setData(sensorRes.data.slice(-30));
      setRisk(riskRes.data);
      setAlerts(alertRes.data);
    };
    poll();
    const interval = setInterval(poll, 500);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  const pages = {
    dashboard: <Dashboard data={data} risk={risk} />,
    alerts:    <Alerts alerts={alerts} />,
    reports:   <Reports data={data} alerts={alerts} />,
    map:       <ZoneMap risk={risk} latest={latest} />,
    settings:  <Settings />,
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar active={page} onNavigate={setPage} risk={risk.risk} />
      {/* pb-20 on mobile to avoid content hiding behind bottom nav */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
        {pages[page]}
      </main>
    </div>
  );
}
