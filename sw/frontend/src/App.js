import React, { useEffect } from "react";

// Components
import Header from "./components/Header";
import Diagnostics from "./pages/DiagnosticsPage";

// Context & Store
import { ConnectionProvider } from "./context/ConnectedContext";
import { useTelemetryStore } from "./context/TelemetryStore";

function App() {
  const init = useTelemetryStore((state) => state.init);

  // Initialize Telemetry (Socket.io) when the app starts
  useEffect(() => {
    init(); 
  }, [init]);

  return (
    <ConnectionProvider>
      <div className="App">
        {/* Header (with Alerts) stays at the top */}
        <Header /> 
        
        {/* Main Content is strictly the Diagnostics Page */}
        <Diagnostics />
      </div>
    </ConnectionProvider>
  );
}

export default App;