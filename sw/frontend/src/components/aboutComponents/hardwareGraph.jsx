import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

import data from "./motocalc_results.json";

export default function MotoCalcGraph() {
  const [b, setB] = useState(0.49);

  // Calculate data ranges dynamically
  const { maxSpeed, maxThrust } = useMemo(() => {
    let maxSpeed = 0;
    let maxThrust = 0;
    Object.values(data).forEach((motorData) => {
      motorData.forEach((point) => {
        if (point.Speed > maxSpeed) maxSpeed = point.Speed;
        if (point.Thrust > maxThrust) maxThrust = point.Thrust;
      });
    });
    return { maxSpeed, maxThrust };
  }, [data]);

  // Generate the black drag curve
  const dragLine = useMemo(() => {
    const points = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const speed = (i / steps) * (maxSpeed || 150);
      const drag = (maxThrust || 500) * 0.001 * b * Math.pow(speed, 2);
      points.push({ speed, drag });
    }
    return points;
  }, [b, maxSpeed, maxThrust]);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Drag and Thrust vs Speed
      </h2>

      {/* Slider */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Drag Coefficient (b) = {b.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.01"
          value={b}
          onChange={(e) => setB(parseFloat(e.target.value))}
          style={{ width: "300px" }}
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={800}>
        <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="speed"
            label={{
              value: "V (m/s)",
              position: "insideBottomRight",
              offset: -5,
            }}
            type="number"
            domain={[0, maxSpeed || 200]}
          />
          <YAxis
            label={{
              value: "Drag / Thrust (g-force)",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[0, (maxThrust || 500) * 1.1]}
          />
          <Tooltip />
          <Legend />

          {/* Black drag curve */}
          <Line
            type="monotone"
            data={dragLine}
            dataKey="drag"
            stroke="black"
            name={`Drag (b=${b.toFixed(2)})`}
            dot={false}
            strokeWidth={2.5}
          />

          {/* Motor thrust curves */}
          {Object.entries(data).map(([motor, points], i) => (
            <Line
              key={motor}
              type="monotone"
              data={points.map((p) => ({
                speed: p.Speed,
                thrust: p.Thrust,
              }))}
              dataKey="thrust"
              strokeWidth={2}
              stroke={`hsl(${(i * 60) % 360}, 70%, 50%)`}
              name={motor}
              dot={false}
            />
          ))}
          <Brush
            dataKey="speed"
            height={30}
            stroke="#8884d8"
            travellerWidth={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
