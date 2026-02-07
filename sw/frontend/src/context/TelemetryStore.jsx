import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Flask backend

export const useTelemetryStore = create((set) => ({
  // --- STATE ---
  battery: { voltage: 0, current: 0, capacity: 0, remaining: 0 },
  attitude: { pitch: 0, roll: 0, yaw: 0 },
  gps: { lat: 0, lon: 0, alt: 0, sats: 0, gs: 0, hdg: 0 },
  link: { rssi: 0, lq: 0 },
  channels: Array(16).fill(0), // 16 RC Channels
  flightMode: "WAITING...",
  connected: false,

  // --- ACTIONS ---
  init: () => {
    socket.on("connect", () => {
      console.log("Connected to CRSF Backend");
      set({ connected: true });
    });

    socket.on("disconnect", () => {
      set({ connected: false });
    });

    socket.on("vehicle_state", (msg) => {
      switch (msg.type) {
        case "BATTERY":
          set({ battery: msg.data });
          break;
        case "ATTITUDE":
          set({ attitude: msg.data });
          break;
        case "GPS":
          set({ gps: msg.data });
          break;
        case "LINK":
          set({ link: msg.data });
          break;
        case "RC_CHANNELS":
          set({ channels: msg.data.channels });
          break;
        case "FLIGHT_MODE":
          set({ flightMode: msg.data.mode });
          break;
        default:
          break;
      }
    });
  },
}));