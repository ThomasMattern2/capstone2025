import React, { useEffect } from "react";
import Diagnostics from "./pages/DiagnosticsPage";
import { useTelemetryStore } from "./context/TelemetryStore";

function App() {
  const init = useTelemetryStore((state) => state.init);

  useEffect(() => {
    init(); // Connect to Socket.io on load
  }, [init]);

  return <Diagnostics />;
}

export default App;