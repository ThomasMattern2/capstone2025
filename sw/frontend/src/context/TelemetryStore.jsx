// TODO make this connect to the pages as context
// USING zustand to avoid unnessecast rerenders.
import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Flask backend

export const useTelemetryStore = create((set) => {
  const state = {
    telemetry: null,
    socket,
  };

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("vehicle_state", (msg) => {
    console.log("Received telemetry:", msg);
    set({ telemetry: msg });
  });

  return state;
});
