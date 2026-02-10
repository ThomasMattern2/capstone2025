import React, { useEffect, useRef, useState } from "react";
import mpegts from "mpegts.js";

// --- IMPORT YOUR LOCAL VIDEO HERE ---
import localVideo from "../../assets/sim_video.mp4"; 

export default function VideoFeed() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [deviceMode, setDeviceMode] = useState("sim"); // "sim", "stream", or "cam"
  const [error, setError] = useState("");

  // Cleanup player on unmount or mode change
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [deviceMode]);

  useEffect(() => {
    if (deviceMode === "stream") {
      // --- RTMP/FLV STREAM MODE ---
      if (mpegts.getFeatureList().mseLivePlayback) {
        const player = mpegts.createPlayer({
          type: 'flv',
          isLive: true,
          url: 'http://localhost:8000/live/drone.flv', // Connects to your new Node script
          hasAudio: false,
        });

        player.attachMediaElement(videoRef.current);
        player.load();
        player.play().catch(e => console.error("Autoplay blocked:", e));
        
        playerRef.current = player;

        player.on(mpegts.Events.ERROR, (e) => {
            console.error("Stream Error:", e);
            setError("Stream offline or connection failed.");
        });
      }
    } else if (deviceMode === "cam") {
      // --- WEBCAM MODE ---
      async function startCam() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
          setError("");
        } catch (err) {
          setError("Webcam access denied.");
        }
      }
      startCam();
    }
    // "sim" mode is handled by the video tag attributes directly
  }, [deviceMode]);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>FPV Feed</h3>
        
        <select 
          style={styles.select} 
          value={deviceMode} 
          onChange={(e) => {
            setError("");
            setDeviceMode(e.target.value);
          }}
        >
          <option value="sim">🧪 Simulation</option>
          <option value="stream">📡 Live Drone Stream (RTMP)</option>
          <option value="cam">📷 Local Webcam</option>
        </select>
      </div>

      <div style={styles.videoWrapper}>
        {deviceMode === "sim" ? (
          <video
            src={localVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{...styles.video, objectFit: "cover"}} 
          />
        ) : (
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            {error && <div style={styles.errorOverlay}>{error}</div>}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={styles.video} 
            />
          </div>
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
  errorOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#e74c3c', fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10
  }
};