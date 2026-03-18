import { useState } from "react";
import OutageMap from "./components/OutageMap";
import ReportForm from "./components/ReportForm";

function App() {

  const [refresh, setRefresh] = useState(false);

  const handleReportSubmitted = () => {
    setRefresh(!refresh);
  };

  return (
    <div>

      <h1>NetPulse Telecom Outage Monitor</h1>

      <ReportForm onReportSubmitted={handleReportSubmitted} />

      <OutageMap refresh={refresh} />

    </div>
  );
}

export default App;