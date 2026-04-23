import { useState, useEffect, useRef } from "react";
import { MdMap, MdLocationOn, MdTerrain, MdWater, MdVibration, MdGpsFixed, MdGpsNotFixed } from "react-icons/md";
import { RISK_CONFIG } from "../components/chartConfig.js";
import axios from "axios";

// 📍 Default location (change to your actual monitoring site)
const DEFAULT_LOCATION = { lat: -1.9441, lng: 30.0619, label: "Kigali, Rwanda" };

export default function ZoneMap({ risk, latest }) {
  const [apiKey, setApiKey] = useState("");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const cfg = RISK_CONFIG[risk.risk] || RISK_CONFIG.LOW;

  // Use GPS from latest reading if available, else default
  const lat = latest?.lat ?? DEFAULT_LOCATION.lat;
  const lng = latest?.lng ?? DEFAULT_LOCATION.lng;
  const hasGPS = !!(latest?.lat && latest?.lng);

  // Fetch API key from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/config")
      .then((res) => setApiKey(res.data.googleMapsApiKey || ""))
      .catch(() => {});
  }, []);

  // Load Google Maps script and initialize map
  useEffect(() => {
    if (!apiKey) return;

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup map instance on unmount
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    // If map already exists, just update marker
    if (mapInstanceRef.current) {
      updateMarker();
      return;
    }

    const mapOptions = {
      center: { lat, lng },
      zoom: 15,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    updateMarker();
  };

  const updateMarker = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create custom marker based on risk level
    const markerColor = risk.risk === "CRITICAL" ? "#ef4444" :
                        risk.risk === "HIGH" ? "#f97316" :
                        risk.risk === "MEDIUM" ? "#eab308" : "#22c55e";

    markerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: `Risk: ${risk.risk} (Score: ${risk.riskScore})`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: markerColor,
        fillOpacity: 0.8,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
      animation: google.maps.Animation.DROP,
    });

    // Center map on location
    mapInstanceRef.current.setCenter({ lat, lng });
  };

  // Update marker when location or risk changes
  useEffect(() => {
    if (apiKey && window.google) {
      updateMarker();
    }
  }, [lat, lng, risk.risk, risk.riskScore, apiKey]);

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <MdMap className="text-sky-400" /> Zone Map
          </h2>
          <p className="text-slate-400 text-sm">Monitored landslide zone — real-time location</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
          hasGPS ? "bg-emerald-400/10 border-emerald-500 text-emerald-400" : "bg-slate-700 border-slate-600 text-slate-400"
        }`}>
          {hasGPS ? <MdGpsFixed size={14} /> : <MdGpsNotFixed size={14} />}
          {hasGPS ? "GPS Active" : "GPS Not Connected"}
        </div>
      </div>

      {/* Risk Status Bar */}
      <div className={`rounded-2xl border p-4 ${cfg.bg} mb-6 flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Zone Risk Status</p>
          <p className={`text-2xl font-black ${cfg.color}`}>{risk.risk}</p>
          <p className="text-slate-400 text-sm mt-1">Score: <span className={`font-bold ${cfg.color}`}>{risk.riskScore} / 100</span></p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Latitude</p>
            <p className="text-white font-bold font-mono">{lat.toFixed(6)}°</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Longitude</p>
            <p className="text-white font-bold font-mono">{lng.toFixed(6)}°</p>
          </div>
          {latest && (
            <>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest">Temp</p>
                <p className="text-orange-400 font-bold">{latest.temp?.toFixed(1)}°C</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest">Humidity</p>
                <p className="text-sky-400 font-bold">{latest.hum?.toFixed(1)}%</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden mb-6">
        {!apiKey ? (
          <div className="flex items-center justify-center h-[420px] bg-slate-700">
            <p className="text-slate-400">Loading map...</p>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-[420px]"
          />
        )}
      </div>

      {/* Open in Google Maps button */}
      <div className="flex justify-end mb-6">
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <MdLocationOn /> Open in Google Maps
        </a>
      </div>

      {/* Zone Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          {
            icon: <MdTerrain size={20} className="text-emerald-400" />,
            title: "Slope Monitoring",
            desc: "IMU gyroscope detects tilt and rotation of the slope in real-time.",
            status: risk.riskScore > 20 ? "Active" : "Stable",
            warn: risk.riskScore > 20,
          },
          {
            icon: <MdWater size={20} className="text-sky-400" />,
            title: "Soil Saturation",
            desc: "HS3003 humidity sensor monitors moisture levels that trigger landslides.",
            status: latest?.hum > 75 ? "Warning" : "Normal",
            warn: latest?.hum > 75,
          },
          {
            icon: <MdVibration size={20} className="text-orange-400" />,
            title: "Ground Vibration",
            desc: "Accelerometer detects sudden ground movement or seismic activity.",
            status: risk.riskScore > 40 ? "Alert" : "Calm",
            warn: risk.riskScore > 40,
          },
        ].map((z) => (
          <div key={z.title} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {z.icon}
              <h4 className="text-white font-bold text-sm">{z.title}</h4>
            </div>
            <p className="text-slate-400 text-xs mb-3">{z.desc}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              z.warn ? "bg-orange-400/20 text-orange-400" : "bg-emerald-400/20 text-emerald-400"
            }`}>{z.status}</span>
          </div>
        ))}
      </div>

      {/* GPS Note */}
      {!hasGPS && (
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
          <MdGpsNotFixed size={20} className="text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 font-bold text-sm">No GPS Module Detected</p>
            <p className="text-slate-400 text-xs mt-1">
              Add a <span className="text-white font-bold">u-blox NEO-6M GPS module</span> to your Arduino to get real coordinates.
              Connect TX→RX, RX→TX, VCC→3.3V, GND→GND. Then add <span className="text-sky-400 font-mono">lat</span> and <span className="text-sky-400 font-mono">lng</span> fields to your Arduino JSON output.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
