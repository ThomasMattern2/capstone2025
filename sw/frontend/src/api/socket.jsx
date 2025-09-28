import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Flask server address

export default function Telemetry() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    socket.on("vehicle_state", (msg) => {
      console.log("Received:", msg);
      setTelemetry(msg);
    });

    // cleanup
    return () => {
      socket.off("vehicle_state");
    };
  }, []);

  return (
    <div>
      <h2>Telemetry</h2>
      {telemetry ? (
        <pre>{JSON.stringify(telemetry, null, 2)}</pre>
      ) : (
        <p>No data yet...</p>
      )}
    </div>
  );
}
