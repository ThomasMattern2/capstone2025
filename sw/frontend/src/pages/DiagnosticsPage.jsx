import React from "react";
import Bubbles from "../components/diagnosticsComponents/diagnosticsBubbles";
import MultiTrackPlot from "../components/diagnosticsComponents/MultiTrackPlot";
import DroneMap from "../components/diagnosticsComponents/DroneMap";
import Speedometer from "../components/diagnosticsComponents/Speedometer";
import VideoFeed from "../components/diagnosticsComponents/VideoFeed";

export default function Diagnostics() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>🚀 World Record Dashboard</h2>
        
        {/* ROW 1: HUD (Speed & Stats) */}
        <div style={styles.row}>
          <div style={styles.speedCol}>
            <Speedometer />
          </div>
          <div style={styles.statsCol}>
            <Bubbles />
          </div>
        </div>

        {/* ROW 2: VISUALS (Video & Map) */}
        <div style={styles.row}>
          
          {/* FPV Video Feed */}
          <div style={styles.halfCol}>
             <div style={styles.cardHeader}>FPV FEED</div>
             {/* Added wrapper to force containment */}
             <div style={{ flex: 1, minHeight: "400px" }}>
                <VideoFeed />
             </div>
          </div>

          {/* GPS Map */}
          <div style={styles.halfCol}>
             <div style={styles.cardHeader}>GPS TRACKING</div>
             <div style={{ flex: 1, minHeight: "400px" }}>
                <DroneMap />
             </div>
          </div>
          
        </div>

        {/* ROW 3: DATA (Graph) */}
        <div style={styles.row}>
          <div style={styles.fullCol}>
             <div style={styles.cardHeader}>TELEMETRY HISTORY</div>
             <MultiTrackPlot />
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#1e1e1e",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box" // Critical for layout math
  },
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "30px" // Explicit gap between rows instead of margin
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "900",
    letterSpacing: "2px",
    textShadow: "0px 0px 10px rgba(0,0,0,0.5)"
  },
  
  // --- Grid System ---
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap", 
    alignItems: "stretch",
    width: "100%",
    position: "relative" // Creates a new stacking context
  },
  
  // --- Column Sizing ---
  speedCol: {
    flex: "1 1 350px", 
    minWidth: "300px",
    // Ensure it doesn't collapse
    display: "flex", 
    flexDirection: "column"
  },
  statsCol: {
    flex: "2 1 600px", 
    minWidth: "300px"
  },
  halfCol: {
    flex: "1 1 500px",
    minWidth: "400px",
    backgroundColor: "#2a2a2a",
    borderRadius: "10px",
    padding: "15px", // Increased padding
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column"
  },
  fullCol: {
    flex: "1 1 100%",
    minWidth: "100%"
  },

  // --- UI Helpers ---
  cardHeader: {
    color: "#aaa",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    paddingLeft: "5px"
  }
};