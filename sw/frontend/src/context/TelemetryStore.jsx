// TODO make this connect to the pages as context
// USING zustand to avoid unnessecast rerenders.
import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Flask backend

export const useTelemetryStore = create((set) => {
  // listen for socket messages
  socket.on("vehicle_state", (msg) => {
    console.log("Received telemetry:", msg);
    set({ telemetry: msg });
  });

  return {
    telemetry: null, // initial state
    socket, // expose socket if you need to emit
  };
});
