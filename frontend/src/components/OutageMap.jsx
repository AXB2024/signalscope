import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { API_BASE_URL } from "../config";

const FALLBACK_CENTER = [32.7767, -96.797];

const iconBySeverity = {
  low: L.divIcon({
    className: "severity-marker-wrapper",
    html: '<span class="severity-marker severity-low"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -8],
  }),
  medium: L.divIcon({
    className: "severity-marker-wrapper",
    html: '<span class="severity-marker severity-medium"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -8],
  }),
  high: L.divIcon({
    className: "severity-marker-wrapper",
    html: '<span class="severity-marker severity-high"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -8],
  }),
};

const severityLabel = {
  low: "Severity 1-2 (Green)",
  medium: "Severity 3-4 (Orange)",
  high: "Severity 5 (Red)",
};

const getSeverityBucket = (severity) => {
  if (severity >= 5) return "high";
  if (severity >= 3) return "medium";
  return "low";
};

const toNumber = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function OutageMap({ refresh }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      if (!response.ok) {
        throw new Error(`Report request failed: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched reports from backend:", data);
      setReports(data);
      setError("");
    } catch (fetchError) {
      setError(fetchError.message);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const intervalId = setInterval(fetchReports, 15000);
    return () => clearInterval(intervalId);
  }, [fetchReports, refresh]);

  const reportMarkers = useMemo(
    () =>
      reports
        .map((report) => {
          const latitude = toNumber(report.latitude ?? report.lat);
          const longitude = toNumber(report.longitude ?? report.lng);
          if (latitude === null || longitude === null) {
            console.warn("Skipping marker due to missing coordinates:", report);
            return null;
          }
          console.log("Rendering marker:", {
            id: report._id,
            location: report.location,
            latitude,
            longitude,
            severity: report.severity,
          });
          return {
            ...report,
            latitude,
            longitude,
            severityBucket: getSeverityBucket(Number(report.severity)),
          };
        })
        .filter(Boolean),
    [reports]
  );

  const center = reportMarkers[0]
    ? [reportMarkers[0].latitude, reportMarkers[0].longitude]
    : FALLBACK_CENTER;

  return (
    <section className="map-panel">
      <div className="panel-heading">
        <h2>Live Outage Map</h2>
        <div className="map-legend">
          {Object.entries(severityLabel).map(([bucket, label]) => (
            <div key={bucket} className="legend-item">
              <span className={`legend-dot severity-${bucket}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="status-message error">Unable to refresh map: {error}</p>}

      <MapContainer center={center} zoom={7} className="outage-map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reportMarkers.map((report) => (
          <Marker
            key={report._id ?? `${report.location}-${report.timestamp}`}
            position={[report.latitude, report.longitude]}
            icon={iconBySeverity[report.severityBucket]}
          >
            <Popup>
              <strong>{report.issue_type}</strong>
              <br />
              Location: {report.location}
              <br />
              Severity: {report.severity}
              <br />
              Description: {report.description || "No description provided"}
              <br />
              Time:{" "}
              {report.timestamp ? new Date(report.timestamp).toLocaleString() : "Unknown"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {import.meta.env.DEV && (
        <details>
          <summary>Debug Reports JSON</summary>
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}

export default OutageMap;
