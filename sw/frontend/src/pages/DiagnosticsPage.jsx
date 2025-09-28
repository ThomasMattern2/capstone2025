import React from "react";

import Bubbles from "../components/diagnosticsComponents/diagnosticsBubbles";
import MultiTrackPlot from "../components/diagnosticsComponents/MultiTrackPlot";

import { useTelemetryStore } from "../context/TelemetryStore";

export default function Diagnostics() {
  const telemetry = useTelemetryStore((state) => state.telemetry);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Current Diagnostics</h2>

      <Bubbles telemetry={telemetry} />
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
