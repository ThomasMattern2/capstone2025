import React from "react";
import { useTelemetryStore } from "../../context/TelemetryStore";

export default function Speedometer() {
  const gps = useTelemetryStore((state) => state.gps) || { gs: 0 };
  const speed = gps.gs || 0; 

  const TARGET_SPEED = 670;
  
  let color = "#7f8c8d"; 
  if (speed > 10) color = "#f1c40f"; 
  if (speed > 300) color = "#e67e22"; 
  if (speed > 600) color = "#e74c3c"; 
  if (speed >= 670) color = "#2ecc71"; 

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>GROUND SPEED</h3>
      
      {/* Big Number */}
      <div style={{...styles.value, color: color}}>
        {speed.toFixed(1)}
        <span style={styles.unit}> km/h</span>
      </div>

      {/* Progress Bar */}
      <div style={styles.barWrapper}>
        <div style={styles.barContainer}>
          <div 
            style={{
              ...styles.barFill, 
              width: `${Math.min(100, (speed / TARGET_SPEED) * 100)}%`,
              backgroundColor: color
            }} 
          />
        </div>
        <div style={styles.targetLabel}>Target: {TARGET_SPEED} km/h</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "25px", // Increased padding
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100%", // Changed from height:100% to minHeight
    boxSizing: "border-box"
  },
  title: {
    margin: 0,
    color: "#555",
    fontSize: "1.2rem",
    fontWeight: "bold",
    letterSpacing: "1px"
  },
  value: {
    fontSize: "5rem",
    fontWeight: "800",
    margin: "15px 0",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    lineHeight: "1"
  },
  unit: {
    fontSize: "1.5rem",
    color: "#777",
    fontWeight: "normal"
  },
  barWrapper: {
    marginTop: "auto",
    width: "100%"
  },
  barContainer: {
    width: "100%",
    height: "12px",
    backgroundColor: "#ecf0f1",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "5px"
  },
  barFill: {
    height: "100%",
    transition: "width 0.1s ease-out"
  },
  targetLabel: {
    fontSize: "0.8rem",
    color: "#95a5a6",
    textAlign: "right"
  }
};