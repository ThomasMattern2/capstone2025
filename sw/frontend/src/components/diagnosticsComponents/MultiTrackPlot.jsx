import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useTelemetryStore } from "../../context/TelemetryStore";

export default function MultiTrackPlot() {
  const history = useTelemetryStore((state) => state.history);

  const [visible, setVisible] = useState({
    voltage: true,
    rssi: true,
    lq: true 
  });

  const toggle = (key) => setVisible(p => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ width: "100%", height: 500, background: "#fff", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
      <h3 style={{ textAlign: "center" }}>Link & Power Health</h3>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
        <ToggleBtn label="Voltage (V)" color="#ff7300" active={visible.voltage} onClick={() => toggle("voltage")} />
        <ToggleBtn label="RSSI (dBm)" color="#ff0000" active={visible.rssi} onClick={() => toggle("rssi")} />
        <ToggleBtn label="Link Quality (%)" color="#0000ff" active={visible.lq} onClick={() => toggle("lq")} />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis dataKey="time" tick={false} />
          
          {/* Left Axis: Voltage */}
          <YAxis yAxisId="left" domain={['auto', 'auto']} />
          
          {/* Right Axis 1: RSSI (Negative) */}
          <YAxis yAxisId="right_rssi" orientation="right" domain={[-130, 0]} hide={!visible.rssi} />

          {/* Right Axis 2: LQ (0-100%) */}
          <YAxis yAxisId="right_lq" orientation="right" domain={[0, 100]} hide={!visible.lq} />

          <Tooltip labelStyle={{color: "black"}} contentStyle={{backgroundColor: "rgba(255,255,255,0.9)"}} />
          <Legend />

          {visible.voltage && <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#ff7300" strokeWidth={2} dot={false} isAnimationActive={false} />}
          {visible.rssi && <Line yAxisId="right_rssi" type="monotone" dataKey="rssi" stroke="#ff0000" strokeWidth={2} dot={false} isAnimationActive={false} />}
          {visible.lq && <Line yAxisId="right_lq" type="monotone" dataKey="lq" stroke="#0000ff" strokeWidth={2} dot={false} isAnimationActive={false} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const ToggleBtn = ({ label, color, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 15px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold",
    backgroundColor: active ? color : "#eee", color: active ? "#fff" : "#555", transition: "0.2s"
  }}>
    {label}
  </button>
);