import React from "react";
import Bubbles from "../components/diagnosticsComponents/diagnosticsBubbles";
import MultiTrackPlot from "../components/diagnosticsComponents/MultiTrackPlot";
import RcChannels from "../components/diagnosticsComponents/RcChannels";

export default function Diagnostics() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CRSF Diagnostics</h2>
      
      {/* TODO Top Gauge Section */}
      <Bubbles />

      {/* TODO Live Stick Inputs */}
      <RcChannels />

      {/* TODO Live Attitude Plot */}
      <MultiTrackPlot />
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "2rem",
    color: "#333",
  },
};