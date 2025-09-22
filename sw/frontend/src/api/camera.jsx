// src/components/CameraHLS.jsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

/*
USE CASE

import CameraHLS from "./components/CameraHLS";

export default function Display() {
  return <CameraHLS src="http://localhost:8000/stream.m3u8" />;
}

*/

export default function CameraHLS({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src; // Safari
    }
  }, [src]);

  return (
    <div style={styles.wrapper}>
      <h2>Drone Camera</h2>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={styles.video}
        playsInline
      />
    </div>
  );
}

const styles = {
  wrapper: { textAlign: "center", marginTop: "1rem" },
  video: {
    width: "80%",
    maxWidth: 800,
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
};
