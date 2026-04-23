import { useState, useEffect, useRef } from "react";
import { MdWarning, MdError, MdAccessTime, MdLocationOn, MdClose } from "react-icons/md";
import { RISK_CONFIG } from "../components/chartConfig.js";
import axios from "axios";

const DEFAULT_LAT = -1.9441;
const DEFAULT_LNG = 30.0619;

function AlertMapModal({ alert, onClose }) {
  const cfg = RISK_CONFIG[alert.risk];
  const lat = alert.lat ?? DEFAULT_LAT;
  const lng = alert.lng ?? DEFAULT_LNG;
  const mapRef = useRef(null);
  const [apiKey, setApiKey] = useState("");

  // Fetch API key from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/config")
      .then((res) => setApiKey(res.data.googleMapsApiKey || ""))
      .catch(() => {});
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Create marker with risk-based color
    const markerColor = alert.risk === "CRITICAL" ? "#ef4444" :
                        alert.risk === "HIGH" ? "#f97316" : "#eab308";

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: `Risk: ${alert.risk} (Score: ${alert.riskScore})`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: markerColor,
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className={`p-4 md:p-5 border-b border-slate-700 flex items-start justify-between rounded-t-2xl ${cfg.bg} shrink-0`}>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Alert Location</p>
            <p className={`text-lg md:text-xl font-black ${cfg.color} flex items-center gap-2`}>
              <MdLocationOn /> {alert.risk} RISK — Score: {alert.riskScore}
            </p>
            <p className="text-slate-400 text-xs mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors ml-4 shrink-0">
            <MdClose size={24} />
          </button>
        </div>

        {/* Coordinates Row */}
        <div className="px-4 md:px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-700 shrink-0">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Latitude</p>
            <p className="text-white font-bold font-mono text-sm">{lat.toFixed(6)}°</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Longitude</p>
            <p className="text-white font-bold font-mono text-sm">{lng.toFixed(6)}°</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Temp</p>
            <p className="text-orange-400 font-bold text-sm">{alert.temp?.toFixed(1)}°C</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Humidity</p>
            <p className="text-sky-400 font-bold text-sm">{alert.hum?.toFixed(1)}%</p>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-b-2xl overflow-hidden flex-1 min-h-0">
          {!apiKey ? (
            <div className="flex items-center justify-center h-[280px] bg-slate-700">
              <p className="text-slate-400">Loading map...</p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-[280px]" />
          )}
        </div>

      </div>
    </div>
  );
}

export default function Alerts({ alerts }) {
  const [selected, setSelected] = useState(null);

  const critical = alerts.filter((a) => a.risk === "CRITICAL").length;
  const high     = alerts.filter((a) => a.risk === "HIGH").length;

  return (
    <div>
      <h2 className="text-lg md:text-xl font-black text-white mb-1 flex items-center gap-2">
        <MdWarning className="text-orange-400" /> Alert Center
      </h2>
      <p className="text-slate-400 text-sm mb-4 md:mb-6">Click any alert row to see its location on the map</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 md:p-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Total Alerts</p>
          <p className="text-2xl font-black text-white mt-1">{alerts.length}</p>
        </div>
        <div className="bg-red-400/10 border border-red-500 rounded-xl p-3 md:p-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest flex items-center gap-1">
            <MdError className="text-red-400" /> Critical
          </p>
          <p className="text-2xl font-black text-red-400 mt-1">{critical}</p>
        </div>
        <div className="bg-orange-400/10 border border-orange-500 rounded-xl p-3 md:p-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest flex items-center gap-1">
            <MdWarning className="text-orange-400" /> High
          </p>
          <p className="text-2xl font-black text-orange-400 mt-1">{high}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 md:p-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest flex items-center gap-1">
            <MdAccessTime /> Last Alert
          </p>
          <p className="text-xs md:text-sm font-bold text-white mt-1">
            {alerts[0] ? new Date(alerts[0].createdAt).toLocaleString() : "None"}
          </p>
        </div>
      </div>

      {/* Alert Table — scrollable on mobile */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
                <th className="text-left p-3 md:p-4">Risk</th>
                <th className="text-left p-3 md:p-4">Score</th>
                <th className="text-left p-3 md:p-4">Temp</th>
                <th className="text-left p-3 md:p-4">Humidity</th>
                <th className="text-left p-3 md:p-4">Accel Y</th>
                <th className="text-left p-3 md:p-4">Gyro Mag</th>
                <th className="text-left p-3 md:p-4">Time</th>
                <th className="text-left p-3 md:p-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-slate-500 p-8">No alerts recorded yet</td>
                </tr>
              ) : (
                alerts.map((a) => {
                  const cfg = RISK_CONFIG[a.risk];
                  const gyroMag = Math.sqrt((a.gx||0)**2 + (a.gy||0)**2 + (a.gz||0)**2).toFixed(3);
                  return (
                    <tr
                      key={a._id}
                      onClick={() => setSelected(a)}
                      className="border-b border-slate-700/50 hover:bg-slate-700/40 cursor-pointer transition-colors group"
                    >
                      <td className="p-3 md:p-4"><span className={`font-bold ${cfg.color}`}>{a.risk}</span></td>
                      <td className="p-3 md:p-4 text-white font-bold">{a.riskScore}</td>
                      <td className="p-3 md:p-4 text-orange-300">{a.temp?.toFixed(2)}°C</td>
                      <td className="p-3 md:p-4 text-sky-300">{a.hum?.toFixed(2)}%</td>
                      <td className="p-3 md:p-4 text-violet-300">{a.ay?.toFixed(3)}g</td>
                      <td className="p-3 md:p-4 text-pink-300">{gyroMag}°/s</td>
                      <td className="p-3 md:p-4 text-slate-400 whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</td>
                      <td className="p-3 md:p-4">
                        <span className="flex items-center gap-1 text-sky-400 group-hover:text-sky-300 font-medium whitespace-nowrap">
                          <MdLocationOn size={16} /> View Map
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <AlertMapModal alert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
