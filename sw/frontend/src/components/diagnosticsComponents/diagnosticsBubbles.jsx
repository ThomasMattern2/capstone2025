import React from "react";

import { useTelemetryStore } from "../../context/TelemetryStore";

export default function Bubbles() {
  // initialize 10 random values
  const telemetry = useTelemetryStore((state) => state.telemetry);

  return (
    <div>
      <div style={styles.contentWrap}>
        <main style={styles.main}>
          <div style={styles.grid}>
            <div style={styles.box}>
              <div style={styles.label}>Altitude</div>
              {telemetry?.data?.altitude !== undefined ? (
                <div style={styles.value}>{telemetry.data.altitude}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Speed</div>
              {telemetry?.data?.speed ? (
                <div style={styles.value}>{telemetry.data.speed}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Battery</div>
              {telemetry?.data?.battery !== undefined ? (
                <div style={styles.value}>{telemetry.data.battery}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Heading</div>
              {telemetry?.data?.heading !== undefined ? (
                <div style={styles.value}>{telemetry.data.heading}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>GPS Fix</div>
              {telemetry?.data?.gpsfix !== undefined ? (
                <div style={styles.value}>{telemetry.data.gpsfix}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Signal</div>
              {telemetry && telemetry.data.signal ? (
                <div style={styles.value}>{telemetry.data.signal}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Pitch</div>
              {telemetry?.data?.pitch !== undefined ? (
                <div style={styles.value}>{telemetry.data.pitch}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Roll</div>
              {telemetry?.data?.roll ? (
                <div style={styles.value}>{telemetry.data.roll}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Yaw</div>
              {telemetry?.data?.yaw !== undefined ? (
                <div style={styles.value}>{telemetry.data.yaw}</div>
              ) : (
                <div>null</div>
              )}
            </div>

            <div style={styles.box}>
              <div style={styles.label}>Satellites</div>
              {telemetry?.data?.satellites !== undefined ? (
                <div style={styles.value}>{telemetry.data.satellites}</div>
              ) : (
                <div>null</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, sans-serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f6f8fa",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem 1rem",
    background: "#20232a",
    color: "#fff",
  },
  title: { margin: 0, fontSize: "1.1rem", fontWeight: 600 },
  hamburgerBtn: {
    width: 44,
    height: 36,
    borderRadius: 8,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  hamLine: { display: "block", height: 2, width: "100%", background: "#fff" },

  contentWrap: { display: "flex", flex: 1, minHeight: 0 },
  drawer: {
    width: 250,
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "1rem",
    transition: "transform 0.2s ease",
  },
  drawerTitle: { margin: 0, fontSize: "1.1rem" },

  main: { flex: 1, padding: "1.25rem", overflow: "auto" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 5 columns
    gridAutoRows: "130px",
    gap: "1rem",
  },
  box: {
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.5rem",
    textAlign: "center",
  },
  label: { fontSize: "1rem", fontWeight: 600, marginBottom: 4 }, // NEW
  value: { fontSize: "0.9rem", color: "#444" }, // NEW small value
};
