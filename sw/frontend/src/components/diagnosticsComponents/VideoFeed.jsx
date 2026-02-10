import React, { useEffect, useRef, useState } from "react";
import mpegts from "mpegts.js";

export default function VideoFeed() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const chunks = useRef([]);

  useEffect(() => {
    if (mpegts.getFeatureList().mseLivePlayback) {
      const player = mpegts.createPlayer({
        type: 'flv',
        isLive: true,
        url: 'http://localhost:8000/live/drone.flv', 
        hasAudio: false,
      });

      player.attachMediaElement(videoRef.current);
      player.load();
      player.play().catch(e => console.error("Autoplay blocked:", e));
      
      playerRef.current = player;

      player.on(mpegts.Events.ERROR, (e) => {
          console.error("Stream Error:", e);
          setError("Drone stream offline or connection failed.");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const startRecording = () => {
    let stream = null;

    if (videoRef.current.captureStream) {
      stream = videoRef.current.captureStream();
    } else if (videoRef.current.mozCaptureStream) {
      stream = videoRef.current.mozCaptureStream();
    }

    if (!stream || (stream.getTracks && stream.getTracks().length === 0)) {
      setError("No active drone stream to record.");
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `drone_flight_${Date.now()}.webm`;
        a.click();
        chunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError("");
    } catch (e) {
      setError("Local recording not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Live Drone Feed</h3>
        
        <button 
            onClick={isRecording ? stopRecording : startRecording}
            style={{
                ...styles.recordButton, 
                backgroundColor: isRecording ? "#ff4d4d" : "#2ecc71"
            }}
        >
            {isRecording ? "Stop Local Rec" : "Start Local Rec"}
        </button>
      </div>

      <div style={styles.videoWrapper}>
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
  recordButton: {
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "bold",
    transition: "background-color 0.2s"
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
    zIndex: 10,
    textAlign: 'center',
    padding: '20px'
  }
};