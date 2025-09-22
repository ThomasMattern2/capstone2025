import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>HawQ-2A</h1>
      <nav style={styles.nav}>
        <Link to="/display" style={styles.link}>
          Display
        </Link>
        <Link to="/diagnostics" style={styles.link}>
          Diagnostics
        </Link>
        <Link to="/about" style={styles.link}>
          About
        </Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#282c34",
    color: "#fff",
  },
  title: {
    fontSize: "1.5rem",
    margin: 0,
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
};
