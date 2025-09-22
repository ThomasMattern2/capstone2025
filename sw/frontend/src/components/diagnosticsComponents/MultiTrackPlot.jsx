import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


// Sample data: time vs multiple tracks
const sampleData = [
  { time: 0, altitude: 100, speed: 20, battery: 95 },
  { time: 1, altitude: 105, speed: 22, battery: 94 },
  { time: 2, altitude: 110, speed: 24, battery: 92 },
  { time: 3, altitude: 108, speed: 23, battery: 91 },
  { time: 4, altitude: 112, speed: 25, battery: 90 },
];

export default function MultiTrackPlot({ data = sampleData }) {
  const [visibleTracks, setVisibleTracks] = useState({
    altitude: true,
    speed: true,
    battery: true,
  });

  const toggleTrack = (track) => {
    setVisibleTracks((prev) => ({ ...prev, [track]: !prev[track] }));
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      {/* Track toggle buttons */}
      <div style={{ marginBottom: 10 }}>
        {Object.keys(visibleTracks).map((track) => (
          <button
            key={track}
            onClick={() => toggleTrack(track)}
            style={{
              marginRight: 10,
              padding: "5px 10px",
              background: visibleTracks[track] ? "#4caf50" : "#ccc",
              color: visibleTracks[track] ? "#fff" : "#333",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            {track}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: "Time", position: "insideBottom", offset: -10 }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{ value: "Altitude / Battery", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Speed", angle: 90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          
          {/* Lines */}
          {visibleTracks.altitude && (
            <Line yAxisId="left" type="monotone" dataKey="altitude" stroke="#8884d8" />
          )}
          {visibleTracks.speed && (
            <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#82ca9d" />
          )}
          {visibleTracks.battery && (
            <Line yAxisId="left" type="monotone" dataKey="battery" stroke="#ffc658" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
