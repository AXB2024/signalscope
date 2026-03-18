import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Simple mapping of city names to lat/lng (for now)
const cityCoordinates = {
  Dallas: [32.7767, -96.7970],
  Austin: [30.2672, -97.7431],
};

function OutageMap({refresh}) {
  const [reports, setReports] = useState([]);

  const fetchReports = () => {
    fetch("http://127.0.0.1:8000/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  };
  useEffect(() => {
    fetchReports();
  }, [refresh]);

  return (
    <MapContainer
      center={[32.7767, -96.7970]}
      zoom={7}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.map((report, index) => {
        if (!report.lat || !report.lng) return null;
        return (
          <Marker key={index} position={[report.lat, report.lng]}>
            <Popup>
              <strong>{report.issue_type}</strong>
              <br />
              Location: {report.location}
              <br />
              Severity: {report.severity}
              <br />
              {report.description}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default OutageMap;


