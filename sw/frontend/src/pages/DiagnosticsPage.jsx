import React from "react";

import Bubbles from "../components/diagnosticsComponents/diagnosticsBubbles";
import MultiTrackPlot from "../components/diagnosticsComponents/MultiTrackPlot";

export default function Diagnostics() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Current Diagnostics</h2>
      <Bubbles />
      <MultiTrackPlot />
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center", // centers text horizontally
    padding: "1rem",
  },
  title: {
    marginBottom: "1rem",
  },
};
