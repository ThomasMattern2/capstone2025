import React from "react";

import { armVehicle, disarmVehicle } from "../../api/requests";

export default function ArmDisarm() {
  const handleArm = async () => {
    console.log("Arm button pressed");
    try {
      const response = await armVehicle();
      console.log("Response:", response);
    } catch (err) {
      console.error("Failed to arm vehicle:", err);
    }
  };

  const handleDisarm = async () => {
    console.log("Disarm button pressed");
    try {
      const response = await disarmVehicle();
      console.log("Response:", response);
    } catch (err) {
      console.error("Failed to disarm vehicle:", err);
    }
  };

  return (
    <div style={styles.container}>
      <button style={{ ...styles.button, ...styles.arm }} onClick={handleArm}>
        Arm
      </button>
      <button
        style={{ ...styles.button, ...styles.disarm }}
        onClick={handleDisarm}
      >
        Disarm
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed", // keep at bottom even when scrolling
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    background: "#f8f8f8",
    padding: "0.75rem 0",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
  },
  button: {
    flex: 1,
    maxWidth: 200,
    margin: "0 0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  arm: {
    background: "#28a745",
    color: "#fff",
  },
  disarm: {
    background: "#dc3545",
    color: "#fff",
  },
};
