import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// --- Configuration Constants ---
const CELLS = 12;
const VOLTAGE_WARNING_THRESHOLD = 3.3 * CELLS; // 39.6V
const CURRENT_WARNING_THRESHOLD = 280;         // 280A
const LQ_WARNING_THRESHOLD = 95;               // 95%
const ALT_MIN = 20;                            // 20m (Hard Deck)
const ALT_MAX = 120;                           // 120m (Ceiling)
const CONNECTION_TIMEOUT = 2000;               // 2 seconds

export const useTelemetryStore = create((set, get) => ({
  // Real-time values
  battery: { voltage: 0, current: 0, capacity: 0, remaining: 0 },
  attitude: { pitch: 0, roll: 0, yaw: 0 },
  link: { rssi: 0, lq: 0 },
  gps: { sats: 0, alt: 0, lat: 0, lon: 0 },
  flightMode: "UNKNOWN",

  // System State
  connected: false,
  lastPacketTime: Date.now(),
  alerts: [], // Stores list of active alert strings
  
  // AGL Logic
  homeAltitude: null, // Stores the ground level altitude

  // Histories
  history: [],
  gpsPath: [],

  init: () => {
    socket.on("connect", () => set({ connected: true }));
    socket.on("disconnect", () => set({ connected: false }));

    socket.on("vehicle_state", (msg) => {
      set({ lastPacketTime: Date.now() });

      if (msg.type === "BATTERY") set({ battery: msg.data });
      if (msg.type === "ATTITUDE") set({ attitude: msg.data });
      if (msg.type === "LINK") set({ link: msg.data });
      
      if (msg.type === "GPS") {
          const gpsData = msg.data;
          
          const currentHome = get().homeAltitude;
          if (currentHome === null && gpsData.sats >= 4) {
              set({ homeAltitude: gpsData.alt });
              console.log(`Home Altitude Set: ${gpsData.alt}m`);
          }
          
          set({ gps: gpsData });
      }
      
      if (msg.type === "FLIGHT_MODE") set({ flightMode: msg.data.mode });
    });

    // SAMPLING LOOP (20ms / 50Hz)
    setInterval(() => {
      const state = get();
      const now = new Date().toLocaleTimeString();
      const nowTs = Date.now();
      const activeAlerts = [];


      if (state.connected && (nowTs - state.lastPacketTime > CONNECTION_TIMEOUT)) {
        activeAlerts.push("CRITICAL: NO HEARTBEAT (2s)");
      }

      if (state.connected && (nowTs - state.lastPacketTime <= CONNECTION_TIMEOUT)) {
          // B. Battery (Independent Check)
          if (state.battery.voltage >= 0 && state.battery.voltage < VOLTAGE_WARNING_THRESHOLD) {
            activeAlerts.push(`LOW BATTERY: ${state.battery.voltage.toFixed(1)}V`);
          }

          if (state.battery.current > CURRENT_WARNING_THRESHOLD) {
            activeAlerts.push(`HIGH CURRENT: ${state.battery.current.toFixed(1)}A`);
          }

          if (state.link.lq >= 0 && state.link.lq < LQ_WARNING_THRESHOLD) {
            activeAlerts.push(`POOR LINK QUALITY: ${state.link.lq}%`);
          }

          const currentAlt = state.gps.alt;
          const homeAlt = state.homeAltitude !== null ? state.homeAltitude : currentAlt;
          const agl = currentAlt - homeAlt;

          if (state.gps.sats > 3) {
              if (agl < ALT_MIN) {
                  // Note: This will be active on the ground (0m < 20m)
                  activeAlerts.push(`LOW ALTITUDE (AGL): ${agl.toFixed(1)}m (< ${ALT_MIN}m)`);
              } else if (agl > ALT_MAX) {
                  activeAlerts.push(`HIGH ALTITUDE (AGL): ${agl.toFixed(1)}m (> ${ALT_MAX}m)`);
              }
          }
      }

      // --- 2. UPDATE HISTORY ---
      const newPoint = {
        time: now,
        voltage: state.battery.voltage,
        rssi: state.link.rssi,
        lq: state.link.lq
      };

      // Update Map Path
      let newPath = state.gpsPath;
      const validGps = state.gps.lat !== 0 && state.gps.lon !== 0;

      if (validGps) {
        const lastPos = newPath.length > 0 ? newPath[newPath.length - 1] : null;
        const currentPos = [state.gps.lat, state.gps.lon];

        if (!lastPos || (lastPos[0] !== currentPos[0] || lastPos[1] !== currentPos[1])) {
           newPath = [...newPath, currentPos];
           if (newPath.length > 500) newPath.shift();
        }
      }

      set((prev) => {
        const newHistory = [...prev.history, newPoint];
        if (newHistory.length > 200) newHistory.shift();

        return {
            history: newHistory,
            gpsPath: newPath,
            alerts: activeAlerts
        };
      });
    }, 20);
  }
}));