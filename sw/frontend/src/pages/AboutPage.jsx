import React from "react";

import MotoCalcGraph from "../components/aboutComponents/hardwareGraph";

export default function About() {
  // Fake data
  const projectInfo = {
    name: "Drone Control Dashboard",
    version: "v1.0.0",
    description:
      "This application is a simulation dashboard for monitoring and controlling UAVs. It includes live telemetry, camera streams, and control features for arm/disarm and diagnostics.",
    authors: ["Jane Doe", "John Smith"],
    license: "MIT",
    lastUpdated: "September 2025",
    hardwareDescription: "Graph for hardware analysis",
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>About This Project</h2>
      <p style={styles.description}>{projectInfo.description}</p>

      <div style={styles.infoBlock}>
        <strong>Project Name:</strong> {projectInfo.name}
      </div>
      <div style={styles.infoBlock}>
        <strong>Version:</strong> {projectInfo.version}
      </div>
      <div style={styles.infoBlock}>
        <strong>Authors:</strong> {projectInfo.authors.join(", ")}
      </div>
      <div style={styles.infoBlock}>
        <strong>License:</strong> {projectInfo.license}
      </div>
      <div style={styles.infoBlock}>
        <strong>Last Updated:</strong> {projectInfo.lastUpdated}
      </div>
      <h2 style={styles.title}>Hardware Considerations</h2>
      <p style={styles.description}>{projectInfo.hardwareDescription}</p>
      <MotoCalcGraph />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  description: {
    textAlign: "center",
    marginBottom: "2rem",
    fontStyle: "italic",
  },
  infoBlock: {
    marginBottom: "1rem",
    fontSize: "1rem",
  },
};
