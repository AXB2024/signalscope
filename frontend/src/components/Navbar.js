import React from "react";
import { Link } from "react-router-dom";

const styles = {
  nav: { display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"0 2rem", height:"60px", background:"#1e293b", borderBottom:"1px solid #334155" },
  brand: { fontSize:"1.25rem", fontWeight:"700", color:"#38bdf8", textDecoration:"none" },
  links: { display:"flex", gap:"1.5rem" },
  link: { color:"#94a3b8", textDecoration:"none", fontSize:"0.9rem" },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌐 SignalScope</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Live Map</Link>
        <Link to="/report" style={styles.link}>Report Outage</Link>
      </div>
    </nav>
  );
}
