import React, { useState } from "react";
import { Menu } from "lucide-react"; // nice hamburger icon

import { hamburgerMenuLabels } from "../../constants/HamburgerMenuLabels";

export default function HamburgerMenu() {
  // initialize 10 random values
  const [values, setValues] = useState(
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <div>
      {/* Top bar */}
      <div style={styles.topbar}>
        <button onClick={toggleMenu} style={styles.hamburgerBtn}>
          <span style={styles.hamLine} />
          <span style={styles.hamLine} />
          <span style={styles.hamLine} />
        </button>
        <h2 style={styles.title}>Drone Dashboard</h2>
      </div>

      <div style={styles.contentWrap}>
        {/* Drawer */}
        <aside
          style={{
            ...styles.drawer,
            transform: menuOpen ? "translateX(0)" : "translateX(-110%)",
          }}
        >
          <h3 style={styles.drawerTitle}>Menu</h3>
          <ul style={{ paddingLeft: 0 }}>
            {hamburgerMenuLabels.map((lbl, i) => (
              <li key={i}>{lbl}</li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <main style={styles.main}>
          <div style={styles.grid}>
            {hamburgerMenuLabels.map((lbl, idx) => (
              <div key={idx} style={styles.box}>
                <div style={styles.label}>{lbl}</div> {/* NEW label */}
                <div style={styles.value}>{values[idx]}</div> {/* NEW value */}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, sans-serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f6f8fa",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem 1rem",
    background: "#20232a",
    color: "#fff",
  },
  title: { margin: 0, fontSize: "1.1rem", fontWeight: 600 },
  hamburgerBtn: {
    width: 44,
    height: 36,
    borderRadius: 8,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  hamLine: { display: "block", height: 2, width: "100%", background: "#fff" },

  contentWrap: { display: "flex", flex: 1, minHeight: 0 },
  drawer: {
    width: 250,
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "1rem",
    transition: "transform 0.2s ease",
  },
  drawerTitle: { margin: 0, fontSize: "1.1rem" },

  main: { flex: 1, padding: "1.25rem", overflow: "auto" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 5 columns
    gridAutoRows: "130px",
    gap: "1rem",
  },
  box: {
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.5rem",
    textAlign: "center",
  },
  label: { fontSize: "1rem", fontWeight: 600, marginBottom: 4 }, // NEW
  value: { fontSize: "0.9rem", color: "#444" }, // NEW small value
};
