import React, { useEffect, useRef, useState } from "react";

// --- IMPORT YOUR LOCAL VIDEO HERE ---
// This tells React to bundle this specific file
import localVideo from "../../assets/sim_video.mp4"; 

export default function VideoFeed() {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("sim"); // Default to Sim
  const [error, setError] = useState("");

  // 1. Get List of Cameras
  useEffect(() => {
    async function getCameras() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === "videoinput");
        
        const options = [
          { deviceId: "sim", label: "🧪 Simulation (Local File)" },
          ...videoDevices
        ];
        
        setDevices(options);
      } catch (err) {
        console.error("Camera Error:", err);
        setDevices([{ deviceId: "sim", label: "🧪 Simulation (Local File)" }]);
      }
    }
    getCameras();
  }, []);

  useEffect(() => {
    if (selectedDeviceId === "sim") return; 

    async function startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError("");
      } catch (err) {
        console.error("Stream Error:", err);
        setError("Could not start video stream.");
      }
    }
    startStream();
  }, [selectedDeviceId]);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>FPV Feed</h3>
        
        <select 
          style={styles.select} 
          value={selectedDeviceId} 
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0,5)}...`}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.videoWrapper}>
        {selectedDeviceId === "sim" ? (
          <video
            src={localVideo} // Uses the imported file
            autoPlay
            loop
            muted
            playsInline
            style={{...styles.video, objectFit: "cover"}} 
          />
        ) : (
          // --- REAL CAMERA MODE ---
          error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={styles.video} 
            />
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#000",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    height: "100%", 
    minHeight: "400px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "0 5px"
  },
  title: {
    color: "#fff",
    margin: 0,
    fontSize: "1rem",
    fontWeight: "bold",
    letterSpacing: "1px"
  },
  select: {
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "5px",
    fontSize: "0.8rem",
    maxWidth: "200px"
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: "5px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  error: {
    color: "#e74c3c",
    fontWeight: "bold"
  }
};