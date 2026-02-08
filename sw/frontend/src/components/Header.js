import React from "react";
import { useTelemetryStore } from "../context/TelemetryStore";

export default function Header() {
  // Get alerts from the store
  const alerts = useTelemetryStore((state) => state.alerts);

  // If there are no alerts, render nothing (no white space)
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div style={styles.alertContainer}>
      {alerts.map((alert, index) => (
        <div key={index} style={styles.alertItem}>
          ⚠️ {alert}
        </div>
      ))}
    </div>
  );
}

const styles = {
  alertContainer: {
    backgroundColor: "#e74c3c", // Red background
    color: "white",
    textAlign: "center",
    width: "100%",
    padding: "8px 0",
    fontWeight: "bold",
    zIndex: 9999, // Very high z-index to stay on top
    position: "sticky",
    top: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column", // Stacks multiple alerts vertically
    gap: "5px",
  },
  alertItem: {
    fontSize: "16px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
};