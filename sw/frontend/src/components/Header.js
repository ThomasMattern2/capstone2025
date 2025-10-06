import React from "react";
import { Link } from "react-router-dom";
import { useConnection } from "../context/ConnectedContext";

export default function Header() {
  // Check the connection global state
  const { connected, toggleConnection } = useConnection();

  return (
    <header style={styles.header}>
      <div style={styles.leftGroup}>
        {/* Dynamic tag above the title with a black border */}
        <div
          style={{
            ...styles.statusTag,
            borderColor: "#000",
          }}
        >
          {connected ? "ACRO" : "MODE"}
        </div>

        <h1 style={styles.title}>High Speed Quad</h1>
        {/* Connect button */}
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
    position: "sticky", // makes header stick to viewport
    top: 0, // stick to the top
    zIndex: 1000, // ensures it stays above other content
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#282c34",
    color: "#fff",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)", // optional nice shadow
  },
  leftGroup: {
    display: "flex",
    gap: "0.4rem",
  },
  statusTag: {
    alignSelf: "flex-start",
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
