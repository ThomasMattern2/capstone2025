import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const useTelemetryStore = create((set, get) => ({
  // Real-time values
  battery: { voltage: 0, current: 0 },
  attitude: { pitch: 0, roll: 0, yaw: 0 },
  link: { rssi: 0, lq: 0 },
  gps: { sats: 0, alt: 0, lat: 0, lon: 0 },
  flightMode: "UNKNOWN",
  
  // Histories
  history: [],    // For Graph (Voltage/RSSI)
  gpsPath: [],    // For Map (Lat/Lon pairs)
  connected: false,

  init: () => {
    socket.on("connect", () => set({ connected: true }));
    socket.on("disconnect", () => set({ connected: false }));

    socket.on("vehicle_state", (msg) => {
      if (msg.type === "BATTERY") set({ battery: msg.data });
      if (msg.type === "ATTITUDE") set({ attitude: msg.data });
      if (msg.type === "LINK") set({ link: msg.data });
      if (msg.type === "GPS") set({ gps: msg.data });
      if (msg.type === "FLIGHT_MODE") set({ flightMode: msg.data.mode });
    });

    // SAMPLING LOOP (20ms / 50Hz)
    setInterval(() => {
      const state = get();
      if (!state.connected) return;

      const now = new Date().toLocaleTimeString();

      // 1. Update Graph History
      const newPoint = {
        time: now,
        voltage: state.battery.voltage,
        rssi: state.link.rssi,
        lq: state.link.lq
      };

      // 2. Update Map Path (Only if valid GPS)
      let newPath = state.gpsPath;
      const validGps = state.gps.lat !== 0 && state.gps.lon !== 0;
      
      if (validGps) {
        const lastPos = newPath.length > 0 ? newPath[newPath.length - 1] : null;
        const currentPos = [state.gps.lat, state.gps.lon];

        // Only add point if it moved slightly (simple filter to reduce duplicates)
        if (!lastPos || (lastPos[0] !== currentPos[0] || lastPos[1] !== currentPos[1])) {
           newPath = [...newPath, currentPos];
           // Limit trail to last 500 points to prevent lag
           if (newPath.length > 500) newPath.shift();
        }
      }

      set((prev) => {
        const newHistory = [...prev.history, newPoint];
        if (newHistory.length > 200) newHistory.shift(); 
        
        return { 
            history: newHistory,
            gpsPath: newPath
        };
      });
    }, 20);
  }
}));