import React from "react";
import { useTelemetryStore } from "../../context/TelemetryStore";

export default function RcChannels() {
  const channels = useTelemetryStore((state) => state.channels);

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: "10px" }}>RC Channels (Live)</h3>
      <div style={styles.grid}>
        {channels.map((val, index) => (
          <div key={index} style={styles.channelCol}>
            <div style={styles.barContainer}>
              {/* Normalize 172-1811 range (CRSF) to 0-100% height */}
              <div 
                style={{
                  ...styles.bar,
                  height: `${Math.min(100, Math.max(0, ((val - 172) / (1811 - 172)) * 100))}%`
                }} 
              />
            </div>
            <span style={styles.label}>CH{index + 1}</span>
            <span style={styles.value}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
    textAlign: "center"
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    height: "200px",
    alignItems: "flex-end"
  },
  channelCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30px",
  },
  barContainer: {
    width: "100%",
    height: "150px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden"
  },
  bar: {
    width: "100%",
    backgroundColor: "#4caf50",
    transition: "height 0.1s ease-out"
  },
  label: { fontSize: "0.7rem", marginTop: "5px", fontWeight: "bold" },
  value: { fontSize: "0.6rem", color: "#666" }
};