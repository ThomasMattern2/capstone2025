import React, { createContext, useState, useContext } from "react";

const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
  const [connected, setConnected] = useState(false);

  function toggleConnection() {
    console.log("Use to connect to the drone");
    console.log("GLOBAL STATE will use to check other places");
    setConnected((prev) => !prev);
  }

  return (
    <ConnectionContext.Provider value={{ connected, toggleConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
