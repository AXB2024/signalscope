import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapView from "./pages/MapView";
import ReportOutage from "./pages/ReportOutage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/report" element={<ReportOutage />} />
      </Routes>
    </BrowserRouter>
  );
}
