import { useState } from "react";

function ReportForm({ onReportSubmitted }) {
  const [formData, setFormData] = useState({
    location: "",
    issue_type: "",
    severity: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: formData.location,
        issue_type: formData.issue_type,
        severity: Number(formData.severity),
        description: formData.description
      })
    });

    setFormData({
      location: "",
      issue_type: "",
      severity: "",
      description: ""
    });

    onReportSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Report Network Issue</h2>

      <input
        name="location"
        placeholder="City (Dallas, Austin, etc)"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <input
        name="issue_type"
        placeholder="Issue Type (Internet outage, Dropped calls)"
        value={formData.issue_type}
        onChange={handleChange}
        required
      />

      <input
        name="severity"
        type="number"
        placeholder="Severity (1-5)"
        value={formData.severity}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <button type="submit">Submit Report</button>
    </form>
  );
}

export default ReportForm;