import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { API_BASE_URL } from "../config";

function Dashboard({ refresh }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/analytics`);
      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.status}`);
      }
      const data = await response.json();
      setAnalytics(data);
      setError("");
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();

    const intervalId = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(intervalId);
  }, [fetchAnalytics, refresh]);

  if (loading) {
    return <p className="status-message">Loading analytics...</p>;
  }

  if (error) {
    return <p className="status-message error">Unable to load analytics: {error}</p>;
  }

  return (
    <section className="analytics-panel">
      <h2>Outage Analytics Dashboard</h2>

      <div className="kpi-grid">
        <article className="kpi-card">
          <h3>Total Reports</h3>
          <p>{analytics.total_reports}</p>
        </article>
        <article className="kpi-card">
          <h3>Average Severity</h3>
          <p>{analytics.average_severity}</p>
        </article>
        <article className="kpi-card">
          <h3>Unique Cities</h3>
          <p>{analytics.unique_locations_count}</p>
        </article>
      </div>

      <div className="chart-grid">
        <article className="chart-card">
          <h3>Reports Per City (Top 5)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.top_cities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <h3>Reports Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.reports_over_time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;

