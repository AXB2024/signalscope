import { useState } from "react";
import { API_BASE_URL } from "../config";

function ReportForm({ onReportSubmitted }) {
  const [formData, setFormData] = useState({
    location: "",
    issue_type: "",
    severity: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        location: formData.location,
        issue_type: formData.issue_type,
        severity: Number(formData.severity),
        description: formData.description,
      };
      console.log("Submitting report payload:", payload);

      const response = await fetch(`${API_BASE_URL}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit report: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Report API response:", responseData);

      setFormData({
        location: "",
        issue_type: "",
        severity: "",
        description: "",
      });
      onReportSubmitted();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
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
        min={1}
        max={5}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Report"}
      </button>

      {submitting && <p className="status-message">Submitting report...</p>}
      {error && <p className="status-message error">{error}</p>}
    </form>
  );
}

export default ReportForm;
