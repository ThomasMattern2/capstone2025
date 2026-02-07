import React from "react";
import { useTelemetryStore } from "../../context/TelemetryStore";

export default function Bubbles() {
  const battery = useTelemetryStore((state) => state.battery);
  const gps = useTelemetryStore((state) => state.gps);
  const link = useTelemetryStore((state) => state.link);
  const flightMode = useTelemetryStore((state) => state.flightMode);

  return (
    <div style={styles.container}>
      {/* Battery Bubble */}
      <div style={styles.bubble}>
        <h4>Power</h4>
        <div style={styles.row}><span>Voltage:</span> <strong>{battery.voltage.toFixed(1)} V</strong></div>
        <div style={styles.row}><span>Current:</span> <strong>{battery.current.toFixed(1)} A</strong></div>
        <div style={styles.row}><span>Cap:</span> <strong>{battery.remaining}%</strong></div>
      </div>

      {/* Link / Radio Bubble */}
      <div style={styles.bubble}>
        <h4>Radio Link</h4>
        <div style={styles.row}><span>RSSI:</span> <strong>{link.rssi} dBm</strong></div>
        <div style={styles.row}><span>Quality:</span> <strong>{link.lq}%</strong></div>
        <div style={styles.row}><span>Mode:</span> <strong style={{color: "#007bff"}}>{flightMode}</strong></div>
      </div>

      {/* GPS Bubble */}
      <div style={styles.bubble}>
        <h4>GPS</h4>
        <div style={styles.row}><span>Sats:</span> <strong>{gps.sats}</strong></div>
        <div style={styles.row}><span>Alt:</span> <strong>{gps.alt} m</strong></div>
        <div style={styles.row}><span>Speed:</span> <strong>{gps.gs} km/h</strong></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  bubble: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "15px",
    padding: "15px",
    minWidth: "160px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    fontSize: "0.9rem",
  }
};