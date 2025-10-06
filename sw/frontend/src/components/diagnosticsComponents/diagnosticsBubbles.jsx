import React from "react";

import { useTelemetryStore } from "../../context/TelemetryStore";
import { useConnection } from "../../context/ConnectedContext";
import { useEffect, useState } from "react";

export default function Bubbles() {
  const { connected } = useConnection();
  const telemetry = useTelemetryStore((state) => state.telemetry);

  // Store last valid telemetry values
  const [lastValues, setLastValues] = useState({});

  useEffect(() => {
    if (telemetry?.data) {
      setLastValues((prev) => ({
        uptime:
          telemetry.data.time_boot_ms !== undefined ? telemetry.data.time_boot_ms : prev.uptime,
        altitude:
          telemetry.data.alt !== undefined ? telemetry.data.alt : prev.altitude,
        airspeed:
          telemetry.data.airspeed !== undefined ? telemetry.data.airspeed : prev.airspeed,
        batteryvoltage:
          telemetry.data.battery_voltage !== undefined
            ? telemetry.data.battery_voltage
            : prev.batteryvoltage,
        batterycurrent:
          telemetry.data.battery_current !== undefined
            ? telemetry.data.battery_current
            : prev.batterycurrent,
        batteryremaining:
          telemetry.data.battery_remaining !== undefined
            ? telemetry.data.battery_remaining
            : prev.batteryremaining,
        heading:
          telemetry.data.heading !== undefined
            ? telemetry.data.heading
            : prev.heading,
        pitch:
          telemetry.data.pitch !== undefined ? telemetry.data.pitch : prev.pitch,
        roll:
          telemetry.data.roll !== undefined ? telemetry.data.roll : prev.roll,
        yaw: telemetry.data.yaw !== undefined ? telemetry.data.yaw : prev.yaw,
      }));
    }
  }, [telemetry]);

  return (
    <div>
      {!connected ? (
        <div style={{ fontSize: 25, padding: "4rem 0" }}>
          Please Connect To Drone For Current Diagnostics
        </div>
      ) : (
        <div style={styles.contentWrap}>
          <main style={styles.main}>
            <div style={styles.grid}>
              <div style={styles.box}>
                <div style={styles.label}>Uptime</div>
                <div style={styles.value}>{lastValues.uptime ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Altitude</div>
                <div style={styles.value}>{lastValues.altitude ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Air Speed</div>
                <div style={styles.value}>{lastValues.airspeed ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Battery Voltage</div>
                <div style={styles.value}>{lastValues.batteryvoltage ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Battery Current</div>
                <div style={styles.value}>{lastValues.batterycurrent ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Battery Remaining</div>
                <div style={styles.value}>{lastValues.batteryremaining ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Heading</div>
                <div style={styles.value}>{lastValues.heading ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Pitch</div>
                <div style={styles.value}>{lastValues.pitch ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Roll</div>
                <div style={styles.value}>{lastValues.roll ?? "null"}</div>
              </div>

              <div style={styles.box}>
                <div style={styles.label}>Yaw</div>
                <div style={styles.value}>{lastValues.yaw ?? "null"}</div>
              </div>

            </div>
          </main>
        </div>
      )}
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
  label: { fontSize: "1rem", fontWeight: 600, marginBottom: 4 },
  value: { fontSize: "0.9rem", color: "#444" },
};
