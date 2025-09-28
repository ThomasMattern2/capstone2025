import React, { useState } from "react";

let source =
  "https://help.propelleraero.com/hc/article_attachments/25001354751895";

export default function FullImage({ src = source, alt = "image" }) {
  const [connected, setConnected] = useState(false);

  return (
    <div style={styles.container}>
      {!connected ? (
        <div style={styles.connectScreen}>
          <p style={styles.text}>Connect to camera</p>
          <button style={styles.button} onClick={() => setConnected(true)}>
            Connect
          </button>
        </div>
      ) : (
        <img src={src} alt={alt} style={styles.image} />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh", // full vertical height
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  connectScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  text: {
    color: "white",
    fontSize: "1.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};
