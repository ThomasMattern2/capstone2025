import logo from "./logo.svg";
import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Diagnostics from "./pages/DiagnosticsPage";
import About from "./pages/AboutPage";
import Display from "./pages/DisplayPage";

function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/display" element={<Display />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
