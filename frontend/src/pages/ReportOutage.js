import React, { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

const s = {
  page: { maxWidth:"600px", margin:"2rem auto", padding:"0 1rem" },
  h1: { fontSize:"1.5rem", fontWeight:"700", marginBottom:"1.5rem", color:"#38bdf8" },
  form: { display:"flex", flexDirection:"column", gap:"1rem" },
  label: { fontSize:"0.85rem", color:"#94a3b8", marginBottom:"0.25rem" },
  input: { width:"100%", padding:"0.6rem 0.8rem", borderRadius:"6px",
    border:"1px solid #334155", background:"#1e293b", color:"#f1f5f9", fontSize:"0.95rem" },
  row: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  btn: { padding:"0.75rem", borderRadius:"6px", border:"none", background:"#0ea5e9",
    color:"#fff", fontWeight:"600", cursor:"pointer", fontSize:"1rem" },
  success: { padding:"0.75rem", borderRadius:"6px", background:"#14532d", color:"#86efac", textAlign:"center" },
};

export default function ReportOutage() {
  const [form, setForm] = useState({ title:"", description:"", latitude:"", longitude:"",
    severity:"medium", provider:"", reported_by:"" });
  const [success, setSuccess] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    await axios.post(`${API}/api/v1/outages/`, {
      ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude)
    });
    setSuccess(true);
    setForm({ title:"", description:"", latitude:"", longitude:"", severity:"medium", provider:"", reported_by:"" });
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>📡 Report an Outage</h1>
      {success && <div style={s.success}>✅ Outage reported successfully!</div>}
      <form style={s.form} onSubmit={submit}>
        {[["title","Title *"],["description","Description"],["provider","Provider"],["reported_by","Your name"]].map(([name,label]) => (
          <div key={name}>
            <div style={s.label}>{label}</div>
            <input style={s.input} name={name} value={form[name]} onChange={handle} required={name==="title"} />
          </div>
        ))}
        <div style={s.row}>
          <div><div style={s.label}>Latitude *</div>
            <input style={s.input} name="latitude" type="number" step="any" value={form.latitude} onChange={handle} required /></div>
          <div><div style={s.label}>Longitude *</div>
            <input style={s.input} name="longitude" type="number" step="any" value={form.longitude} onChange={handle} required /></div>
        </div>
        <div>
          <div style={s.label}>Severity</div>
          <select style={s.input} name="severity" value={form.severity} onChange={handle}>
            {["low","medium","high","critical"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button style={s.btn} type="submit">Submit Report</button>
      </form>
    </div>
  );
}
