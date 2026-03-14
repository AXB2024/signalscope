import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const SEVERITY_COLOR = { low:"#22c55e", medium:"#f59e0b", high:"#f97316", critical:"#ef4444" };
const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function MapView() {
  const [outages, setOutages] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/v1/outages/`)
      .then(r => setOutages(r.data))
      .catch(() => setOutages([]));
  }, []);

  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CartoCDN"
        />
        {outages.map(o => (
          <CircleMarker
            key={o.id}
            center={[o.latitude, o.longitude]}
            radius={10}
            pathOptions={{ color: SEVERITY_COLOR[o.severity], fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{o.title}</strong><br />
              Severity: {o.severity}<br />
              Status: {o.status}<br />
              Provider: {o.provider || "Unknown"}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
