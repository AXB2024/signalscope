import { useState } from "react";
import Dashboard from "./components/Dashboard";
import MetricsPanel from "./components/MetricsPanel";
import OutageMap from "./components/OutageMap";
import ReportForm from "./components/ReportForm";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState("map");

  const handleReportSubmitted = () => {
    setRefresh((currentValue) => currentValue + 1);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Signal Scope Telecom Outage Monitor</h1>
        <p>
          Track outage hotspots, severity patterns, and location intelligence
          in near real-time.
        </p>
      </header>

      <nav className="tab-nav">
        <button
          type="button"
          className={activeTab === "map" ? "active" : ""}
          onClick={() => setActiveTab("map")}
        >
          Live Map
        </button>
        <button
          type="button"
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics Dashboard
        </button>
      </nav>

      {activeTab === "map" ? (
        <>
          <ReportForm onReportSubmitted={handleReportSubmitted} />
          <MetricsPanel refresh={refresh} />
          <OutageMap refresh={refresh} />
        </>
      ) : (
        <Dashboard refresh={refresh} />
      )}
    </div>
  );
}

export default App;
