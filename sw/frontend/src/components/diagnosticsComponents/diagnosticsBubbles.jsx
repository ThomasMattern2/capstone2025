import React from "react";
import { useTelemetryStore } from "../../context/TelemetryStore";

export default function Bubbles() {
  const battery = useTelemetryStore((state) => state.battery) || {};
  const gps = useTelemetryStore((state) => state.gps) || {};
  const link = useTelemetryStore((state) => state.link) || {};
  const attitude = useTelemetryStore((state) => state.attitude) || {};
  const flightMode = useTelemetryStore((state) => state.flightMode) || "WAITING";

  const fmt = (val, dec = 1) => (typeof val === "number" ? val.toFixed(dec) : "0.0");
  const toDeg = (rad) => (typeof rad === "number" ? (rad * (180 / Math.PI)).toFixed(1) : "0.0");

  return (
    <div style={styles.gridContainer}>
      {/* Battery */}
      <div style={styles.bubble}>
        <h4 style={styles.header}>⚡ Power</h4>
        <div style={styles.row}><span>Voltage:</span> <strong>{fmt(battery.voltage, 2)} V</strong></div>
        <div style={styles.row}><span>Current:</span> <strong>{fmt(battery.current, 1)} A</strong></div>
        <div style={styles.row}><span>Cap:</span> <strong>{battery.capacity || 0} mAh</strong></div>
      </div>

      {/* Radio Link */}
      <div style={styles.bubble}>
        <h4 style={styles.header}>📡 Link</h4>
        <div style={styles.row}><span>RSSI:</span> <strong>{link.rssi || -100} dBm</strong></div>
        <div style={styles.row}><span>Quality:</span> <strong>{link.lq || 0}%</strong></div>
        <div style={styles.row}><span>Mode:</span> <strong style={{color: "#007bff"}}>{flightMode}</strong></div>
      </div>

      {/* Attitude */}
      <div style={styles.bubble}>
        <h4 style={styles.header}>🧭 Attitude</h4>
        <div style={styles.row}><span>Pitch:</span> <strong>{toDeg(attitude.pitch)}°</strong></div>
        <div style={styles.row}><span>Roll:</span> <strong>{toDeg(attitude.roll)}°</strong></div>
        <div style={styles.row}><span>Yaw:</span> <strong>{toDeg(attitude.yaw)}°</strong></div>
      </div>

      {/* GPS Status */}
      <div style={styles.bubble}>
        <h4 style={styles.header}>🛰️ GPS</h4>
        <div style={styles.row}><span>Sats:</span> <strong>{gps.sats || 0}</strong></div>
        <div style={styles.row}><span>Alt:</span> <strong>{gps.alt || 0} m</strong></div>
        <div style={styles.row}><span>Lat:</span> <strong style={{fontSize: "0.8rem"}}>{fmt(gps.lat, 6)}</strong></div>
        <div style={styles.row}><span>Lon:</span> <strong style={{fontSize: "0.8rem"}}>{fmt(gps.lon, 6)}</strong></div>
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "20px"
  },
  bubble: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    flexDirection: "column"
  },
  header: { margin: "0 0 10px 0", borderBottom: "1px solid #eee", paddingBottom: "5px", color: "#666" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: "5px" }
};