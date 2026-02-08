import React from "react";
import { Link } from "react-router-dom";
import { useConnection } from "../context/ConnectedContext";

import icon from "../assets/icon.png"; 

export default function Header() {
  const { connected, toggleConnection } = useConnection();

  return (
    <header style={styles.header}>
      <div style={styles.leftGroup}>
        {/* Status Tag */}
        <div
          style={{
            ...styles.statusTag,
            borderColor: "#000",
          }}
        >
          {connected ? "ACRO" : "MODE"}
        </div>

        {/* 2. Logo and Title Container */}
        <div style={styles.branding}>
            <img src={icon} alt="Logo" style={styles.logo} />
            <h1 style={styles.title}>High Speed Quad</h1>
        </div>

        {/* Connect Button */}
        <button
          onClick={toggleConnection}
          aria-pressed={connected}
          style={{
            ...styles.button,
            backgroundColor: connected ? "#2ecc71" : "#007bff",
            cursor: "pointer",
          }}
        >
          {connected ? "Connected" : "Connect to Drone"}
        </button>
      </div>

      <div style={styles.rightGroup}>
        <nav style={styles.nav}>
          <Link to="/display" style={styles.link}>
            Display
          </Link>
          <Link to="/diagnostics" style={styles.link}>
            Diagnostics
          </Link>
          <Link to="/about" style={styles.link}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#282c34",
    color: "#fff",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center", // Ensures vertical alignment
    gap: "1rem",          // Increased gap for better spacing
  },
  // 3. New Branding Styles
  branding: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    height: "32px",       // Adjust size as needed
    width: "auto",
  },
  statusTag: {
    alignSelf: "center",  // Changed to center to align with logo/text
    padding: "0.15rem 0.5rem",
    border: "2px solid",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: "#fff",
    color: "#000",
  },
  title: {
    fontSize: "1.5rem",
    margin: 0,
    whiteSpace: "nowrap", // Prevents title wrapping
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  button: {
    padding: "0.5rem 0.8rem",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: 600,
  },
};