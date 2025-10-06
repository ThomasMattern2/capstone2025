import React from "react";
let source =
  "https://help.propelleraero.com/hc/article_attachments/25001354751895";

export default function FullImage({ src, alt = "image" }) {
  return (
    <div style={styles.container}>
      <img src={source} alt={alt} style={styles.image} />
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%", // takes full height of parent
    overflow: "hidden", // crop if image exceeds container
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // cover ensures it fills container without distortion
  },
};
