import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function MetricsPanel({ refresh }) {
  const [geocodingMetrics, setGeocodingMetrics] = useState(null);
  const [severityMetrics, setSeverityMetrics] = useState(null);
  const [error, setError] = useState("");

  const fetchMetrics = useCallback(async () => {
    try {
      const [geocodingResponse, severityResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/metrics/geocoding`),
        fetch(`${API_BASE_URL}/metrics/severity`),
      ]);

      if (!geocodingResponse.ok || !severityResponse.ok) {
        throw new Error("Metrics endpoint request failed.");
      }

      const [geocodingData, severityData] = await Promise.all([
        geocodingResponse.json(),
        severityResponse.json(),
      ]);

      setGeocodingMetrics(geocodingData);
      setSeverityMetrics(severityData);
      setError("");
    } catch (fetchError) {
      setError(fetchError.message);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics, refresh]);

  return (
    <section className="metrics-panel">
      <h2>Operational Metrics</h2>
      {error && <p className="status-message error">{error}</p>}

      <div className="metrics-grid">
        <article className="metric-card">
          <h3>Geocoding</h3>
          {geocodingMetrics ? (
            <>
              <p>Total Reports: {geocodingMetrics.total_reports}</p>
              <p>Total Geocoded Reports: {geocodingMetrics.total_geocoded_reports}</p>
              <p>Unique Cities Geocoded: {geocodingMetrics.unique_cities_geocoded}</p>
              <p>Success Rate: {geocodingMetrics.geocoding_success_rate}%</p>
            </>
          ) : (
            <p>Loading geocoding metrics...</p>
          )}
        </article>

        <article className="metric-card">
          <h3>Severity Distribution</h3>
          {severityMetrics ? (
            <ul className="severity-list">
              {severityMetrics.counts_by_severity.map((item) => {
                const percentage =
                  severityMetrics.distribution_percent.find(
                    (row) => row.severity === item.severity
                  )?.percentage ?? 0;
                return (
                  <li key={item.severity}>
                    Level {item.severity}: {item.count} reports ({percentage}%)
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Loading severity metrics...</p>
          )}
        </article>
      </div>
    </section>
  );
}

export default MetricsPanel;

